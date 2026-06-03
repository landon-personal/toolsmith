import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { CommandIO } from "../io.js";
import { defaultIO } from "../io.js";
import { readLatestRun, readRunFile } from "../results.js";
import { renderHtmlReport } from "../reports/htmlReport.js";
import { renderMarkdownReport } from "../reports/markdownReport.js";
import type { EvalRun } from "../types.js";

export type ReportFormat = "terminal" | "json" | "markdown" | "html";

export interface ReportOptions {
  cwd?: string;
  format?: ReportFormat;
  out?: string;
  runPath?: string;
}

export async function runReport(
  options: ReportOptions = {},
  io: CommandIO = defaultIO
): Promise<EvalRun> {
  const cwd = options.cwd ?? process.cwd();
  const run = options.runPath ? await readRunFile(resolve(cwd, options.runPath)) : await readLatestRun(cwd);
  const format = options.format ?? "terminal";

  if (format === "terminal") {
    printReport(run, io);
    return run;
  }

  const rendered = renderReport(run, format);
  const outputPath = options.out ?? defaultOutputPath(format);

  if (outputPath) {
    await writeFile(resolve(cwd, outputPath), rendered, "utf8");
    io.stdout(`Report written to ${outputPath}`);
  } else {
    io.stdout(rendered);
  }

  return run;
}

function renderReport(run: EvalRun, format: Exclude<ReportFormat, "terminal">): string {
  if (format === "json") {
    return `${JSON.stringify(run, null, 2)}\n`;
  }

  if (format === "markdown") {
    return renderMarkdownReport(run);
  }

  return renderHtmlReport(run);
}

function defaultOutputPath(format: Exclude<ReportFormat, "terminal">): string | undefined {
  if (format === "markdown") {
    return "report.md";
  }

  if (format === "html") {
    return "report.html";
  }

  return undefined;
}

function printReport(run: EvalRun, io: CommandIO): void {
  io.stdout(`ToolSmith latest report`);
  io.stdout(`Run: ${run.id}`);
  io.stdout(`Created: ${run.createdAt}`);
  io.stdout(`Score: ${run.summary.passed}/${run.summary.total} (${run.summary.score}%)`);
  io.stdout("");
  printScoreBreakdown(run, io);
  io.stdout("");
  printFailureBreakdown(run, io);
  io.stdout("");
  io.stdout("Passed tasks:");
  for (const result of run.results.filter((item) => item.passed)) {
    io.stdout(`- ${result.taskId}: expected ${result.expectedTool}, got ${result.actualTool}`);
  }
  io.stdout("");
  io.stdout("Failed tasks:");
  const failed = run.results.filter((item) => !item.passed);
  if (failed.length === 0) {
    io.stdout("- none");
  }

  for (const result of failed) {
    io.stdout(`[${result.failureCategory}]`);
    io.stdout(`Task: ${result.taskId}`);
    io.stdout(`Prompt: "${result.prompt}"`);
    io.stdout(`Expected: ${result.expectedTool}`);
    io.stdout(`Actual: ${result.actualTool ?? "none"}`);
    io.stdout(`Reason: ${result.reason}`);
    io.stdout(`Recommendation: ${result.recommendation}`);
    io.stdout("");
  }
}

function printScoreBreakdown(run: EvalRun, io: CommandIO): void {
  io.stdout("Score breakdown:");
  for (const [key, score] of Object.entries(run.summary.scoreBreakdown ?? {})) {
    io.stdout(`- ${key}: ${score}%`);
  }
}

function printFailureBreakdown(run: EvalRun, io: CommandIO): void {
  io.stdout("Failure breakdown:");
  const entries = Object.entries(run.summary.failureCategories ?? {});

  if (entries.length === 0) {
    io.stdout("- none");
    return;
  }

  for (const [category, count] of entries) {
    io.stdout(`- ${category}: ${count}`);
  }
}
