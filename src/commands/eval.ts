import type { CommandIO } from "../io.js";
import { defaultIO } from "../io.js";
import { evaluate } from "../evaluator.js";
import { LATEST_RUN_PATH, writeLatestRun } from "../results.js";
import type { EvalRun } from "../types.js";

export interface EvalOptions {
  examplePath?: string;
  tools?: string;
  tasks?: string;
  cwd?: string;
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
  io.stdout(`Results written to ${LATEST_RUN_PATH}`);
  io.stdout("Next: npm run dev -- report");
  io.stdout("Safety: used keyword mock agent only; no model/API calls or real tool side effects.");

  return run;
}

function printEvalSummary(run: EvalRun, io: CommandIO): void {
  io.stdout(`ToolSmith eval ${run.version}`);
  io.stdout(`Example: ${run.examplePath}`);
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
    io.stdout(`- [${result.failureCategory}] ${result.taskId}`);
    io.stdout(`  expected: ${result.expectedTool}`);
    io.stdout(`  actual: ${result.actualTool ?? "none"}`);
    io.stdout(`  reason: ${result.reason}`);
    io.stdout(`  recommendation: ${result.recommendation}`);
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
