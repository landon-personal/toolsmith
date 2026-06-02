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

export type FailureReason =
  | "NO_TOOL_SELECTED"
  | "WRONG_TOOL_SELECTED"
  | "EXPECTED_TOOL_NOT_DEFINED";

export interface EvalResult {
  taskId: string;
  prompt: string;
  expectedTool: string;
  actualTool: string | null;
  passed: boolean;
  failureReason?: FailureReason;
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
