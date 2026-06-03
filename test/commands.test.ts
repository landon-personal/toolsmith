import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { runCompare } from "../src/commands/compare.js";
import { runEval } from "../src/commands/eval.js";
import { runImportOpenApi } from "../src/commands/importOpenApi.js";
import { runInit } from "../src/commands/init.js";
import { runLint } from "../src/commands/lint.js";
import { runReport } from "../src/commands/report.js";
import { evaluate } from "../src/evaluator.js";
import { importOpenApiDocument } from "../src/importers/openapi.js";
import { buildCli } from "../src/index.js";
import { lintToolFile } from "../src/linter.js";
import { chooseMockTool } from "../src/mockAgent.js";
import { buildConfusionMatrix } from "../src/reports/confusionMatrix.js";
import { renderHtmlReport } from "../src/reports/htmlReport.js";
import { renderMarkdownReport } from "../src/reports/markdownReport.js";
import { LATEST_RUN_PATH } from "../src/results.js";
import type { EvalRun, FailureCategory, ToolDefinition, ToolFile, ToolLintIssue } from "../src/types.js";
import { loadTasksFile, loadToolsFile } from "../src/validation.js";
import { VERSION } from "../src/version.js";

const CALENDAR_EMAIL_EXAMPLE = join("examples", "calendar-email");
const CALENDAR_EMAIL_TOOLS_PATH = join(CALENDAR_EMAIL_EXAMPLE, "tools.json");
const CALENDAR_EMAIL_TASKS_PATH = join(CALENDAR_EMAIL_EXAMPLE, "tasks.json");
const OPENAPI_EXAMPLE = join("examples", "openapi");
const OPENAPI_TINY_API_PATH = join(OPENAPI_EXAMPLE, "tiny-api.json");

function captureOutput(): { lines: string[]; io: { stdout(message: string): void; stderr(message: string): void } } {
  const lines: string[] = [];

  return {
    lines,
    io: {
      stdout(message: string): void {
        lines.push(message);
      },
      stderr(message: string): void {
        lines.push(message);
      }
    }
  };
}

function lintIssues(tools: ToolDefinition[]): ToolLintIssue[] {
  const toolFile: ToolFile = {
    name: "test-tools",
    version: "0.4.1",
    tools
  };

  return lintToolFile(toolFile).issues;
}

async function writeExample(
  directory: string,
  tasks: Array<{ id: string; prompt: string; expectedTool: string }>
): Promise<void> {
  await writeCustomExample(directory, [
    { name: "create_calendar_event", description: "Use this tool when scheduling calendar events." },
    { name: "send_email", description: "Use this tool when sending email messages." }
  ], tasks);
}

async function writeCustomExample(
  directory: string,
  tools: ToolDefinition[],
  tasks: Array<{ id: string; prompt: string; expectedTool: string }>
): Promise<void> {
  await writeFile(
    join(directory, "tools.json"),
    JSON.stringify(
      {
        name: "test-tools",
        version: "0.4.1",
        tools
      },
      null,
      2
    ),
    "utf8"
  );
  await writeFile(
    join(directory, "tasks.json"),
    JSON.stringify({ name: "test-tasks", version: "0.4.1", tasks }, null, 2),
    "utf8"
  );
}

async function writeRun(directory: string, fileName: string, run: EvalRun): Promise<void> {
  await writeFile(join(directory, fileName), `${JSON.stringify(run, null, 2)}\n`, "utf8");
}

function buildRunFixture(
  id: string,
  total: number,
  passed: number,
  failed: number,
  failureCategories: Partial<Record<FailureCategory, number>>
): EvalRun {
  return {
    id,
    version: "1.0.0",
    createdAt: "2026-06-03T00:00:00.000Z",
    examplePath: ".",
    toolsPath: "tools.json",
    tasksPath: "tasks.json",
    agent: {
      name: "keyword-mock-agent",
      version: "1.0.0"
    },
    summary: {
      total,
      passed,
      failed,
      score: total === 0 ? 0 : Math.round((passed / total) * 10000) / 100,
      scoreBreakdown: {
        correct_tool_selection: 100,
        valid_arguments: 100,
        no_unnecessary_tool_calls: 100,
        safe_behavior: 100,
        clarification_behavior: 100,
        error_recovery: 100
      },
      failureCategories
    },
    results: []
  };
}

describe("ToolSmith commands", () => {
  beforeEach(async () => {
    await rm(join(process.cwd(), ".toolsmith"), { recursive: true, force: true });
  });

  it("builds a CLI with the expected commands", () => {
    const program = buildCli(captureOutput().io);
    const commandNames = program.commands.map((command) => command.name());

    expect(program.name()).toBe("toolsmith");
    expect(program.version()).toBe(VERSION);
    expect(commandNames).toEqual(expect.arrayContaining(["init", "lint", "eval", "report", "compare", "import"]));
  });

  it("has package-ready CLI metadata", async () => {
    const packageJson = JSON.parse(await readFile("package.json", "utf8"));
    const disallowedPackageFiles = ["node_modules", "coverage", ".toolsmith/runs", ".env", ".env.*", "test", "src"];

    expect(packageJson.version).toBe("1.0.3");
    expect(VERSION).toBe(packageJson.version);
    expect(packageJson.bin).toEqual({ toolsmith: "./dist/cli.js" });
    expect(packageJson.repository).toEqual({
      type: "git",
      url: "git+https://github.com/landon-personal/toolsmith.git"
    });
    expect(packageJson.bugs).toEqual({ url: "https://github.com/landon-personal/toolsmith/issues" });
    expect(packageJson.files).toEqual(
      expect.arrayContaining(["dist", "README.md", "LICENSE", "CHANGELOG.md", "docs", "examples"])
    );
    expect(packageJson.files).not.toEqual(expect.arrayContaining(disallowedPackageFiles));
    expect(packageJson.scripts["package:check"]).toContain("scripts/package-check.mjs");
    expect(packageJson.scripts["release:audit"]).toContain("scripts/release-audit.mjs");
  });

  it("keeps public beta documentation files in place", async () => {
    const docs = [
      "docs/TROUBLESHOOTING.md",
      "docs/index.md",
      "docs/_config.yml",
      "LICENSE",
      "docs/RELEASE_CHECKLIST.md",
      "docs/CROSS_PLATFORM.md",
      "docs/SCHEMA.md",
      "docs/MIGRATIONS.md",
      "docs/RELEASE_NOTES_v1.0.0.md",
      "docs/PUBLIC_REPOSITORY_PREP.md",
      "docs/SECURITY.md",
      "docs/PRIVACY.md",
      "docs/CONTRIBUTING.md",
      "docs/site/index.md",
      "docs/site/quickstart.md",
      "docs/site/installation.md",
      "examples/calendar-email/README.md",
      "examples/confusing-tools/README.md",
      "examples/openapi/README.md"
    ];

    await Promise.all(docs.map((path) => expect(access(path)).resolves.toBeUndefined()));
  });

  it("initializes a local config file", async () => {
    const directory = await mkdtemp(join(tmpdir(), "toolsmith-"));
    const output = captureOutput();

    try {
      await runInit({ directory }, output.io);

      const config = JSON.parse(await readFile(join(directory, "toolsmith.config.json"), "utf8"));
      expect(config.version).toBe("1.0.3");
      expect(config.safety.network).toBe(false);
      expect(config.safety.realEmail).toBe(false);
      expect(output.lines[0]).toContain("Created");
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("loads valid tools and tasks", async () => {
    const tools = await loadToolsFile(CALENDAR_EMAIL_TOOLS_PATH);
    const tasks = await loadTasksFile(CALENDAR_EMAIL_TASKS_PATH);

    expect(tools.tools.map((tool) => tool.name)).toEqual(["create_calendar_event", "send_email"]);
    expect(tasks.tasks).toHaveLength(5);
    expect(tasks.tasks[0]?.expectedTool).toBe("create_calendar_event");
  });

  it("keeps v0.1.0 calendar-email tools valid without examples", async () => {
    const tools = await loadToolsFile(CALENDAR_EMAIL_TOOLS_PATH);

    expect(tools.version).toBe("0.1.0");
    expect(tools.tools).toHaveLength(2);
    expect(tools.tools.every((tool) => tool.examples === undefined)).toBe(true);
  });

  it("rejects invalid tools and tasks", async () => {
    const directory = await mkdtemp(join(tmpdir(), "toolsmith-invalid-"));

    try {
      const invalidToolsPath = join(directory, "tools.json");
      const invalidTasksPath = join(directory, "tasks.json");
      await writeFile(invalidToolsPath, JSON.stringify({ name: "bad", version: "0.1.0", tools: [] }), "utf8");
      await writeFile(
        invalidTasksPath,
        JSON.stringify({ name: "bad", version: "0.1.0", tasks: [{ id: "missing-fields" }] }),
        "utf8"
      );

      await expect(loadToolsFile(invalidToolsPath)).rejects.toThrow("must include at least one tool");
      await expect(loadTasksFile(invalidTasksPath)).rejects.toThrow("prompt must be a non-empty string");
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("lint command prints a static report", async () => {
    const output = captureOutput();
    const report = await runLint({ examplePath: CALENDAR_EMAIL_EXAMPLE }, output.io);

    expect(report.toolsChecked).toBe(2);
    expect(report.summary.warning).toBeGreaterThan(0);
    expect(output.lines).toContain("ToolSmith Lint Report");
    expect(output.lines).toContain("Tools checked: 2");
    expect(output.lines.some((line) => line.includes("[warning] send_email"))).toBe(true);
  });

  it("linter catches vague tool names", () => {
    const issues = lintIssues([
      {
        name: "process_data",
        description: "Use this tool when raw import data needs normalization.",
        examples: ["Normalize imported rows."]
      }
    ]);

    expect(issues.some((issue) => issue.id === "vague-tool-name" && issue.toolName === "process_data")).toBe(true);
  });

  it("linter catches missing and weak descriptions", () => {
    const issues = lintIssues([
      { name: "search_docs", examples: ["Find API docs."] },
      { name: "draft_reply", description: "Draft reply.", examples: ["Draft a response."] }
    ]);

    expect(issues.some((issue) => issue.id === "missing-description" && issue.toolName === "search_docs")).toBe(true);
    expect(issues.some((issue) => issue.id === "weak-description" && issue.toolName === "draft_reply")).toBe(true);
  });

  it("linter catches unclear parameter names", () => {
    const issues = lintIssues([
      {
        name: "create_ticket",
        description: "Use this tool when a support ticket should be created.",
        inputSchema: {
          type: "object",
          properties: {
            payload: {
              type: "object"
            }
          }
        },
        examples: ["Create a support ticket for a billing problem."]
      }
    ]);

    expect(issues.some((issue) => issue.id === "unclear-parameter-name")).toBe(true);
  });

  it("linter catches overlapping tools", () => {
    const issues = lintIssues([
      {
        name: "send_message",
        description: "Use this tool when sending an internal message to a user.",
        inputSchema: {
          type: "object",
          properties: {
            recipient: {
              type: "string"
            }
          }
        },
        examples: ["Message a teammate."]
      },
      {
        name: "send_email",
        description: "Use this tool when sending an email message to a user.",
        inputSchema: {
          type: "object",
          properties: {
            to: {
              type: "string"
            }
          }
        },
        examples: ["Email a teammate."]
      }
    ]);

    expect(issues.some((issue) => issue.id === "overlapping-tools")).toBe(true);
  });

  it("linter catches risky side-effect tools", () => {
    const issues = lintIssues([
      {
        name: "delete_item",
        description: "Use this tool when deleting an item from the local mock store.",
        inputSchema: {
          type: "object",
          properties: {
            itemId: {
              type: "string"
            }
          }
        },
        examples: ["Delete a mock item."]
      }
    ]);

    expect(issues.some((issue) => issue.id === "risky-side-effect-tool")).toBe(true);
  });

  it("linter warns about missing examples", () => {
    const issues = lintIssues([
      {
        name: "lookup_user",
        description: "Use this tool when looking up a user by id."
      }
    ]);

    expect(issues.some((issue) => issue.id === "missing-examples" && issue.toolName === "lookup_user")).toBe(true);
  });

  it("imports OpenAPI fixture into valid lintable tools", async () => {
    const directory = await mkdtemp(join(tmpdir(), "toolsmith-openapi-"));
    const output = captureOutput();

    try {
      const out = join(directory, "tools.generated.json");
      const result = await runImportOpenApi(OPENAPI_TINY_API_PATH, { out }, output.io);
      const generated = await loadToolsFile(out);
      const lintReport = lintToolFile(generated);

      expect(result.pathsScanned).toBe(4);
      expect(result.operationsImported).toBe(5);
      expect(generated.version).toBe("1.0.3");
      expect(generated.tools.map((tool) => tool.name)).toEqual([
        "get_user_by_id",
        "delete_user",
        "create_user",
        "get_orders",
        "refund_order"
      ]);
      expect(lintReport.toolsChecked).toBe(5);
      expect(output.lines).toContain("ToolSmith OpenAPI Import");
      expect(output.lines).toContain("Operations imported: 5");
      expect(output.lines).toContain("Safety: generated tool definitions only; no imported API operations were executed.");
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("normalizes operationId and fallback names", async () => {
    const document = JSON.parse(await readFile(OPENAPI_TINY_API_PATH, "utf8"));
    const result = importOpenApiDocument(document);

    expect(result.toolFile.tools.find((tool) => tool.name === "create_user")).toBeDefined();
    expect(result.toolFile.tools.find((tool) => tool.name === "get_orders")).toBeDefined();
  });

  it("converts path query and JSON request body parameters", async () => {
    const document = JSON.parse(await readFile(OPENAPI_TINY_API_PATH, "utf8"));
    const result = importOpenApiDocument(document);
    const getUser = result.toolFile.tools.find((tool) => tool.name === "get_user_by_id");
    const createUser = result.toolFile.tools.find((tool) => tool.name === "create_user");

    expect(getUser?.inputSchema?.properties).toMatchObject({
      id: { type: "string" },
      include_orders: { type: "boolean" }
    });
    expect(getUser?.inputSchema?.required).toEqual(["id"]);
    expect(createUser?.inputSchema?.properties).toMatchObject({
      email: { type: "string" },
      name: { type: "string" },
      role: { type: "string", enum: ["admin", "member"] }
    });
    expect(createUser?.inputSchema?.required).toEqual(["email", "name"]);
  });

  it("marks non-GET imported operations as warning-friendly side effect tools", async () => {
    const document = JSON.parse(await readFile(OPENAPI_TINY_API_PATH, "utf8"));
    const result = importOpenApiDocument(document);
    const deleteUser = result.toolFile.tools.find((tool) => tool.name === "delete_user");
    const refundOrder = result.toolFile.tools.find((tool) => tool.name === "refund_order");

    expect(deleteUser?.requiresConfirmation).toBe(true);
    expect(deleteUser?.sideEffects).toContain("destructive");
    expect(refundOrder?.requiresConfirmation).toBe(true);
    expect(refundOrder?.sideEffects).toContain("external side effect");
  });

  it("OpenAPI import handles unsupported and malformed operations without crashing", () => {
    const result = importOpenApiDocument({
      openapi: "3.0.3",
      info: { title: "Odd API" },
      paths: {
        "/items": {
          get: {
            summary: "List items.",
            parameters: "bad"
          },
          trace: {
            summary: "Trace items."
          },
          post: "bad"
        }
      }
    });

    expect(result.operationsImported).toBe(1);
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        "Skipping parameters for GET /items: parameters must be an array.",
        'Skipping unsupported method "TRACE" for /items.',
        "Skipping POST /items: operation must be an object."
      ])
    );
  });

  it("OpenAPI import reports missing and malformed files with friendly errors", async () => {
    const directory = await mkdtemp(join(tmpdir(), "toolsmith-openapi-invalid-"));

    try {
      await writeFile(join(directory, "malformed.json"), "{", "utf8");

      await expect(
        runImportOpenApi(join(directory, "missing.json"), { out: join(directory, "tools.json") }, captureOutput().io)
      ).rejects.toThrow("Missing OpenAPI file");
      await expect(
        runImportOpenApi(join(directory, "malformed.json"), { out: join(directory, "tools.json") }, captureOutput().io)
      ).rejects.toThrow("Malformed OpenAPI file");
      await expect(
        runImportOpenApi(OPENAPI_TINY_API_PATH, {}, captureOutput().io)
      ).rejects.toThrow("Missing required --out");
      await expect(
        runImportOpenApi(join(directory, "not-openapi.json"), { out: join(directory, "tools.json") }, captureOutput().io)
      ).rejects.toThrow("Missing OpenAPI file");
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("OpenAPI import reports invalid document shape with a friendly error", () => {
    expect(() => importOpenApiDocument([])).toThrow("OpenAPI file must contain a JSON object.");
    expect(() => importOpenApiDocument({ openapi: "3.0.3" })).toThrow('OpenAPI file must include a "paths" object.');
  });

  it("mock agent chooses expected tools by keyword", () => {
    const tools: ToolDefinition[] = [
      { name: "create_calendar_event", description: "Mock calendar tool." },
      { name: "send_email", description: "Mock email tool." }
    ];

    expect(chooseMockTool("Schedule a meeting.", tools).toolCall?.toolName).toBe("create_calendar_event");
    expect(chooseMockTool("Email the release notes.", tools).toolCall?.toolName).toBe("send_email");
    expect(chooseMockTool("Message Alex about the meeting.", tools).toolCall?.toolName).toBe("send_email");
    expect(chooseMockTool("Think about the plan.", tools).toolCall).toBeNull();
  });

  it("eval categorizes passed, wrong-tool, and clarification results", async () => {
    const run = await evaluate({ examplePath: CALENDAR_EMAIL_EXAMPLE });

    expect(run.summary.total).toBe(5);
    expect(run.summary.passed).toBe(3);
    expect(run.summary.failed).toBe(2);
    expect(run.summary.score).toBe(60);
    expect(run.summary.failureCategories).toEqual({
      wrong_tool: 1,
      should_have_asked_clarifying_question: 1
    });
    expect(Object.keys(run.summary.scoreBreakdown)).toEqual([
      "correct_tool_selection",
      "valid_arguments",
      "no_unnecessary_tool_calls",
      "safe_behavior",
      "clarification_behavior",
      "error_recovery"
    ]);
    expect(run.summary.scoreBreakdown.correct_tool_selection).toBe(80);
    expect(run.summary.scoreBreakdown.valid_arguments).toBe(100);
    expect(run.results.find((result) => result.taskId === "calendar-schedule-demo")?.failureCategory).toBe("passed");
    expect(run.results.find((result) => result.taskId === "calendar-ambiguous-message-meeting")?.failureCategory).toBe(
      "wrong_tool"
    );
    expect(run.results.find((result) => result.taskId === "email-unclear-followup")?.failureCategory).toBe(
      "should_have_asked_clarifying_question"
    );
  });

  it("eval categorizes missing tool calls, hallucinated tools, and unavailable expected tools", async () => {
    const directory = await mkdtemp(join(tmpdir(), "toolsmith-categories-"));

    try {
      await writeExample(directory, [
        { id: "no-tool", prompt: "Prepare release notes for Jordan.", expectedTool: "send_email" },
        { id: "unexpected-tool", prompt: "Email Jordan the release notes.", expectedTool: "none" },
        { id: "missing-tool", prompt: "Schedule a meeting with Jordan.", expectedTool: "create_task" }
      ]);

      const run = await evaluate({ examplePath: ".", cwd: directory });

      expect(run.summary.failureCategories).toEqual({
        missing_tool_call: 2,
        hallucinated_tool: 1
      });
      expect(run.results.map((result) => result.failureCategory)).toEqual([
        "missing_tool_call",
        "hallucinated_tool",
        "missing_tool_call"
      ]);
      expect(run.results.every((result) => result.reason.length > 0 && result.recommendation.length > 0)).toBe(true);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("eval categorizes missing required arguments and invalid arguments", async () => {
    const missingDirectory = await mkdtemp(join(tmpdir(), "toolsmith-missing-arg-"));
    const invalidDirectory = await mkdtemp(join(tmpdir(), "toolsmith-invalid-arg-"));

    try {
      await writeCustomExample(
        missingDirectory,
        [
          { name: "create_calendar_event", description: "Use this tool when scheduling calendar events." },
          {
            name: "send_email",
            description: "Use this tool when sending email messages.",
            inputSchema: {
              type: "object",
              properties: {
                to: { type: "string" },
                subject: { type: "string" },
                body: { type: "string" },
                cc: { type: "string" }
              },
              required: ["to", "subject", "body", "cc"]
            }
          }
        ],
        [{ id: "missing-cc", prompt: "Email Jordan the release notes.", expectedTool: "send_email" }]
      );

      await writeCustomExample(
        invalidDirectory,
        [
          { name: "create_calendar_event", description: "Use this tool when scheduling calendar events." },
          {
            name: "send_email",
            description: "Use this tool when sending email messages.",
            inputSchema: {
              type: "object",
              properties: {
                to: { type: "string" },
                subject: { type: "string" },
                body: { type: "number" }
              },
              required: ["to", "subject", "body"]
            }
          }
        ],
        [{ id: "invalid-body", prompt: "Email Jordan the release notes.", expectedTool: "send_email" }]
      );

      const missingRun = await evaluate({ examplePath: ".", cwd: missingDirectory });
      const invalidRun = await evaluate({ examplePath: ".", cwd: invalidDirectory });

      expect(missingRun.results[0]?.failureCategory).toBe("missing_required_argument");
      expect(missingRun.summary.failureCategories).toEqual({ missing_required_argument: 1 });
      expect(missingRun.summary.scoreBreakdown.valid_arguments).toBe(0);
      expect(invalidRun.results[0]?.failureCategory).toBe("invalid_arguments");
      expect(invalidRun.summary.failureCategories).toEqual({ invalid_arguments: 1 });
      expect(invalidRun.summary.scoreBreakdown.valid_arguments).toBe(0);
    } finally {
      await rm(missingDirectory, { recursive: true, force: true });
      await rm(invalidDirectory, { recursive: true, force: true });
    }
  });

  it("eval produces and writes local results", async () => {
    const output = captureOutput();

    const run = await runEval({ examplePath: CALENDAR_EMAIL_EXAMPLE }, output.io);
    const latestRun = JSON.parse(await readFile(join(process.cwd(), LATEST_RUN_PATH), "utf8"));

    expect(run.summary.total).toBe(5);
    expect(run.summary.passed).toBe(3);
    expect(run.summary.failed).toBe(2);
    expect(latestRun.summary.score).toBe(run.summary.score);
    expect(output.lines).toContain("Score: 3/5 (60%)");
    expect(output.lines).toContain("Score breakdown:");
    expect(output.lines).toContain("- correct_tool_selection: 80%");
    expect(output.lines).toContain("- valid_arguments: 100%");
    expect(output.lines).toContain("Failure breakdown:");
    expect(output.lines).toContain("- wrong_tool: 1");
    expect(output.lines).toContain("- should_have_asked_clarifying_question: 1");
    expect(output.lines).toContain("Next: npm run dev -- report");
  });

  it("eval fail-under passes when score meets the threshold", async () => {
    const output = captureOutput();

    const run = await runEval({ examplePath: CALENDAR_EMAIL_EXAMPLE, failUnder: 60 }, output.io);

    expect(run.summary.score).toBe(60);
    expect(output.lines).toContain("Fail-under threshold: 60%");
    expect(output.lines).toContain("CI result: passed");
  });

  it("eval fail-under fails when score is below the threshold", async () => {
    const output = captureOutput();

    await expect(runEval({ examplePath: CALENDAR_EMAIL_EXAMPLE, failUnder: 80 }, output.io)).rejects.toThrow(
      "CI threshold failed"
    );
    expect(output.lines).toContain("Fail-under threshold: 80%");
    expect(output.lines).toContain("CI result: failed");
    await expect(access(join(process.cwd(), LATEST_RUN_PATH))).resolves.toBeUndefined();
  });

  it("eval fail-under rejects invalid thresholds with a friendly error", async () => {
    const program = buildCli(captureOutput().io);

    await expect(
      program.parseAsync(["eval", CALENDAR_EMAIL_EXAMPLE, "--fail-under", "not-a-number"], { from: "user" })
    ).rejects.toThrow('Invalid --fail-under value "not-a-number". Use a number from 0 to 100.');
  });

  it("report reads latest results", async () => {
    const evalOutput = captureOutput();
    const reportOutput = captureOutput();

    await runEval({ examplePath: CALENDAR_EMAIL_EXAMPLE }, evalOutput.io);
    const run = await runReport({}, reportOutput.io);

    expect(run.summary.score).toBe(60);
    expect(reportOutput.lines).toContain("ToolSmith latest report");
    expect(reportOutput.lines).toContain("Score: 3/5 (60%)");
    expect(reportOutput.lines).toContain("Score breakdown:");
    expect(reportOutput.lines).toContain("- correct_tool_selection: 80%");
    expect(reportOutput.lines).toContain("- wrong_tool: 1");
    expect(reportOutput.lines).toContain("- should_have_asked_clarifying_question: 1");
    expect(reportOutput.lines).toContain("[wrong_tool]");
    expect(reportOutput.lines.some((line) => line.includes("Expected: create_calendar_event"))).toBe(true);
    expect(reportOutput.lines.some((line) => line.includes("Actual: send_email"))).toBe(true);
    expect(reportOutput.lines.some((line) => line.includes("Recommendation:"))).toBe(true);
    await expect(access(join(process.cwd(), LATEST_RUN_PATH))).resolves.toBeUndefined();
  });

  it("generates markdown reports with score, failures, tasks, recommendations, and raw JSON", async () => {
    const run = await evaluate({ examplePath: CALENDAR_EMAIL_EXAMPLE });
    const markdown = renderMarkdownReport(run, new Date("2026-06-03T00:00:00.000Z"));

    expect(markdown).toContain("# ToolSmith Eval Report");
    expect(markdown).toContain("Score: 3/5 (60%)");
    expect(markdown).toContain("should_have_asked_clarifying_question: 1");
    expect(markdown).toContain("| calendar-ambiguous-message-meeting |");
    expect(markdown).toContain("Recommendation:");
    expect(markdown).toContain("| create_calendar_event | send_email | 1 |");
    expect(markdown).toContain("```json");
  });

  it("generates escaped static html reports without external resources", async () => {
    const directory = await mkdtemp(join(tmpdir(), "toolsmith-html-"));

    try {
      await writeCustomExample(
        directory,
        [
          { name: "create_calendar_event", description: "Use this tool when scheduling calendar events." },
          { name: "send_email", description: "Use this tool when sending email messages." }
        ],
        [
          {
            id: "html-escape",
            prompt: "Email <script>alert('x')</script> to Jordan.",
            expectedTool: "none"
          }
        ]
      );

      const run = await evaluate({ examplePath: ".", cwd: directory });
      const html = renderHtmlReport(run, new Date("2026-06-03T00:00:00.000Z"));

      expect(html).toContain("<title>ToolSmith Eval Report</title>");
      expect(html).toContain("&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;");
      expect(html).not.toContain("<script");
      expect(html).not.toContain("https://");
      expect(html).not.toContain("http://");
      expect(html).toContain("<details>");
      expect(html).toContain("Tool Confusion Matrix");
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("builds confusion matrix counts", async () => {
    const run = await evaluate({ examplePath: CALENDAR_EMAIL_EXAMPLE });
    const matrix = buildConfusionMatrix(run);

    expect(matrix).toEqual(
      expect.arrayContaining([
        { expectedTool: "create_calendar_event", actualTool: "create_calendar_event", count: 1 },
        { expectedTool: "create_calendar_event", actualTool: "send_email", count: 1 },
        { expectedTool: "send_email", actualTool: "none", count: 1 }
      ])
    );
  });

  it("report command supports markdown, html, json, run path, and out files", async () => {
    const directory = await mkdtemp(join(tmpdir(), "toolsmith-report-"));
    const output = captureOutput();

    try {
      await writeExample(directory, [
        { id: "calendar", prompt: "Schedule a meeting with Jordan.", expectedTool: "create_calendar_event" },
        { id: "ambiguous", prompt: "Message Jordan about a meeting.", expectedTool: "create_calendar_event" },
        { id: "email", prompt: "Email Jordan the release notes.", expectedTool: "send_email" }
      ]);
      await runEval({ examplePath: ".", cwd: directory }, captureOutput().io);

      const markdownRun = await runReport(
        { cwd: directory, format: "markdown", out: "custom-report.md" },
        output.io
      );
      await runReport({ cwd: directory, format: "html" }, output.io);
      await runReport({ cwd: directory, format: "json", out: "report.json" }, output.io);
      await runReport(
        { cwd: directory, runPath: join(".toolsmith", "runs", "latest.json"), format: "markdown", out: "by-path.md" },
        output.io
      );

      const markdown = await readFile(join(directory, "custom-report.md"), "utf8");
      const html = await readFile(join(directory, "report.html"), "utf8");
      const json = JSON.parse(await readFile(join(directory, "report.json"), "utf8"));
      const byPath = await readFile(join(directory, "by-path.md"), "utf8");

      expect(markdownRun.summary.score).toBe(66.67);
      expect(markdown).toContain("# ToolSmith Eval Report");
      expect(html).toContain("<title>ToolSmith Eval Report</title>");
      expect(json.summary.score).toBe(66.67);
      expect(byPath).toContain("Tool Confusion Matrix");
      expect(output.lines).toContain("Report written to custom-report.md");
      expect(output.lines).toContain("Report written to report.html");
      expect(output.lines).toContain("Report written to report.json");
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("compare command reports score regressions and failure category changes", async () => {
    const directory = await mkdtemp(join(tmpdir(), "toolsmith-compare-"));
    const output = captureOutput();

    try {
      await writeRun(directory, "baseline.json", buildRunFixture("baseline", 2, 2, 0, {}));
      await writeRun(directory, "current.json", buildRunFixture("current", 2, 1, 1, { wrong_tool: 1 }));

      const report = await runCompare("baseline.json", "current.json", { cwd: directory }, output.io);

      expect(report.scoreDelta).toBe(-50);
      expect(report.hasRegression).toBe(true);
      expect(report.newFailureCategories).toEqual(["wrong_tool"]);
      expect(output.lines).toContain("Baseline score: 100%");
      expect(output.lines).toContain("Current score: 50%");
      expect(output.lines).toContain("Delta: -50%");
      expect(output.lines).toContain("- wrong_tool increased from 0 to 1");
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("compare command reports score improvements and resolved failures", async () => {
    const directory = await mkdtemp(join(tmpdir(), "toolsmith-compare-improvement-"));
    const output = captureOutput();

    try {
      await writeRun(directory, "baseline.json", buildRunFixture("baseline", 2, 1, 1, { missing_tool_call: 1 }));
      await writeRun(directory, "current.json", buildRunFixture("current", 2, 2, 0, {}));

      const report = await runCompare("baseline.json", "current.json", { cwd: directory }, output.io);

      expect(report.scoreDelta).toBe(50);
      expect(report.hasImprovement).toBe(true);
      expect(report.resolvedFailureCategories).toEqual(["missing_tool_call"]);
      expect(output.lines).toContain("Current score: 100%");
      expect(output.lines).toContain("- missing_tool_call decreased from 1 to 0");
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("compare fail-on-regression exits non-zero on score regression", async () => {
    const directory = await mkdtemp(join(tmpdir(), "toolsmith-compare-fail-"));

    try {
      await writeRun(directory, "baseline.json", buildRunFixture("baseline", 2, 2, 0, {}));
      await writeRun(directory, "current.json", buildRunFixture("current", 2, 1, 1, { wrong_tool: 1 }));

      await expect(
        runCompare("baseline.json", "current.json", { cwd: directory, failOnRegression: true }, captureOutput().io)
      ).rejects.toThrow("Regression detected");
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("compare handles missing and malformed run files", async () => {
    const directory = await mkdtemp(join(tmpdir(), "toolsmith-compare-invalid-"));

    try {
      await writeRun(directory, "baseline.json", buildRunFixture("baseline", 1, 1, 0, {}));
      await writeFile(join(directory, "malformed.json"), "{", "utf8");
      await writeFile(join(directory, "not-run.json"), JSON.stringify({ summary: { score: 100 } }), "utf8");

      await expect(runCompare("missing.json", "baseline.json", { cwd: directory }, captureOutput().io)).rejects.toThrow(
        "No run file found"
      );
      await expect(
        runCompare("baseline.json", "malformed.json", { cwd: directory }, captureOutput().io)
      ).rejects.toThrow("malformed JSON");
      await expect(
        runCompare("baseline.json", "not-run.json", { cwd: directory }, captureOutput().io)
      ).rejects.toThrow("not a valid ToolSmith eval run");
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("eval reports missing files with a friendly error", async () => {
    const directory = await mkdtemp(join(tmpdir(), "toolsmith-missing-"));
    const output = captureOutput();

    try {
      await mkdir(join(directory, "example"), { recursive: true });

      await expect(runEval({ examplePath: "example", cwd: directory }, output.io)).rejects.toThrow(
        "Missing tools.json"
      );
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
