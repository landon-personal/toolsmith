import { resolve } from "node:path";
import { ToolSmithError } from "../errors.js";
import type { CommandIO } from "../io.js";
import { defaultIO } from "../io.js";
import { readRunFile } from "../results.js";
import type { EvalRun, FailureCategory } from "../types.js";

export interface CompareOptions {
  cwd?: string;
  failOnRegression?: boolean;
}

export interface FailureCategoryDelta {
  category: FailureCategory;
  baseline: number;
  current: number;
  delta: number;
}

export interface CompareReport {
  baseline: EvalRun;
  current: EvalRun;
  scoreDelta: number;
  passedDelta: number;
  failedDelta: number;
  failureCategoryDeltas: FailureCategoryDelta[];
  newFailureCategories: FailureCategory[];
  resolvedFailureCategories: FailureCategory[];
  hasRegression: boolean;
  hasImprovement: boolean;
}

export async function runCompare(
  baselineRunPath: string,
  currentRunPath: string,
  options: CompareOptions = {},
  io: CommandIO = defaultIO
): Promise<CompareReport> {
  const cwd = options.cwd ?? process.cwd();
  const baseline = assertEvalRun(await readRunFile(resolve(cwd, baselineRunPath)), baselineRunPath);
  const current = assertEvalRun(await readRunFile(resolve(cwd, currentRunPath)), currentRunPath);
  const report = buildCompareReport(baseline, current);

  printCompareReport(report, io);

  if (options.failOnRegression && report.hasRegression) {
    throw new ToolSmithError(
      `Regression detected: current score ${current.summary.score}% is below baseline ${baseline.summary.score}%.`
    );
  }

  return report;
}

export function buildCompareReport(baseline: EvalRun, current: EvalRun): CompareReport {
  const failureCategoryDeltas = buildFailureCategoryDeltas(
    baseline.summary.failureCategories ?? {},
    current.summary.failureCategories ?? {}
  );

  return {
    baseline,
    current,
    scoreDelta: roundDelta(current.summary.score - baseline.summary.score),
    passedDelta: current.summary.passed - baseline.summary.passed,
    failedDelta: current.summary.failed - baseline.summary.failed,
    failureCategoryDeltas,
    newFailureCategories: failureCategoryDeltas
      .filter((item) => item.baseline === 0 && item.current > 0)
      .map((item) => item.category),
    resolvedFailureCategories: failureCategoryDeltas
      .filter((item) => item.baseline > 0 && item.current === 0)
      .map((item) => item.category),
    hasRegression: current.summary.score < baseline.summary.score,
    hasImprovement: current.summary.score > baseline.summary.score
  };
}

function printCompareReport(report: CompareReport, io: CommandIO): void {
  io.stdout("ToolSmith Compare Report");
  io.stdout(`Baseline run: ${report.baseline.id}`);
  io.stdout(`Current run: ${report.current.id}`);
  io.stdout(`Baseline score: ${report.baseline.summary.score}%`);
  io.stdout(`Current score: ${report.current.summary.score}%`);
  io.stdout(`Delta: ${formatSignedPercent(report.scoreDelta)}`);
  io.stdout("");
  io.stdout(
    `Passed tasks: ${report.baseline.summary.passed} -> ${report.current.summary.passed} (${formatSignedCount(
      report.passedDelta
    )})`
  );
  io.stdout(
    `Failed tasks: ${report.baseline.summary.failed} -> ${report.current.summary.failed} (${formatSignedCount(
      report.failedDelta
    )})`
  );
  io.stdout("");
  printCategoryChanges(report, io);
  io.stdout("");
  printRegressionSummary(report, io);
}

function printCategoryChanges(report: CompareReport, io: CommandIO): void {
  io.stdout("Failure category changes:");

  if (report.failureCategoryDeltas.length === 0) {
    io.stdout("- none");
  } else {
    for (const item of report.failureCategoryDeltas) {
      io.stdout(`- ${item.category}: ${item.baseline} -> ${item.current} (${formatSignedCount(item.delta)})`);
    }
  }

  io.stdout("");
  io.stdout(`New failure categories: ${report.newFailureCategories.join(", ") || "none"}`);
  io.stdout(`Resolved failure categories: ${report.resolvedFailureCategories.join(", ") || "none"}`);
}

function printRegressionSummary(report: CompareReport, io: CommandIO): void {
  io.stdout("Regressions:");
  const regressions = report.failureCategoryDeltas.filter((item) => item.delta > 0);
  if (report.hasRegression) {
    io.stdout(`- score decreased by ${Math.abs(report.scoreDelta)} percentage points`);
  }
  for (const item of regressions) {
    io.stdout(`- ${item.category} increased from ${item.baseline} to ${item.current}`);
  }
  if (!report.hasRegression && regressions.length === 0) {
    io.stdout("- none");
  }

  io.stdout("");
  io.stdout("Improvements:");
  const improvements = report.failureCategoryDeltas.filter((item) => item.delta < 0);
  if (report.hasImprovement) {
    io.stdout(`- score increased by ${report.scoreDelta} percentage points`);
  }
  for (const item of improvements) {
    io.stdout(`- ${item.category} decreased from ${item.baseline} to ${item.current}`);
  }
  if (!report.hasImprovement && improvements.length === 0) {
    io.stdout("- none");
  }
}

function buildFailureCategoryDeltas(
  baseline: Partial<Record<FailureCategory, number>>,
  current: Partial<Record<FailureCategory, number>>
): FailureCategoryDelta[] {
  const categories = Array.from(new Set([...Object.keys(baseline), ...Object.keys(current)])).sort();

  return categories.map((category) => {
    const failureCategory = category as FailureCategory;
    const baselineCount = baseline[failureCategory] ?? 0;
    const currentCount = current[failureCategory] ?? 0;
    return {
      category: failureCategory,
      baseline: baselineCount,
      current: currentCount,
      delta: currentCount - baselineCount
    };
  });
}

function assertEvalRun(run: EvalRun, path: string): EvalRun {
  if (
    typeof run?.id !== "string" ||
    typeof run?.createdAt !== "string" ||
    typeof run?.summary?.score !== "number" ||
    typeof run?.summary?.total !== "number" ||
    typeof run?.summary?.passed !== "number" ||
    typeof run?.summary?.failed !== "number" ||
    !Array.isArray(run?.results)
  ) {
    throw new ToolSmithError(`Run file is not a valid ToolSmith eval run: ${path}.`);
  }

  return run;
}

function formatSignedPercent(value: number): string {
  return `${value > 0 ? "+" : ""}${value}%`;
}

function formatSignedCount(value: number): string {
  return `${value > 0 ? "+" : ""}${value}`;
}

function roundDelta(value: number): number {
  return Math.round(value * 100) / 100;
}
