import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { ToolSmithError } from "./errors.js";
import type { JsonValue, TaskDefinition, TaskFile, ToolDefinition, ToolFile } from "./types.js";

export async function loadToolsFile(path: string): Promise<ToolFile> {
  const value = await readJsonFile(path, "tools.json");
  return validateToolsFile(value, path);
}

export async function loadTasksFile(path: string): Promise<TaskFile> {
  const value = await readJsonFile(path, "tasks.json");
  return validateTasksFile(value, path);
}

export function validateToolsFile(value: unknown, path = "tools.json"): ToolFile {
  const root = expectRecord(value, `${path} must contain a JSON object.`);
  const name = expectString(root.name, `${path}: "name" must be a non-empty string.`);
  const version = expectString(root.version, `${path}: "version" must be a non-empty string.`);
  const description = optionalString(root.description, `${path}: "description" must be a string when present.`);
  const safety = validateSafety(root.safety, path);
  const tools = expectArray(root.tools, `${path}: "tools" must be an array.`);

  if (tools.length === 0) {
    throw new ToolSmithError(`${path}: "tools" must include at least one tool definition.`);
  }

  const names = new Set<string>();
  const definitions: ToolDefinition[] = tools.map((tool, index) => {
    const prefix = `${path}: tools[${index}]`;
    const record = expectRecord(tool, `${prefix} must be a JSON object.`);
    const toolName = expectString(record.name, `${prefix}.name must be a non-empty string.`);
    const toolDescription = optionalString(record.description, `${prefix}.description must be a string when present.`);

    if (names.has(toolName)) {
      throw new ToolSmithError(`${path}: duplicate tool name "${toolName}".`);
    }
    names.add(toolName);

    return {
      name: toolName,
      ...(toolDescription ? { description: toolDescription } : {}),
      sideEffects: optionalString(record.sideEffects, `${prefix}.sideEffects must be a string when present.`),
      inputSchema: optionalJsonObject(record.inputSchema, `${prefix}.inputSchema must be an object when present.`),
      outputSchema: optionalJsonObject(record.outputSchema, `${prefix}.outputSchema must be an object when present.`),
      examples: optionalStringArray(record.examples, `${prefix}.examples must be an array of strings when present.`),
      requiresConfirmation: optionalBoolean(
        record.requiresConfirmation,
        `${prefix}.requiresConfirmation must be a boolean when present.`
      )
    };
  });

  return {
    name,
    version,
    ...(description ? { description } : {}),
    ...(safety ? { safety } : {}),
    tools: definitions
  };
}

export function validateTasksFile(value: unknown, path = "tasks.json"): TaskFile {
  const root = expectRecord(value, `${path} must contain a JSON object.`);
  const name = expectString(root.name, `${path}: "name" must be a non-empty string.`);
  const version = expectString(root.version, `${path}: "version" must be a non-empty string.`);
  const tasks = expectArray(root.tasks, `${path}: "tasks" must be an array.`);

  if (tasks.length === 0) {
    throw new ToolSmithError(`${path}: "tasks" must include at least one task.`);
  }

  const ids = new Set<string>();
  const definitions: TaskDefinition[] = tasks.map((task, index) => {
    const prefix = `${path}: tasks[${index}]`;
    const record = expectRecord(task, `${prefix} must be a JSON object.`);
    const id = expectString(record.id, `${prefix}.id must be a non-empty string.`);
    const prompt = expectString(record.prompt, `${prefix}.prompt must be a non-empty string.`);
    const expectedTool = expectString(
      record.expectedTool,
      `${prefix}.expectedTool must be a non-empty string.`
    );

    if (ids.has(id)) {
      throw new ToolSmithError(`${path}: duplicate task id "${id}".`);
    }
    ids.add(id);

    return {
      id,
      prompt,
      expectedTool,
      successCriteria: optionalStringArray(
        record.successCriteria,
        `${prefix}.successCriteria must be an array of strings when present.`
      )
    };
  });

  return {
    name,
    version,
    tasks: definitions
  };
}

async function readJsonFile(path: string, label: string): Promise<unknown> {
  const resolvedPath = resolve(path);

  try {
    const raw = await readFile(resolvedPath, "utf8");
    return JSON.parse(raw) as unknown;
  } catch (error: unknown) {
    if (isNodeError(error) && error.code === "ENOENT") {
      throw new ToolSmithError(`Missing ${label}: expected a JSON file at ${resolvedPath}.`);
    }

    if (error instanceof SyntaxError) {
      throw new ToolSmithError(`Malformed ${label}: ${resolvedPath} is not valid JSON.`);
    }

    throw error;
  }
}

function validateSafety(value: unknown, path: string): ToolFile["safety"] {
  if (value === undefined) {
    return undefined;
  }

  const record = expectRecord(value, `${path}: "safety" must be an object when present.`);

  return {
    network: optionalBoolean(record.network, `${path}: safety.network must be a boolean when present.`),
    realSideEffects: optionalBoolean(
      record.realSideEffects,
      `${path}: safety.realSideEffects must be a boolean when present.`
    )
  };
}

function expectRecord(value: unknown, message: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new ToolSmithError(message);
  }

  return value;
}

function expectArray(value: unknown, message: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new ToolSmithError(message);
  }

  return value;
}

function expectString(value: unknown, message: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ToolSmithError(message);
  }

  return value;
}

function optionalString(value: unknown, message: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ToolSmithError(message);
  }

  return value;
}

function optionalStringArray(value: unknown, message: string): string[] | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new ToolSmithError(message);
  }

  return value;
}

function optionalBoolean(value: unknown, message: string): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "boolean") {
    throw new ToolSmithError(message);
  }

  return value;
}

function optionalJsonObject(value: unknown, message: string): Record<string, JsonValue> | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!isRecord(value)) {
    throw new ToolSmithError(message);
  }

  return value as Record<string, JsonValue>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
