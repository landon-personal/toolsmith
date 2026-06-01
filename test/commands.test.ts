import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { runEval } from "../src/commands/eval.js";
import { runInit } from "../src/commands/init.js";
import { runReport } from "../src/commands/report.js";
import { buildCli } from "../src/index.js";
import { chooseMockTool } from "../src/mockAgent.js";
import { LATEST_RUN_PATH } from "../src/results.js";
import type { ToolDefinition } from "../src/types.js";
import { loadTasksFile, loadToolsFile } from "../src/validation.js";

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

describe("ToolSmith commands", () => {
  beforeEach(async () => {
    await rm(join(process.cwd(), ".toolsmith"), { recursive: true, force: true });
  });

  it("builds a CLI with the expected commands", () => {
    const program = buildCli(captureOutput().io);
    const commandNames = program.commands.map((command) => command.name());

    expect(program.name()).toBe("toolsmith");
    expect(commandNames).toEqual(expect.arrayContaining(["init", "eval", "report"]));
  });

  it("initializes a local config file", async () => {
    const directory = await mkdtemp(join(tmpdir(), "toolsmith-"));
    const output = captureOutput();

    try {
      await runInit({ directory }, output.io);

      const config = JSON.parse(await readFile(join(directory, "toolsmith.config.json"), "utf8"));
      expect(config.version).toBe("0.1.0");
      expect(config.safety.network).toBe(false);
      expect(config.safety.realEmail).toBe(false);
      expect(output.lines[0]).toContain("Created");
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("loads valid tools and tasks", async () => {
    const tools = await loadToolsFile("examples/calendar-email/tools.json");
    const tasks = await loadTasksFile("examples/calendar-email/tasks.json");

    expect(tools.tools.map((tool) => tool.name)).toEqual(["create_calendar_event", "send_email"]);
    expect(tasks.tasks).toHaveLength(6);
    expect(tasks.tasks[0]?.expectedTool).toBe("create_calendar_event");
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

  it("mock agent chooses expected tools by keyword", () => {
    const tools: ToolDefinition[] = [
      { name: "create_calendar_event", description: "Mock calendar tool." },
      { name: "send_email", description: "Mock email tool." }
    ];

    expect(chooseMockTool("Schedule a meeting.", tools).toolCall?.toolName).toBe("create_calendar_event");
    expect(chooseMockTool("Email the release notes.", tools).toolCall?.toolName).toBe("send_email");
    expect(chooseMockTool("Think about the plan.", tools).toolCall).toBeNull();
  });

  it("eval produces and writes local results", async () => {
    const output = captureOutput();

    const run = await runEval({ examplePath: "examples/calendar-email" }, output.io);
    const latestRun = JSON.parse(await readFile(join(process.cwd(), LATEST_RUN_PATH), "utf8"));

    expect(run.summary.total).toBe(6);
    expect(run.summary.passed).toBe(5);
    expect(run.summary.failed).toBe(1);
    expect(latestRun.summary.score).toBe(run.summary.score);
    expect(output.lines).toContain("Score: 5/6 (83.33%)");
    expect(output.lines.some((line) => line.includes("calendar-tricky-message-meeting"))).toBe(true);
  });

  it("report reads latest results", async () => {
    const evalOutput = captureOutput();
    const reportOutput = captureOutput();

    await runEval({ examplePath: "examples/calendar-email" }, evalOutput.io);
    const run = await runReport({}, reportOutput.io);

    expect(run.summary.score).toBe(83.33);
    expect(reportOutput.lines).toContain("ToolSmith latest report");
    expect(reportOutput.lines).toContain("Score: 5/6 (83.33%)");
    expect(reportOutput.lines.some((line) => line.includes("expected: create_calendar_event"))).toBe(true);
    expect(reportOutput.lines.some((line) => line.includes("actual: send_email"))).toBe(true);
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
