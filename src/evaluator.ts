import { join, relative, resolve } from "node:path";
import { chooseMockTool } from "./mockAgent.js";
import { loadTasksFile, loadToolsFile } from "./validation.js";
import type { EvalResult, EvalRun, FailureCategory, TaskDefinition, ToolDefinition } from "./types.js";
import { VERSION } from "./version.js";

const DEFAULT_EXAMPLE_PATH = join("examples", "calendar-email");
const NO_TOOL_EXPECTED = "none";

export interface EvaluateOptions {
  examplePath?: string;
  toolsPath?: string;
  tasksPath?: string;
  cwd?: string;
}

export async function evaluate(options: EvaluateOptions = {}): Promise<EvalRun> {
  const cwd = options.cwd ?? process.cwd();
  const examplePath = options.examplePath ?? DEFAULT_EXAMPLE_PATH;
  const resolvedExamplePath = resolve(cwd, examplePath);
  const resolvedToolsPath = resolve(cwd, options.toolsPath ?? join(examplePath, "tools.json"));
  const resolvedTasksPath = resolve(cwd, options.tasksPath ?? join(examplePath, "tasks.json"));
  const toolFile = await loadToolsFile(resolvedToolsPath);
  const taskFile = await loadTasksFile(resolvedTasksPath);
  const toolNames = new Set(toolFile.tools.map((tool) => tool.name));
  const results = taskFile.tasks.map((task) => evaluateTask(task, toolFile.tools, toolNames));
  const passed = results.filter((result) => result.passed).length;
  const failed = results.length - passed;
  const createdAt = new Date().toISOString();

  return {
    id: `run-${createdAt.replace(/[:.]/g, "-")}`,
    version: VERSION,
    createdAt,
    examplePath: toDisplayPath(cwd, resolvedExamplePath),
    toolsPath: toDisplayPath(cwd, resolvedToolsPath),
    tasksPath: toDisplayPath(cwd, resolvedTasksPath),
    agent: {
      name: "keyword-mock-agent",
      version: VERSION
    },
    summary: {
      total: results.length,
      passed,
      failed,
      score: scorePercentage(passed, results.length),
      failureCategories: countFailureCategories(results)
    },
    results
  };
}

function evaluateTask(
  task: TaskDefinition,
  tools: ToolDefinition[],
  toolNames: Set<string>
): EvalResult {
  try {
    const decision = chooseMockTool(task.prompt, tools);
    const actualTool = decision.toolCall?.toolName ?? null;
    const expectedTool = task.expectedTool;
    const expectsNoTool = expectedTool.toLowerCase() === NO_TOOL_EXPECTED;
    const expectedToolDefined = expectsNoTool || toolNames.has(expectedTool);
    const selectedKnownTool = actualTool === null || toolNames.has(actualTool);
    const passed = expectedToolDefined && selectedKnownTool && (expectsNoTool ? actualTool === null : actualTool === expectedTool);
    const failureCategory = getFailureCategory({
      passed,
      expectsNoTool,
      expectedToolDefined,
      selectedKnownTool,
      actualTool,
      prompt: task.prompt
    });
    const reason = buildReason(task, failureCategory, actualTool);
    const recommendation = buildRecommendation(task, failureCategory, actualTool);

    return {
      taskId: task.id,
      prompt: task.prompt,
      expectedTool,
      actualTool,
      passed,
      failureCategory,
      failureReason: failureCategory,
      reason,
      recommendation,
      suggestion: recommendation,
      toolCall: decision.toolCall
    };
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : "An unknown evaluation error occurred.";
    return {
      taskId: task.id,
      prompt: task.prompt,
      expectedTool: task.expectedTool,
      actualTool: null,
      passed: false,
      failureCategory: "unknown_error",
      failureReason: "unknown_error",
      reason,
      recommendation: "Inspect this task and tool definition for malformed local test data.",
      suggestion: "Inspect this task and tool definition for malformed local test data.",
      toolCall: null
    };
  }
}

function getFailureCategory(input: {
  passed: boolean;
  expectsNoTool: boolean;
  expectedToolDefined: boolean;
  selectedKnownTool: boolean;
  actualTool: string | null;
  prompt: string;
}): FailureCategory {
  if (input.passed) {
    return "passed";
  }

  if (!input.expectedToolDefined) {
    return "missing_expected_tool";
  }

  if (!input.selectedKnownTool) {
    return "invalid_tool_call";
  }

  if (input.expectsNoTool && input.actualTool) {
    return "unexpected_tool_selected";
  }

  if (!input.actualTool) {
    return looksUnclear(input.prompt) ? "unclear_task" : "no_tool_selected";
  }

  return "wrong_tool";
}

function buildReason(task: TaskDefinition, failureCategory: FailureCategory, actualTool: string | null): string {
  switch (failureCategory) {
    case "passed":
      return "The mock agent selected the expected tool.";
    case "wrong_tool":
      return `The mock agent selected "${actualTool}" when the task expected "${task.expectedTool}".`;
    case "no_tool_selected":
      return `The mock agent did not select a tool for a task that expected "${task.expectedTool}".`;
    case "unexpected_tool_selected":
      return `The task expected no tool, but the mock agent selected "${actualTool}".`;
    case "invalid_tool_call":
      return `The mock agent selected "${actualTool}", which is not defined in tools.json.`;
    case "missing_expected_tool":
      return `The task expects "${task.expectedTool}", but that tool is not defined in tools.json.`;
    case "unclear_task":
      return `The prompt did not contain enough deterministic calendar or email signal for the mock agent.`;
    case "unknown_error":
      return "An unknown evaluation error occurred.";
  }
}

function buildRecommendation(
  task: TaskDefinition,
  failureCategory: FailureCategory,
  actualTool: string | null
): string {
  switch (failureCategory) {
    case "passed":
      return "No action needed.";
    case "wrong_tool":
      return `Clarify tool descriptions or task wording so this prompt points to "${task.expectedTool}" instead of "${actualTool}".`;
    case "no_tool_selected":
      return `Add clearer keywords to the task prompt or improve tool descriptions so the mock agent can choose "${task.expectedTool}".`;
    case "unexpected_tool_selected":
      return "Clarify the task so it does not contain tool-triggering language, or set expectedTool to the intended tool.";
    case "invalid_tool_call":
      return "Update the mock agent to choose only defined tools, or add the missing tool definition.";
    case "missing_expected_tool":
      return `Add a tool named "${task.expectedTool}" or update the task expectedTool.`;
    case "unclear_task":
      return "Rewrite the task with a clear expected action, or set expectedTool to none when no tool should be selected.";
    case "unknown_error":
      return "Inspect this task and tool definition for malformed local test data.";
  }
}

function countFailureCategories(results: EvalResult[]): Partial<Record<FailureCategory, number>> {
  const counts: Partial<Record<FailureCategory, number>> = {};

  for (const result of results) {
    if (result.failureCategory === "passed") {
      continue;
    }

    counts[result.failureCategory] = (counts[result.failureCategory] ?? 0) + 1;
  }

  return counts;
}

function scorePercentage(passed: number, total: number): number {
  if (total === 0) {
    return 0;
  }

  return Math.round((passed / total) * 10000) / 100;
}

function toDisplayPath(cwd: string, path: string): string {
  const displayPath = relative(cwd, path);
  return displayPath || path;
}

function looksUnclear(prompt: string): boolean {
  const normalized = prompt.toLowerCase();
  return ["think", "consider", "review", "maybe", "unclear", "decide"].some((keyword) =>
    normalized.includes(keyword)
  );
}
