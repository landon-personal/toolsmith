import type { EvalRun } from "../types.js";
import { buildConfusionMatrix } from "./confusionMatrix.js";

export function renderMarkdownReport(run: EvalRun, generatedAt = new Date()): string {
  const lines: string[] = [
    "# ToolSmith Eval Report",
    "",
    `Generated: ${generatedAt.toISOString()}`,
    "",
    `Provider: ${run.agent.name} ${run.agent.version}`,
    "",
    `Score: ${run.summary.passed}/${run.summary.total} (${run.summary.score}%)`,
    "",
    "## Score Breakdown",
    "",
    "| Category | Score |",
    "| --- | ---: |",
    ...Object.entries(run.summary.scoreBreakdown).map(([key, score]) => `| ${escapeMarkdown(key)} | ${score}% |`),
    "",
    "## Failure Category Breakdown",
    "",
    ...failureBreakdownLines(run),
    "",
    "## Tasks",
    "",
    "| Task | Prompt | Expected Tool | Actual Tool | Result | Failure Category |",
    "| --- | --- | --- | --- | --- | --- |",
    ...run.results.map((result) =>
      [
        escapeMarkdown(result.taskId),
        escapeMarkdown(result.prompt),
        escapeMarkdown(result.expectedTool),
        escapeMarkdown(result.actualTool ?? "none"),
        result.passed ? "passed" : "failed",
        escapeMarkdown(result.failureCategory)
      ].join(" | ")
    ).map((row) => `| ${row} |`),
    "",
    "## Failed Task Details",
    "",
    ...failedTaskLines(run),
    "",
    "## Tool Confusion Matrix",
    "",
    "| Expected Tool | Actual Tool | Count |",
    "| --- | --- | ---: |",
    ...buildConfusionMatrix(run).map((row) =>
      `| ${escapeMarkdown(row.expectedTool)} | ${escapeMarkdown(row.actualTool)} | ${row.count} |`
    ),
    "",
    "## Raw JSON",
    "",
    "```json",
    JSON.stringify(run, null, 2),
    "```",
    ""
  ];

  return `${lines.join("\n")}`;
}

function failureBreakdownLines(run: EvalRun): string[] {
  const entries = Object.entries(run.summary.failureCategories ?? {});
  if (entries.length === 0) {
    return ["- none"];
  }

  return entries.map(([category, count]) => `- ${escapeMarkdown(category)}: ${count}`);
}

function failedTaskLines(run: EvalRun): string[] {
  const failed = run.results.filter((result) => !result.passed);
  if (failed.length === 0) {
    return ["No failed tasks."];
  }

  return failed.flatMap((result) => [
    `### ${escapeMarkdown(result.taskId)}`,
    "",
    `- Failure category: ${escapeMarkdown(result.failureCategory)}`,
    `- Prompt: ${escapeMarkdown(result.prompt)}`,
    `- Expected tool: ${escapeMarkdown(result.expectedTool)}`,
    `- Actual tool: ${escapeMarkdown(result.actualTool ?? "none")}`,
    `- Reason: ${escapeMarkdown(result.reason)}`,
    `- Recommendation: ${escapeMarkdown(result.recommendation)}`,
    ""
  ]);
}

function escapeMarkdown(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\n/g, " ");
}
