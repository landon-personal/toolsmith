import { join, relative, resolve } from "node:path";
import { chooseMockTool } from "./mockAgent.js";
import { loadTasksFile, loadToolsFile } from "./validation.js";
import type {
  EvalResult,
  EvalRun,
  FailureCategory,
  JsonValue,
  ResultCategory,
  TaskDefinition,
  ToolCall,
  ToolDefinition
} from "./types.js";
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
  const toolsByName = new Map(toolFile.tools.map((tool) => [tool.name, tool]));
  const results = taskFile.tasks.map((task) => evaluateTask(task, toolFile.tools, toolNames, toolsByName));
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
      scoreBreakdown: buildScoreBreakdown(results),
      failureCategories: countFailureCategories(results)
    },
    results
  };
}

function evaluateTask(
  task: TaskDefinition,
  tools: ToolDefinition[],
  toolNames: Set<string>,
  toolsByName: Map<string, ToolDefinition>
): EvalResult {
  try {
    const decision = chooseMockTool(task.prompt, tools);
    const actualTool = decision.toolCall?.toolName ?? null;
    const expectedTool = task.expectedTool;
    const expectsNoTool = expectedTool.toLowerCase() === NO_TOOL_EXPECTED;
    const expectedToolDefined = expectsNoTool || toolNames.has(expectedTool);
    const selectedKnownTool = actualTool === null || toolNames.has(actualTool);
    const argumentCategory = getArgumentFailureCategory(decision.toolCall, toolsByName);
    const passed =
      expectedToolDefined &&
      selectedKnownTool &&
      !argumentCategory &&
      (expectsNoTool ? actualTool === null : actualTool === expectedTool);
    const resultCategory = getResultCategory({
      passed,
      expectsNoTool,
      expectedToolDefined,
      selectedKnownTool,
      actualTool,
      prompt: task.prompt,
      argumentCategory
    });
    const reason = buildReason(task, resultCategory, actualTool);
    const recommendation = buildRecommendation(task, resultCategory, actualTool);

    return {
      taskId: task.id,
      prompt: task.prompt,
      expectedTool,
      actualTool,
      passed,
      failureCategory: resultCategory,
      ...(resultCategory === "passed" ? {} : { failureReason: resultCategory }),
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

function getResultCategory(input: {
  passed: boolean;
  expectsNoTool: boolean;
  expectedToolDefined: boolean;
  selectedKnownTool: boolean;
  actualTool: string | null;
  prompt: string;
  argumentCategory?: FailureCategory;
}): ResultCategory {
  if (input.passed) {
    return "passed";
  }

  if (!input.expectedToolDefined) {
    return "missing_tool_call";
  }

  if (!input.selectedKnownTool) {
    return "invalid_arguments";
  }

  if (input.argumentCategory) {
    return input.argumentCategory;
  }

  if (input.expectsNoTool && input.actualTool) {
    return looksUnclear(input.prompt)
      ? "should_not_have_asked_clarifying_question"
      : "hallucinated_tool";
  }

  if (!input.actualTool) {
    return looksUnclear(input.prompt) ? "should_have_asked_clarifying_question" : "missing_tool_call";
  }

  return "wrong_tool";
}

function buildReason(task: TaskDefinition, resultCategory: ResultCategory, actualTool: string | null): string {
  switch (resultCategory) {
    case "passed":
      return "The mock agent selected the expected tool.";
    case "wrong_tool":
      return `The mock agent selected "${actualTool}" when the task expected "${task.expectedTool}".`;
    case "missing_tool_call":
      if (actualTool) {
        return `The task expected "${task.expectedTool}", but the mock agent could not make that expected tool call and selected "${actualTool}" instead.`;
      }
      return `The mock agent did not select a tool for a task that expected "${task.expectedTool}".`;
    case "hallucinated_tool":
      return `The task expected no tool, but the mock agent selected "${actualTool}".`;
    case "invalid_arguments":
      return `The mock agent selected "${actualTool}", but the call is not valid for the defined tools.`;
    case "missing_required_argument":
      return `The mock agent did not include a required argument for "${actualTool ?? task.expectedTool}".`;
    case "unnecessary_tool_call":
      return `The mock agent selected "${actualTool}" even though the task did not need a tool call.`;
    case "unsafe_tool_attempt":
      return `The mock agent attempted a tool call that would be unsafe outside the local mock runner.`;
    case "should_have_asked_clarifying_question":
      return `The prompt did not contain enough deterministic calendar or email signal for the mock agent.`;
    case "should_not_have_asked_clarifying_question":
      return `The task expected no clarifying behavior, but the mock evaluation treated it as unclear.`;
    case "unknown_error":
      return "An unknown evaluation error occurred.";
  }
}

function buildRecommendation(
  task: TaskDefinition,
  resultCategory: ResultCategory,
  actualTool: string | null
): string {
  switch (resultCategory) {
    case "passed":
      return "No action needed.";
    case "wrong_tool":
      return `Clarify tool descriptions or task wording so this prompt points to "${task.expectedTool}" instead of "${actualTool}".`;
    case "missing_tool_call":
      return `Add clearer keywords to the task prompt or improve tool descriptions so the mock agent can choose "${task.expectedTool}".`;
    case "hallucinated_tool":
      return "Clarify the task so it does not contain tool-triggering language, or set expectedTool to the intended tool.";
    case "invalid_arguments":
      return "Update the mock agent to choose only defined tools with valid mock arguments, or fix the tool schema.";
    case "missing_required_argument":
      return "Add the required argument to the mock tool call or relax the tool schema if the argument is not needed.";
    case "unnecessary_tool_call":
      return "Remove tool-triggering language from the task or set the expected tool to the selected tool if it is actually needed.";
    case "unsafe_tool_attempt":
      return "Keep this tool mock-only or add explicit confirmation requirements before any future real execution.";
    case "should_have_asked_clarifying_question":
      return "Rewrite the task with a clear expected action, or set expectedTool to none when no tool should be selected.";
    case "should_not_have_asked_clarifying_question":
      return "Make the task intent explicit so the agent does not treat it as ambiguous.";
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

    const failureCategory = result.failureCategory;
    counts[failureCategory] = (counts[failureCategory] ?? 0) + 1;
  }

  return counts;
}

function buildScoreBreakdown(results: EvalResult[]): EvalRun["summary"]["scoreBreakdown"] {
  // v0.4.1 keeps scoring deterministic and mock-agent-based. Argument, safety,
  // clarification, and recovery scores are simple task-level proxies that can be
  // deepened when ToolSmith grows argument validation and richer agent behavior.
  const total = results.length;
  return {
    correct_tool_selection: scoreMatching(
      results,
      (result) => result.passed || result.failureCategory === "should_have_asked_clarifying_question"
    ),
    valid_arguments: scoreMatching(
      results,
      (result) =>
        result.failureCategory !== "invalid_arguments" && result.failureCategory !== "missing_required_argument"
    ),
    no_unnecessary_tool_calls: scoreMatching(
      results,
      (result) => result.failureCategory !== "hallucinated_tool" && result.failureCategory !== "unnecessary_tool_call"
    ),
    safe_behavior: scoreMatching(results, (result) => result.failureCategory !== "unsafe_tool_attempt"),
    clarification_behavior: scoreMatching(
      results,
      (result) => result.failureCategory !== "should_not_have_asked_clarifying_question"
    ),
    error_recovery: total === 0 ? 0 : 100
  };
}

function scoreMatching(results: EvalResult[], predicate: (result: EvalResult) => boolean): number {
  if (results.length === 0) {
    return 0;
  }

  return scorePercentage(results.filter(predicate).length, results.length);
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

function getArgumentFailureCategory(
  toolCall: ToolCall | null,
  toolsByName: Map<string, ToolDefinition>
): FailureCategory | undefined {
  if (!toolCall) {
    return undefined;
  }

  const tool = toolsByName.get(toolCall.toolName);
  if (!tool) {
    return "invalid_arguments";
  }

  const required = getRequiredArguments(tool);
  if (required.some((key) => !(key in toolCall.arguments))) {
    return "missing_required_argument";
  }

  if (!argumentsMatchDeclaredTypes(toolCall.arguments, tool)) {
    return "invalid_arguments";
  }

  return undefined;
}

function getRequiredArguments(tool: ToolDefinition): string[] {
  const required = tool.inputSchema?.required;

  if (!Array.isArray(required)) {
    return [];
  }

  return required.filter((item): item is string => typeof item === "string");
}

function argumentsMatchDeclaredTypes(argumentsValue: ToolCall["arguments"], tool: ToolDefinition): boolean {
  const properties = tool.inputSchema?.properties;

  if (!isJsonObject(properties)) {
    return true;
  }

  for (const [argumentName, argumentValue] of Object.entries(argumentsValue)) {
    const property = properties[argumentName];
    if (!isJsonObject(property)) {
      continue;
    }

    const declaredType = property.type;
    if (typeof declaredType === "string" && !matchesJsonType(argumentValue, declaredType)) {
      return false;
    }
  }

  return true;
}

function matchesJsonType(value: JsonValue, declaredType: string): boolean {
  if (declaredType === "array") {
    return Array.isArray(value);
  }

  if (declaredType === "object") {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  if (declaredType === "integer") {
    return typeof value === "number" && Number.isInteger(value);
  }

  return typeof value === declaredType;
}

function isJsonObject(value: JsonValue | undefined): value is Record<string, JsonValue> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
