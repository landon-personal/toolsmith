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
    io.stdout(`- ${result.taskId}`);
    io.stdout(`  expected: ${result.expectedTool}`);
    io.stdout(`  actual: ${result.actualTool ?? "none"}`);
    io.stdout(`  reason: ${result.failureReason}`);
    io.stdout(`  suggestion: ${result.suggestion}`);
  }
}
