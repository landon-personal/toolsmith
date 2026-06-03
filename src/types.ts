export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface ToolDefinition {
  name: string;
  description?: string;
  sideEffects?: string;
  inputSchema?: Record<string, JsonValue>;
  outputSchema?: Record<string, JsonValue>;
  examples?: string[];
  requiresConfirmation?: boolean;
}

export interface ToolFile {
  name: string;
  version: string;
  description?: string;
  safety?: {
    network?: boolean;
    realSideEffects?: boolean;
  };
  tools: ToolDefinition[];
}

export interface TaskDefinition {
  id: string;
  prompt: string;
  expectedTool: string;
  successCriteria?: string[];
}

export interface TaskFile {
  name: string;
  version: string;
  tasks: TaskDefinition[];
}

export interface ToolCall {
  toolName: string;
  arguments: Record<string, JsonValue>;
  reason: string;
}

export type FailureCategory =
  | "wrong_tool"
  | "missing_tool_call"
  | "hallucinated_tool"
  | "invalid_arguments"
  | "missing_required_argument"
  | "unnecessary_tool_call"
  | "unsafe_tool_attempt"
  | "should_have_asked_clarifying_question"
  | "should_not_have_asked_clarifying_question"
  | "unknown_error";

export type FailureReason = FailureCategory;

export type ResultCategory = "passed" | FailureCategory;

export type ScoreBreakdownKey =
  | "correct_tool_selection"
  | "valid_arguments"
  | "no_unnecessary_tool_calls"
  | "safe_behavior"
  | "clarification_behavior"
  | "error_recovery";

export type ScoreBreakdown = Record<ScoreBreakdownKey, number>;

export interface EvalResult {
  taskId: string;
  prompt: string;
  expectedTool: string;
  actualTool: string | null;
  passed: boolean;
  failureCategory: ResultCategory;
  failureReason?: FailureReason;
  reason: string;
  recommendation: string;
  suggestion?: string;
  toolCall: ToolCall | null;
}

export interface EvalRun {
  id: string;
  version: string;
  createdAt: string;
  examplePath: string;
  toolsPath: string;
  tasksPath: string;
  agent: {
    name: "keyword-mock-agent";
    version: string;
  };
  summary: {
    total: number;
    passed: number;
    failed: number;
    score: number;
    scoreBreakdown: ScoreBreakdown;
    failureCategories: Partial<Record<FailureCategory, number>>;
  };
  results: EvalResult[];
}

export type ToolLintSeverity = "info" | "warning" | "error";

export type ToolLintCategory =
  | "naming"
  | "description"
  | "parameters"
  | "overlap"
  | "safety"
  | "examples";

export interface ToolLintIssue {
  id: string;
  severity: ToolLintSeverity;
  category: ToolLintCategory;
  message: string;
  recommendation: string;
  toolName?: string;
  toolNames?: string[];
}

export interface ToolLintReport {
  version: string;
  toolsChecked: number;
  issues: ToolLintIssue[];
  summary: Record<ToolLintSeverity, number>;
}
