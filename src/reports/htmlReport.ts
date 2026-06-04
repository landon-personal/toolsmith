import type { EvalRun } from "../types.js";
import { buildConfusionMatrix } from "./confusionMatrix.js";
import { formatProviderMetadata } from "./provider.js";

export function renderHtmlReport(run: EvalRun, generatedAt = new Date()): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ToolSmith Eval Report</title>
  <style>
    body { color: #1f2937; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; line-height: 1.45; margin: 2rem; }
    main { max-width: 1080px; margin: 0 auto; }
    h1, h2, h3 { color: #111827; }
    table { border-collapse: collapse; margin: 1rem 0 2rem; width: 100%; }
    th, td { border: 1px solid #d1d5db; padding: 0.5rem; text-align: left; vertical-align: top; }
    th { background: #f3f4f6; }
    .score { font-size: 1.5rem; font-weight: 700; }
    .failed { color: #991b1b; font-weight: 700; }
    .passed { color: #166534; font-weight: 700; }
    pre { background: #f3f4f6; overflow: auto; padding: 1rem; }
  </style>
</head>
<body>
<main>
  <h1>ToolSmith Eval Report</h1>
  <p>Generated: ${escapeHtml(generatedAt.toISOString())}</p>
  <p>Provider: ${escapeHtml(formatProviderMetadata(run))}</p>
  <p class="score">Score: ${run.summary.passed}/${run.summary.total} (${run.summary.score}%)</p>

  <h2>Score Breakdown</h2>
  ${scoreBreakdownTable(run)}

  <h2>Failure Breakdown</h2>
  ${failureBreakdownList(run)}

  <h2>Tasks</h2>
  ${tasksTable(run)}

  <h2>Failed Task Details</h2>
  ${failedTaskDetails(run)}

  <h2>Tool Confusion Matrix</h2>
  ${confusionMatrixTable(run)}

  <h2>Raw JSON</h2>
  <details>
    <summary>Show raw eval run JSON</summary>
    <pre><code>${escapeHtml(JSON.stringify(run, null, 2))}</code></pre>
  </details>
</main>
</body>
</html>
`;
}

function scoreBreakdownTable(run: EvalRun): string {
  return table(
    ["Category", "Score"],
    Object.entries(run.summary.scoreBreakdown).map(([key, score]) => [key, `${score}%`])
  );
}

function failureBreakdownList(run: EvalRun): string {
  const entries = Object.entries(run.summary.failureCategories ?? {});
  if (entries.length === 0) {
    return "<p>none</p>";
  }

  return `<ul>${entries
    .map(([category, count]) => `<li>${escapeHtml(category)}: ${escapeHtml(String(count))}</li>`)
    .join("")}</ul>`;
}

function tasksTable(run: EvalRun): string {
  return table(
    ["Task", "Prompt", "Expected Tool", "Actual Tool", "Result", "Failure Category"],
    run.results.map((result) => [
      result.taskId,
      result.prompt,
      result.expectedTool,
      result.actualTool ?? "none",
      result.passed ? "passed" : "failed",
      result.failureCategory
    ])
  );
}

function failedTaskDetails(run: EvalRun): string {
  const failed = run.results.filter((result) => !result.passed);
  if (failed.length === 0) {
    return "<p>No failed tasks.</p>";
  }

  return failed
    .map(
      (result) => `<section>
  <h3>${escapeHtml(result.taskId)}</h3>
  <p class="failed">${escapeHtml(result.failureCategory)}</p>
  <dl>
    <dt>Prompt</dt><dd>${escapeHtml(result.prompt)}</dd>
    <dt>Expected</dt><dd>${escapeHtml(result.expectedTool)}</dd>
    <dt>Actual</dt><dd>${escapeHtml(result.actualTool ?? "none")}</dd>
    <dt>Reason</dt><dd>${escapeHtml(result.reason)}</dd>
    <dt>Recommendation</dt><dd>${escapeHtml(result.recommendation)}</dd>
  </dl>
</section>`
    )
    .join("\n");
}

function confusionMatrixTable(run: EvalRun): string {
  return table(
    ["Expected Tool", "Actual Tool", "Count"],
    buildConfusionMatrix(run).map((row) => [row.expectedTool, row.actualTool, String(row.count)])
  );
}

function table(headers: string[], rows: string[][]): string {
  const headerHtml = headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("");
  const rowsHtml = rows
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
    .join("");

  return `<table><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
