import type { JsonValue, ToolDefinition, ToolFile, ToolLintIssue, ToolLintReport } from "./types.js";
import { VERSION } from "./version.js";

const VAGUE_TOOL_NAMES = new Set([
  "process_data",
  "manage_user",
  "handle_request",
  "do_thing",
  "run_action",
  "update_info"
]);

const UNCLEAR_PARAMETER_NAMES = new Set(["data", "input", "payload", "args", "value", "info"]);

const ACTIONS_THAT_USUALLY_NEED_INPUT = new Set([
  "create",
  "send",
  "delete",
  "update",
  "manage",
  "process",
  "handle",
  "run",
  "schedule",
  "charge",
  "refund",
  "deploy",
  "publish"
]);

const RISKY_SIDE_EFFECT_TERMS = new Set([
  "send",
  "delete",
  "refund",
  "charge",
  "email",
  "calendar",
  "database",
  "deploy",
  "publish",
  "update"
]);

const DESCRIPTION_GUIDANCE_PHRASES = [
  "when ",
  "use this",
  "use for",
  "only use",
  "should be used",
  "choose this",
  "call this",
  "for "
];

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "or",
  "the",
  "to",
  "of",
  "in",
  "on",
  "with",
  "without",
  "mock",
  "mocked",
  "local",
  "tool",
  "service",
  "services"
]);

export function lintToolFile(toolFile: ToolFile): ToolLintReport {
  const issues: ToolLintIssue[] = [];

  for (const tool of toolFile.tools) {
    lintToolName(tool, issues);
    lintDescription(tool, issues);
    lintParameters(tool, issues);
    lintRiskySideEffects(tool, issues);
    lintExamples(tool, issues);
  }

  lintOverlaps(toolFile.tools, issues);

  return {
    version: VERSION,
    toolsChecked: toolFile.tools.length,
    issues,
    summary: {
      info: issues.filter((issue) => issue.severity === "info").length,
      warning: issues.filter((issue) => issue.severity === "warning").length,
      error: issues.filter((issue) => issue.severity === "error").length
    }
  };
}

function lintToolName(tool: ToolDefinition, issues: ToolLintIssue[]): void {
  const normalizedName = normalizeName(tool.name);

  if (!VAGUE_TOOL_NAMES.has(normalizedName)) {
    return;
  }

  addIssue(issues, {
    id: "vague-tool-name",
    severity: "warning",
    category: "naming",
    message: "Vague tool name.",
    recommendation:
      "Rename this tool with a specific verb_noun name, such as create_calendar_event or send_email.",
    toolNames: [tool.name]
  });
}

function lintDescription(tool: ToolDefinition, issues: ToolLintIssue[]): void {
  const description = tool.description?.trim();

  if (!description) {
    addIssue(issues, {
      id: "missing-description",
      severity: "warning",
      category: "description",
      message: "Missing description.",
      recommendation: "Add 1-2 sentences explaining what the tool does and when an agent should use it.",
      toolNames: [tool.name]
    });
    return;
  }

  if (wordCount(description) < 8) {
    addIssue(issues, {
      id: "weak-description",
      severity: "warning",
      category: "description",
      message: "Description is very short.",
      recommendation: "Explain the action, the expected input, and the situation where this tool should be chosen.",
      toolNames: [tool.name]
    });
  }

  if (!hasUsageGuidance(description)) {
    addIssue(issues, {
      id: "description-usage-guidance",
      severity: "info",
      category: "description",
      message: "Description could be clearer.",
      recommendation: "Mention when the agent should choose this tool and what nearby tools it should avoid.",
      toolNames: [tool.name]
    });
  }
}

function lintParameters(tool: ToolDefinition, issues: ToolLintIssue[]): void {
  const properties = getInputProperties(tool);

  if (toolLikelyNeedsInput(tool) && properties.length === 0) {
    addIssue(issues, {
      id: "missing-parameters",
      severity: "warning",
      category: "parameters",
      message: "Tool appears to need input but has no parameters.",
      recommendation: "Add an inputSchema with named fields the agent must provide before calling this tool.",
      toolNames: [tool.name]
    });
  }

  const unclearNames = properties.filter((propertyName) =>
    UNCLEAR_PARAMETER_NAMES.has(normalizeName(propertyName))
  );

  if (unclearNames.length > 0) {
    addIssue(issues, {
      id: "unclear-parameter-name",
      severity: "warning",
      category: "parameters",
      message: `Unclear parameter name${unclearNames.length === 1 ? "" : "s"}: ${unclearNames.join(", ")}.`,
      recommendation: "Rename vague parameters to specific nouns such as email_body, event_title, or user_id.",
      toolNames: [tool.name]
    });
  }
}

function lintRiskySideEffects(tool: ToolDefinition, issues: ToolLintIssue[]): void {
  const tokens = new Set(toTokens(`${tool.name} ${tool.description ?? ""}`));
  const riskyTerms = [...RISKY_SIDE_EFFECT_TERMS].filter((term) => tokens.has(term));

  if (riskyTerms.length === 0) {
    return;
  }

  addIssue(issues, {
    id: "risky-side-effect-tool",
    severity: "warning",
    category: "safety",
    message: "Risky side effect tool.",
    recommendation:
      "Mark this tool as requiring confirmation before real execution and document any mock-only safety limits.",
    toolNames: [tool.name]
  });
}

function lintExamples(tool: ToolDefinition, issues: ToolLintIssue[]): void {
  if (tool.examples && tool.examples.length > 0) {
    return;
  }

  addIssue(issues, {
    id: "missing-examples",
    severity: "warning",
    category: "examples",
    message: "Missing examples.",
    recommendation: "Add 1-3 examples showing when the agent should use this tool.",
    toolNames: [tool.name]
  });
}

function lintOverlaps(tools: ToolDefinition[], issues: ToolLintIssue[]): void {
  for (let leftIndex = 0; leftIndex < tools.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < tools.length; rightIndex += 1) {
      const left = tools[leftIndex];
      const right = tools[rightIndex];

      if (!left || !right || !toolsOverlap(left, right)) {
        continue;
      }

      addIssue(issues, {
        id: "overlapping-tools",
        severity: "warning",
        category: "overlap",
        message: "Tools may overlap and confuse an agent.",
        recommendation: "Rename one tool or clarify each description with specific use and non-use cases.",
        toolNames: [left.name, right.name]
      });
    }
  }
}

function toolsOverlap(left: ToolDefinition, right: ToolDefinition): boolean {
  const leftNameTokens = splitName(left.name);
  const rightNameTokens = splitName(right.name);
  const sharedFirstVerb =
    leftNameTokens[0] !== undefined &&
    leftNameTokens[0] === rightNameTokens[0] &&
    ACTIONS_THAT_USUALLY_NEED_INPUT.has(leftNameTokens[0]);

  if (sharedFirstVerb) {
    return true;
  }

  if (jaccard(leftNameTokens, rightNameTokens) >= 0.6) {
    return true;
  }

  const leftDescriptionTokens = significantTokens(left.description ?? "");
  const rightDescriptionTokens = significantTokens(right.description ?? "");

  return (
    leftDescriptionTokens.length >= 3 &&
    rightDescriptionTokens.length >= 3 &&
    jaccard(leftDescriptionTokens, rightDescriptionTokens) >= 0.5
  );
}

function toolLikelyNeedsInput(tool: ToolDefinition): boolean {
  const firstNameToken = splitName(tool.name)[0];
  if (firstNameToken && ACTIONS_THAT_USUALLY_NEED_INPUT.has(firstNameToken)) {
    return true;
  }

  return toTokens(tool.description ?? "").some((token) => ACTIONS_THAT_USUALLY_NEED_INPUT.has(token));
}

function getInputProperties(tool: ToolDefinition): string[] {
  const properties = tool.inputSchema?.properties;

  if (!isRecord(properties)) {
    return [];
  }

  return Object.keys(properties);
}

function addIssue(issues: ToolLintIssue[], issue: Omit<ToolLintIssue, "toolName">): void {
  issues.push({
    ...issue,
    ...(issue.toolNames?.length === 1 ? { toolName: issue.toolNames[0] } : {})
  });
}

function hasUsageGuidance(description: string): boolean {
  const normalized = normalizeText(description);
  return DESCRIPTION_GUIDANCE_PHRASES.some((phrase) => normalized.includes(phrase));
}

function wordCount(value: string): number {
  return toTokens(value).length;
}

function significantTokens(value: string): string[] {
  return toTokens(value).filter((token) => !STOP_WORDS.has(token));
}

function splitName(name: string): string[] {
  return toTokens(name);
}

function toTokens(value: string): string[] {
  return normalizeText(value)
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
}

function normalizeName(name: string): string {
  return toTokens(name).join("_");
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function jaccard(leftTokens: string[], rightTokens: string[]): number {
  const left = new Set(leftTokens);
  const right = new Set(rightTokens);
  const intersection = [...left].filter((token) => right.has(token)).length;
  const union = new Set([...left, ...right]).size;

  if (union === 0) {
    return 0;
  }

  return intersection / union;
}

function isRecord(value: JsonValue | undefined): value is Record<string, JsonValue> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
