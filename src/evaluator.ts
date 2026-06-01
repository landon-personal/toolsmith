import { relative, resolve } from "node:path";
import { chooseMockTool } from "./mockAgent.js";
import { loadTasksFile, loadToolsFile } from "./validation.js";
import type { EvalResult, EvalRun, FailureReason, TaskDefinition, ToolDefinition } from "./types.js";
import { VERSION } from "./version.js";

export interface EvaluateOptions {
  examplePath?: string;
  toolsPath?: string;
  tasksPath?: string;
  cwd?: string;
}

export async function evaluate(options: EvaluateOptions = {}): Promise<EvalRun> {
  const cwd = options.cwd ?? process.cwd();
  const examplePath = options.examplePath ?? "examples/calendar-email";
  const resolvedExamplePath = resolve(cwd, examplePath);
  const resolvedToolsPath = resolve(cwd, options.toolsPath ?? `${examplePath}/tools.json`);
  const resolvedTasksPath = resolve(cwd, options.tasksPath ?? `${examplePath}/tasks.json`);
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
      score: scorePercentage(passed, results.length)
    },
    results
  };
}

function evaluateTask(
  task: TaskDefinition,
  tools: ToolDefinition[],
  toolNames: Set<string>
): EvalResult {
  const decision = chooseMockTool(task.prompt, tools);
  const actualTool = decision.toolCall?.toolName ?? null;
  const expectedToolDefined = toolNames.has(task.expectedTool);
  const passed = expectedToolDefined && actualTool === task.expectedTool;
  const failureReason = passed ? undefined : getFailureReason(expectedToolDefined, actualTool);

  return {
    taskId: task.id,
    prompt: task.prompt,
    expectedTool: task.expectedTool,
    actualTool,
    passed,
    ...(failureReason ? { failureReason } : {}),
    ...(passed ? {} : { suggestion: buildSuggestion(task, failureReason, actualTool) }),
    toolCall: decision.toolCall
  };
}

function getFailureReason(expectedToolDefined: boolean, actualTool: string | null): FailureReason {
  if (!expectedToolDefined) {
    return "EXPECTED_TOOL_NOT_DEFINED";
  }

  if (!actualTool) {
    return "NO_TOOL_SELECTED";
  }

  return "WRONG_TOOL_SELECTED";
}

function buildSuggestion(
  task: TaskDefinition,
  failureReason: FailureReason | undefined,
  actualTool: string | null
): string {
  if (failureReason === "EXPECTED_TOOL_NOT_DEFINED") {
    return `Add a tool named "${task.expectedTool}" or update the task expectedTool.`;
  }

  if (failureReason === "NO_TOOL_SELECTED") {
    return "Add clearer calendar/email keywords to the prompt or extend the mock agent keyword list.";
  }

  return `Expected "${task.expectedTool}" but the mock agent chose "${actualTool}". Tighten the prompt or adjust the mock keyword rules.`;
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
