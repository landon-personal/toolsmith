import { join } from "node:path";
import { Command } from "commander";
import { runEval } from "./commands/eval.js";
import { runInit } from "./commands/init.js";
import { runLint } from "./commands/lint.js";
import { runReport } from "./commands/report.js";
import type { CommandIO } from "./io.js";
import { defaultIO } from "./io.js";
import { VERSION } from "./version.js";

const DEFAULT_EXAMPLE_PATH = join("examples", "calendar-email");

export function buildCli(io: CommandIO = defaultIO): Command {
  const program = new Command();

  program
    .name("toolsmith")
    .description("Local-first CLI for testing AI agent use of tool definitions.")
    .version(VERSION);

  program
    .command("init")
    .description("Create a local ToolSmith config file.")
    .option("-d, --directory <path>", "Directory to initialize.")
    .option("-f, --force", "Overwrite an existing ToolSmith config.")
    .action(async (options: { directory?: string; force?: boolean }) => {
      await runInit(options, io);
    });

  program
    .command("lint")
    .argument("[examplePath]", "Example directory containing tools.json.", DEFAULT_EXAMPLE_PATH)
    .description("Run static lint checks against local tool definitions.")
    .option("--tools <path>", "Path to a tools.json file.")
    .action(async (examplePath: string, options: { tools?: string }) => {
      await runLint({ examplePath, ...options }, io);
    });

  program
    .command("eval")
    .argument("[examplePath]", "Example directory containing tools.json and tasks.json.", DEFAULT_EXAMPLE_PATH)
    .description("Run a local mock evaluation against task and tool files.")
    .option("--tools <path>", "Path to a tools.json file.")
    .option("--tasks <path>", "Path to a tasks.json file.")
    .action(async (examplePath: string, options: { tools?: string; tasks?: string }) => {
      await runEval({ examplePath, ...options }, io);
    });

  program
    .command("report")
    .argument("[runPath]", "Path to a saved eval run JSON file.")
    .description("Show the latest local evaluation report.")
    .option("--format <format>", "Report format: terminal, json, markdown, or html.", "terminal")
    .option("--out <path>", "Write report output to a file.")
    .action(async (runPath: string | undefined, options: { format?: string; out?: string }) => {
      await runReport({ runPath, format: parseReportFormat(options.format), out: options.out }, io);
    });

  return program;
}

export { runEval, runInit, runLint, runReport };

function parseReportFormat(value: string | undefined): "terminal" | "json" | "markdown" | "html" {
  if (value === undefined || value === "terminal" || value === "json" || value === "markdown" || value === "html") {
    return value ?? "terminal";
  }

  throw new Error(`Unsupported report format "${value}". Use terminal, json, markdown, or html.`);
}
