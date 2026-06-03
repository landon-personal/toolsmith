import type { EvalResult, EvalRun } from "../types.js";

export interface ConfusionMatrixRow {
  expectedTool: string;
  actualTool: string;
  count: number;
}

export function buildConfusionMatrix(run: EvalRun): ConfusionMatrixRow[] {
  const counts = new Map<string, ConfusionMatrixRow>();

  for (const result of run.results) {
    const expectedTool = result.expectedTool;
    const actualTool = result.actualTool ?? "none";
    const key = matrixKey(expectedTool, actualTool);
    const existing = counts.get(key);

    if (existing) {
      existing.count += 1;
      continue;
    }

    counts.set(key, { expectedTool, actualTool, count: 1 });
  }

  return [...counts.values()].sort(compareRows);
}

function matrixKey(expectedTool: string, actualTool: string): string {
  return `${expectedTool}\u0000${actualTool}`;
}

function compareRows(left: ConfusionMatrixRow, right: ConfusionMatrixRow): number {
  return (
    left.expectedTool.localeCompare(right.expectedTool) ||
    left.actualTool.localeCompare(right.actualTool)
  );
}

export function formatResultPair(result: EvalResult): string {
  return `${result.expectedTool} -> ${result.actualTool ?? "none"}`;
}
