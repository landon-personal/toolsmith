import { join, resolve } from "node:path";
import { ToolSmithError } from "../errors.js";
import type { CommandIO } from "../io.js";
import { defaultIO } from "../io.js";
import { lintToolFile } from "../linter.js";
import type { ToolLintIssue, ToolLintReport } from "../types.js";
import { loadToolsFile } from "../validation.js";

const DEFAULT_EXAMPLE_PATH = join("examples", "calendar-email");

export interface LintOptions {
  examplePath?: string;
  tools?: string;
  cwd?: string;
}

export async function runLint(
  options: LintOptions = {},
  io: CommandIO = defaultIO
): Promise<ToolLintReport> {
  const cwd = options.cwd ?? process.cwd();
  const examplePath = options.examplePath ?? DEFAULT_EXAMPLE_PATH;
  const resolvedToolsPath = resolve(cwd, options.tools ?? join(examplePath, "tools.json"));
  const toolFile = await loadToolsFile(resolvedToolsPath);
  const report = lintToolFile(toolFile);

  printLintReport(report, io);
  io.stdout("Safety: static local analysis only; no model/API calls or real tool side effects.");

  if (report.summary.error > 0) {
    throw new ToolSmithError(`Lint found ${report.summary.error} error issue(s).`);
  }

  return report;
}

function printLintReport(report: ToolLintReport, io: CommandIO): void {
  io.stdout("ToolSmith Lint Report");
  io.stdout("");
  io.stdout(`Tools checked: ${report.toolsChecked}`);
  io.stdout(`Issues found: ${report.issues.length}`);

  if (report.issues.length === 0) {
    io.stdout("");
    io.stdout("No lint issues found.");
    return;
  }

  for (const issue of report.issues) {
    io.stdout("");
    io.stdout(`[${issue.severity}] ${formatAffectedTools(issue)}`);
    io.stdout(issue.message);
    io.stdout(`Recommendation: ${issue.recommendation}`);
  }
}

function formatAffectedTools(issue: ToolLintIssue): string {
  if (issue.toolNames && issue.toolNames.length > 0) {
    return issue.toolNames.join(", ");
  }

  if (issue.toolName) {
    return issue.toolName;
  }

  return "tools.json";
}
