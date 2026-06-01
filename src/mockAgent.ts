import type { ToolCall, ToolDefinition } from "./types.js";

const EMAIL_KEYWORDS = ["email", "tell", "message"];
const CALENDAR_KEYWORDS = ["schedule", "meeting", "appointment", "calendar"];

export interface MockAgentDecision {
  toolCall: ToolCall | null;
}

export function chooseMockTool(prompt: string, tools: ToolDefinition[]): MockAgentDecision {
  const normalizedPrompt = prompt.toLowerCase();

  if (hasAnyKeyword(normalizedPrompt, EMAIL_KEYWORDS)) {
    return chooseNamedTool("send_email", tools, "Prompt matched an email keyword.");
  }

  if (hasAnyKeyword(normalizedPrompt, CALENDAR_KEYWORDS)) {
    return chooseNamedTool("create_calendar_event", tools, "Prompt matched a calendar keyword.");
  }

  return { toolCall: null };
}

function chooseNamedTool(toolName: string, tools: ToolDefinition[], reason: string): MockAgentDecision {
  const tool = tools.find((definition) => definition.name === toolName);

  if (!tool) {
    return { toolCall: null };
  }

  return {
    toolCall: {
      toolName: tool.name,
      arguments: buildMockArguments(tool.name),
      reason
    }
  };
}

function buildMockArguments(toolName: string): ToolCall["arguments"] {
  if (toolName === "send_email") {
    return {
      to: "mock-recipient@example.test",
      subject: "Mock message",
      body: "This is a local mock draft. It was not sent."
    };
  }

  if (toolName === "create_calendar_event") {
    return {
      title: "Mock calendar event",
      startsAt: "2026-06-01T09:00:00.000Z",
      durationMinutes: 30
    };
  }

  return {};
}

function hasAnyKeyword(prompt: string, keywords: string[]): boolean {
  return keywords.some((keyword) => prompt.includes(keyword));
}
