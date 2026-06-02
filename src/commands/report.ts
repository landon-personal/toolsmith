import type { CommandIO } from "../io.js";
import { defaultIO } from "../io.js";
import { readLatestRun } from "../results.js";
import type { EvalRun } from "../types.js";

export interface ReportOptions {
  cwd?: string;
}

export async function runReport(
  options: ReportOptions = {},
  io: CommandIO = defaultIO
): Promise<EvalRun> {
  const run = await readLatestRun(options.cwd);

  printReport(run, io);
  return run;
}

function printReport(run: EvalRun, io: CommandIO): void {
  io.stdout(`ToolSmith latest report`);
  io.stdout(`Run: ${run.id}`);
  io.stdout(`Created: ${run.createdAt}`);
  io.stdout(`Score: ${run.summary.passed}/${run.summary.total} (${run.summary.score}%)`);
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
