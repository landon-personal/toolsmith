import OpenAI from "openai";
import { ToolSmithError } from "../errors.js";
import type { JsonValue, ToolCall, ToolDefinition } from "../types.js";
import type { ToolSelectionInput, ToolSelectionProvider, ToolSelectionResult } from "./types.js";

export const DEFAULT_OPENAI_MODEL = "gpt-4.1-mini";

interface OpenAIProviderOptions {
  apiKey?: string;
  model?: string;
  client?: OpenAIChatClient;
}

export interface OpenAIChatClient {
  chat: {
    completions: {
      create(params: OpenAIChatCompletionRequest): Promise<OpenAIChatCompletionResponse>;
    };
  };
}

interface OpenAIChatCompletionRequest {
  model: string;
  messages: Array<{ role: "system" | "user"; content: string }>;
  tools: OpenAIFunctionTool[];
  tool_choice: "auto";
}

interface OpenAIFunctionTool {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
}

interface OpenAIChatCompletionResponse {
  model?: string;
  choices: Array<{
    message?: {
      content?: string | null;
      refusal?: string | null;
      function_call?: {
        name: string;
        arguments: string;
      } | null;
      tool_calls?: Array<{
        type: string;
        function?: {
          name: string;
          arguments: string;
        };
      }>;
    };
  }>;
}

export function createOpenAIProvider(options: OpenAIProviderOptions = {}): ToolSelectionProvider {
  const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;
  const model = options.model ?? process.env.OPENAI_MODEL ?? DEFAULT_OPENAI_MODEL;

  if (!apiKey && !options.client) {
    throw new ToolSmithError(
      [
        "OpenAI provider requires OPENAI_API_KEY.",
        "Set it before running the eval:",
        "export OPENAI_API_KEY=...",
        "",
        "The mock provider remains available without an API key:",
        "toolsmith eval . --provider mock"
      ].join("\n")
    );
  }

  const client = options.client ?? (new OpenAI({ apiKey }) as unknown as OpenAIChatClient);

  return {
    name: "openai",
    model,
    async selectTool(input: ToolSelectionInput): Promise<ToolSelectionResult> {
      const response = await client.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: [
              "You are evaluating AI tool-selection behavior for ToolSmith.",
              "Choose at most one tool from the provided function tools when the user prompt clearly requires it.",
              "Do not claim that any selected tool was executed.",
              "If no tool should be selected, answer briefly without calling a tool."
            ].join(" ")
          },
          {
            role: "user",
            content: input.task.prompt
          }
        ],
        tools: input.tools.map(toOpenAIFunctionTool),
        tool_choice: "auto"
      });

      return parseOpenAIResponse(response);
    }
  };
}

export function parseOpenAIResponse(response: OpenAIChatCompletionResponse): ToolSelectionResult {
  const message = response.choices[0]?.message;
  const functionToolCall = message?.tool_calls?.find((toolCall) => toolCall.type === "function" && toolCall.function)
    ?.function;
  const deprecatedFunctionCall = message?.function_call ?? undefined;
  const selectedFunction = functionToolCall ?? deprecatedFunctionCall;
  const textResponse = firstNonEmptyString(message?.content, message?.refusal);

  if (!selectedFunction) {
    return {
      toolCall: null,
      ...(textResponse ? { textResponse } : {}),
      ...(response.model ? { model: response.model } : {})
    };
  }

  return {
    toolCall: {
      toolName: selectedFunction.name,
      arguments: parseToolArguments(selectedFunction.arguments),
      reason: "OpenAI model selected this function tool."
    },
    ...(textResponse ? { textResponse } : {}),
    ...(response.model ? { model: response.model } : {})
  };
}

function toOpenAIFunctionTool(tool: ToolDefinition): OpenAIFunctionTool {
  if (!isOpenAIFunctionName(tool.name)) {
    throw new ToolSmithError(
      `OpenAI provider cannot send tool "${tool.name}" because function names must contain only letters, numbers, underscores, or dashes and be 64 characters or fewer.`
    );
  }

  return {
    type: "function",
    function: {
      name: tool.name,
      ...(tool.description ? { description: tool.description } : {}),
      parameters: toFunctionParameters(tool.inputSchema)
    }
  };
}

function toFunctionParameters(inputSchema: Record<string, JsonValue> | undefined): Record<string, unknown> {
  if (!inputSchema) {
    return {
      type: "object",
      properties: {}
    };
  }

  return inputSchema;
}

function parseToolArguments(rawArguments: string): ToolCall["arguments"] {
  if (rawArguments.trim().length === 0) {
    return {};
  }

  try {
    const parsed = JSON.parse(rawArguments) as unknown;
    if (isJsonObject(parsed)) {
      return parsed as ToolCall["arguments"];
    }
  } catch {
    return {};
  }

  return {};
}

function firstNonEmptyString(...values: Array<string | null | undefined>): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return undefined;
}

function isOpenAIFunctionName(value: string): boolean {
  return /^[A-Za-z0-9_-]{1,64}$/.test(value);
}

function isJsonObject(value: unknown): value is Record<string, JsonValue> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
