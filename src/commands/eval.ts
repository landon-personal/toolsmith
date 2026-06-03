import type { CommandIO } from "../io.js";
import { defaultIO } from "../io.js";
import { ToolSmithError } from "../errors.js";
import { evaluate } from "../evaluator.js";
import { LATEST_RUN_PATH, writeLatestRun } from "../results.js";
import type { EvalRun } from "../types.js";

export interface EvalOptions {
  examplePath?: string;
  tools?: string;
  tasks?: string;
  cwd?: string;
  failUnder?: number;
}

export async function runEval(
  options: EvalOptions = {},
  io: CommandIO = defaultIO
): Promise<EvalRun> {
  const run = await evaluate({
    examplePath: options.examplePath,
    toolsPath: options.tools,
    tasksPath: options.tasks,
    cwd: options.cwd
  });
  await writeLatestRun(run, options.cwd);

  printEvalSummary(run, io);
  printFailUnderResult(run, options.failUnder, io);
  io.stdout(`Results written to ${LATEST_RUN_PATH}`);
  io.stdout("Next: npm run dev -- report");
  io.stdout("Safety: used keyword mock agent only; no model/API calls or real tool side effects.");

  if (options.failUnder !== undefined && run.summary.score < options.failUnder) {
    throw new ToolSmithError(`CI threshold failed: score ${run.summary.score}% is below ${options.failUnder}%.`);
  }

  return run;
}

function printEvalSummary(run: EvalRun, io: CommandIO): void {
  io.stdout(`ToolSmith eval ${run.version}`);
  io.stdout(`Example: ${run.examplePath}`);
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
    io.stdout(`- [${result.failureCategory}] ${result.taskId}`);
    io.stdout(`  expected: ${result.expectedTool}`);
    io.stdout(`  actual: ${result.actualTool ?? "none"}`);
    io.stdout(`  reason: ${result.reason}`);
    io.stdout(`  recommendation: ${result.recommendation}`);
  }
}

function printScoreBreakdown(run: EvalRun, io: CommandIO): void {
  io.stdout("Score breakdown:");
  for (const [key, score] of Object.entries(run.summary.scoreBreakdown)) {
    io.stdout(`- ${key}: ${score}%`);
  }
}

function printFailureBreakdown(run: EvalRun, io: CommandIO): void {
  io.stdout("Failure breakdown:");
  const entries = Object.entries(run.summary.failureCategories);

  if (entries.length === 0) {
    io.stdout("- none");
    return;
  }

  for (const [category, count] of entries) {
    io.stdout(`- ${category}: ${count}`);
  }
}

function printFailUnderResult(run: EvalRun, threshold: number | undefined, io: CommandIO): void {
  if (threshold === undefined) {
    return;
  }

  io.stdout("");
  io.stdout(`Fail-under threshold: ${threshold}%`);
  io.stdout(`CI result: ${run.summary.score >= threshold ? "passed" : "failed"}`);
}
