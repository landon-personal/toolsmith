import { ToolSmithError } from "../errors.js";
import type { ProviderName } from "../types.js";
import { createMockProvider } from "./mock.js";
import { createOpenAIProvider } from "./openai.js";
import type { ToolSelectionProvider } from "./types.js";

export const PROVIDERS: ProviderName[] = ["mock", "openai"];

export function parseProviderName(value: string | undefined): ProviderName {
  if (value === undefined || value === "mock" || value === "openai") {
    return value ?? "mock";
  }

  throw new ToolSmithError(`Unsupported provider "${value}". Use mock or openai.`);
}

export function createToolSelectionProvider(providerName: ProviderName = "mock"): ToolSelectionProvider {
  if (providerName === "mock") {
    return createMockProvider();
  }

  return createOpenAIProvider();
}

export type { ToolSelectionProvider, ToolSelectionResult } from "./types.js";
