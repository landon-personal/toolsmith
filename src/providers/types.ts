import type { ProviderName, TaskDefinition, ToolCall, ToolDefinition } from "../types.js";

export interface ToolSelectionInput {
  task: TaskDefinition;
  tools: ToolDefinition[];
}

export interface ToolSelectionResult {
  toolCall: ToolCall | null;
  textResponse?: string;
  model?: string;
}

export interface ToolSelectionProvider {
  name: ProviderName;
  model?: string;
  selectTool(input: ToolSelectionInput): Promise<ToolSelectionResult>;
}
