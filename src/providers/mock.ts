import { chooseMockTool } from "../mockAgent.js";
import type { ToolSelectionInput, ToolSelectionProvider, ToolSelectionResult } from "./types.js";

export function createMockProvider(): ToolSelectionProvider {
  return {
    name: "mock",
    async selectTool(input: ToolSelectionInput): Promise<ToolSelectionResult> {
      return chooseMockTool(input.task.prompt, input.tools);
    }
  };
}
