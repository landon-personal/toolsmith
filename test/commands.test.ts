import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { runEval } from "../src/commands/eval.js";
import { runInit } from "../src/commands/init.js";
import { runLint } from "../src/commands/lint.js";
import { runReport } from "../src/commands/report.js";
import { evaluate } from "../src/evaluator.js";
import { buildCli } from "../src/index.js";
import { lintToolFile } from "../src/linter.js";
import { chooseMockTool } from "../src/mockAgent.js";
import { LATEST_RUN_PATH } from "../src/results.js";
import type { ToolDefinition, ToolFile, ToolLintIssue } from "../src/types.js";
import { loadTasksFile, loadToolsFile } from "../src/validation.js";
import { VERSION } from "../src/version.js";

const CALENDAR_EMAIL_EXAMPLE = join("examples", "calendar-email");
const CALENDAR_EMAIL_TOOLS_PATH = join(CALENDAR_EMAIL_EXAMPLE, "tools.json");
const CALENDAR_EMAIL_TASKS_PATH = join(CALENDAR_EMAIL_EXAMPLE, "tasks.json");

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
    version: "0.4.0",
    tools
  };

  return lintToolFile(toolFile).issues;
}

async function writeExample(
  directory: string,
  tasks: Array<{ id: string; prompt: string; expectedTool: string }>
): Promise<void> {
  await writeFile(
    join(directory, "tools.json"),
    JSON.stringify(
      {
        name: "test-tools",
        version: "0.4.0",
        tools: [
          { name: "create_calendar_event", description: "Use this tool when scheduling calendar events." },
          { name: "send_email", description: "Use this tool when sending email messages." }
        ]
      },
      null,
      2
    ),
    "utf8"
  );
  await writeFile(
    join(directory, "tasks.json"),
    JSON.stringify({ name: "test-tasks", version: "0.4.0", tasks }, null, 2),
    "utf8"
  );
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
    expect(commandNames).toEqual(expect.arrayContaining(["init", "lint", "eval", "report"]));
  });

  it("has package-ready CLI metadata", async () => {
    const packageJson = JSON.parse(await readFile("package.json", "utf8"));
    const disallowedPackageFiles = ["node_modules", "coverage", ".toolsmith/runs", ".env", ".env.*", "test", "src"];

    expect(packageJson.version).toBe("0.4.0");
    expect(VERSION).toBe(packageJson.version);
    expect(packageJson.bin).toEqual({ toolsmith: "./dist/cli.js" });
    expect(packageJson.files).toEqual(
      expect.arrayContaining(["dist", "README.md", "CHANGELOG.md", "docs", "examples"])
    );
    expect(packageJson.files).not.toEqual(expect.arrayContaining(disallowedPackageFiles));
    expect(packageJson.scripts["package:check"]).toContain("scripts/package-check.mjs");
  });

  it("initializes a local config file", async () => {
    const directory = await mkdtemp(join(tmpdir(), "toolsmith-"));
    const output = captureOutput();

    try {
      await runInit({ directory }, output.io);

      const config = JSON.parse(await readFile(join(directory, "toolsmith.config.json"), "utf8"));
      expect(config.version).toBe("0.4.0");
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

  it("eval categorizes passed, wrong-tool, and unclear-task results", async () => {
    const run = await evaluate({ examplePath: CALENDAR_EMAIL_EXAMPLE });

    expect(run.summary.total).toBe(5);
    expect(run.summary.passed).toBe(3);
    expect(run.summary.failed).toBe(2);
    expect(run.summary.score).toBe(60);
    expect(run.summary.failureCategories).toEqual({ wrong_tool: 1, unclear_task: 1 });
    expect(run.results.find((result) => result.taskId === "calendar-schedule-demo")?.failureCategory).toBe("passed");
    expect(run.results.find((result) => result.taskId === "calendar-ambiguous-message-meeting")?.failureCategory).toBe(
      "wrong_tool"
    );
    expect(run.results.find((result) => result.taskId === "email-unclear-followup")?.failureCategory).toBe(
      "unclear_task"
    );
  });

  it("eval categorizes no tool, unexpected tool, and missing expected tool failures", async () => {
    const directory = await mkdtemp(join(tmpdir(), "toolsmith-categories-"));

    try {
      await writeExample(directory, [
        { id: "no-tool", prompt: "Prepare release notes for Jordan.", expectedTool: "send_email" },
        { id: "unexpected-tool", prompt: "Email Jordan the release notes.", expectedTool: "none" },
        { id: "missing-tool", prompt: "Schedule a meeting with Jordan.", expectedTool: "create_task" }
      ]);

      const run = await evaluate({ examplePath: ".", cwd: directory });

      expect(run.summary.failureCategories).toEqual({
        no_tool_selected: 1,
        unexpected_tool_selected: 1,
        missing_expected_tool: 1
      });
      expect(run.results.map((result) => result.failureCategory)).toEqual([
        "no_tool_selected",
        "unexpected_tool_selected",
        "missing_expected_tool"
      ]);
      expect(run.results.every((result) => result.reason.length > 0 && result.recommendation.length > 0)).toBe(true);
    } finally {
      await rm(directory, { recursive: true, force: true });
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
    expect(output.lines).toContain("Failure breakdown:");
    expect(output.lines).toContain("- wrong_tool: 1");
    expect(output.lines).toContain("- unclear_task: 1");
    expect(output.lines).toContain("Next: npm run dev -- report");
  });

  it("report reads latest results", async () => {
    const evalOutput = captureOutput();
    const reportOutput = captureOutput();

    await runEval({ examplePath: CALENDAR_EMAIL_EXAMPLE }, evalOutput.io);
    const run = await runReport({}, reportOutput.io);

    expect(run.summary.score).toBe(60);
    expect(reportOutput.lines).toContain("ToolSmith latest report");
    expect(reportOutput.lines).toContain("Score: 3/5 (60%)");
    expect(reportOutput.lines).toContain("- wrong_tool: 1");
    expect(reportOutput.lines).toContain("[wrong_tool]");
    expect(reportOutput.lines.some((line) => line.includes("Expected: create_calendar_event"))).toBe(true);
    expect(reportOutput.lines.some((line) => line.includes("Actual: send_email"))).toBe(true);
    expect(reportOutput.lines.some((line) => line.includes("Recommendation:"))).toBe(true);
    await expect(access(join(process.cwd(), LATEST_RUN_PATH))).resolves.toBeUndefined();
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
