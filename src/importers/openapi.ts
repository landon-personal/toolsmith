import type { JsonValue, ToolDefinition, ToolFile } from "../types.js";
import { VERSION } from "../version.js";

const SUPPORTED_METHODS = new Set(["get", "post", "put", "patch", "delete"]);

export interface OpenApiImportResult {
  toolFile: ToolFile;
  pathsScanned: number;
  operationsImported: number;
  warnings: string[];
}

interface OperationContext {
  method: string;
  path: string;
  operation: Record<string, unknown>;
}

export function importOpenApiDocument(document: unknown): OpenApiImportResult {
  const warnings: string[] = [];

  if (!isRecord(document)) {
    throw new Error("OpenAPI file must contain a JSON object.");
  }

  if (typeof document.openapi !== "string" || document.openapi.trim().length === 0) {
    warnings.push('Missing or invalid "openapi" field.');
  }

  const paths = document.paths;
  if (!isRecord(paths)) {
    throw new Error('OpenAPI file must include a "paths" object.');
  }

  const title = isRecord(document.info) && typeof document.info.title === "string" ? document.info.title : "OpenAPI";
  const tools: ToolDefinition[] = [];
  const usedNames = new Set<string>();
  const pathEntries = Object.entries(paths);

  for (const [path, pathItem] of pathEntries) {
    if (!isRecord(pathItem)) {
      warnings.push(`Skipping ${path}: path item must be an object.`);
      continue;
    }

    for (const [method, operation] of Object.entries(pathItem)) {
      const normalizedMethod = method.toLowerCase();

      if (!SUPPORTED_METHODS.has(normalizedMethod)) {
        if (!["parameters", "summary", "description"].includes(normalizedMethod)) {
          warnings.push(`Skipping unsupported method "${method.toUpperCase()}" for ${path}.`);
        }
        continue;
      }

      if (!isRecord(operation)) {
        warnings.push(`Skipping ${method.toUpperCase()} ${path}: operation must be an object.`);
        continue;
      }

      tools.push(
        buildTool(
          {
            method: normalizedMethod,
            path,
            operation
          },
          usedNames,
          warnings
        )
      );
    }
  }

  return {
    toolFile: {
      name: toSlug(title),
      version: VERSION,
      description: `Generated from OpenAPI: ${title}. Review and lint before using with agents.`,
      safety: {
        network: false,
        realSideEffects: false
      },
      tools
    },
    pathsScanned: pathEntries.length,
    operationsImported: tools.length,
    warnings
  };
}

function buildTool(context: OperationContext, usedNames: Set<string>, warnings: string[]): ToolDefinition {
  const name = uniqueName(getToolName(context), usedNames);
  const inputSchema = buildInputSchema(context, warnings);
  const sideEffects = getSideEffects(context.method);
  const requiresConfirmation = context.method !== "get";

  return {
    name,
    description: buildDescription(context),
    ...(Object.keys(inputSchema.properties).length > 0 ? { inputSchema } : {}),
    ...(sideEffects ? { sideEffects } : {}),
    ...(requiresConfirmation ? { requiresConfirmation } : {})
  };
}

function getToolName(context: OperationContext): string {
  const operationId = context.operation.operationId;
  if (typeof operationId === "string" && operationId.trim().length > 0) {
    return toSnakeCase(operationId);
  }

  return nameFromMethodAndPath(context.method, context.path, context.operation);
}

function nameFromMethodAndPath(method: string, path: string, operation: Record<string, unknown>): string {
  const summary = typeof operation.summary === "string" ? operation.summary.toLowerCase() : "";
  const pathTokens = path
    .split("/")
    .filter(Boolean)
    .map((part) => (part.startsWith("{") && part.endsWith("}") ? `by_${part.slice(1, -1)}` : part))
    .flatMap((part) => toWords(part));

  if (method === "post" && summary.includes("create") && pathTokens.length > 0) {
    return toSnakeCase(["create", singularize(pathTokens[pathTokens.length - 1] ?? "resource")].join("_"));
  }

  return toSnakeCase([method, ...pathTokens].join("_"));
}

function buildDescription(context: OperationContext): string {
  const summary = cleanText(context.operation.summary);
  const description = cleanText(context.operation.description);
  const prefix = `${context.method.toUpperCase()} ${context.path}.`;
  const detail = [summary, description].filter(Boolean).join(" ");

  return detail ? `${prefix} ${detail}` : prefix;
}

function buildInputSchema(
  context: OperationContext,
  warnings: string[]
): { type: "object"; properties: Record<string, JsonValue>; required: string[] } {
  const properties: Record<string, JsonValue> = {};
  const required: string[] = [];

  for (const parameter of getParameters(context.operation, context.path, context.method, warnings)) {
    const name = typeof parameter.name === "string" ? parameter.name : undefined;
    const location = typeof parameter.in === "string" ? parameter.in : "parameter";

    if (!name) {
      warnings.push(`Skipping unnamed parameter in ${context.method.toUpperCase()} ${context.path}.`);
      continue;
    }

    const schema = isRecord(parameter.schema) ? parameter.schema : {};
    properties[toSnakeCase(name)] = {
      ...toJsonSchema(schema),
      description: cleanText(parameter.description) || `${location} parameter "${name}".`
    };

    if (parameter.required === true || location === "path") {
      required.push(toSnakeCase(name));
    }
  }

  const requestBody = context.operation.requestBody;
  if (isRecord(requestBody)) {
    const jsonSchema = getJsonRequestBodySchema(requestBody);

    if (jsonSchema) {
      addRequestBodyProperties(jsonSchema, properties, required);
    } else {
      warnings.push(`Skipping unsupported requestBody content for ${context.method.toUpperCase()} ${context.path}.`);
    }
  }

  return {
    type: "object",
    properties,
    required: unique(required)
  };
}

function getParameters(
  operation: Record<string, unknown>,
  path: string,
  method: string,
  warnings: string[]
): Record<string, unknown>[] {
  if (operation.parameters === undefined) {
    return [];
  }

  if (!Array.isArray(operation.parameters)) {
    warnings.push(`Skipping parameters for ${method.toUpperCase()} ${path}: parameters must be an array.`);
    return [];
  }

  return operation.parameters.filter((parameter): parameter is Record<string, unknown> => {
    if (isRecord(parameter)) {
      return true;
    }

    warnings.push(`Skipping malformed parameter in ${method.toUpperCase()} ${path}.`);
    return false;
  });
}

function getJsonRequestBodySchema(requestBody: Record<string, unknown>): Record<string, unknown> | undefined {
  const content = requestBody.content;
  if (!isRecord(content)) {
    return undefined;
  }

  const jsonContent = content["application/json"];
  if (!isRecord(jsonContent) || !isRecord(jsonContent.schema)) {
    return undefined;
  }

  return jsonContent.schema;
}

function addRequestBodyProperties(
  schema: Record<string, unknown>,
  properties: Record<string, JsonValue>,
  required: string[]
): void {
  const schemaProperties = schema.properties;
  if (!isRecord(schemaProperties)) {
    properties.body = toJsonSchema(schema);
    if (Array.isArray(schema.required) || schema.required === undefined) {
      required.push("body");
    }
    return;
  }

  for (const [key, value] of Object.entries(schemaProperties)) {
    properties[toSnakeCase(key)] = toJsonSchema(isRecord(value) ? value : {});
  }

  if (Array.isArray(schema.required)) {
    for (const item of schema.required) {
      if (typeof item === "string") {
        required.push(toSnakeCase(item));
      }
    }
  }
}

function toJsonSchema(schema: Record<string, unknown>): Record<string, JsonValue> {
  const output: Record<string, JsonValue> = {};
  const type = schema.type;
  const description = schema.description;

  output.type = typeof type === "string" ? type : "string";

  if (typeof description === "string" && description.trim().length > 0) {
    output.description = description.trim();
  }

  if (Array.isArray(schema.enum) && schema.enum.every(isJsonPrimitive)) {
    output.enum = schema.enum;
  }

  return output;
}

function getSideEffects(method: string): string | undefined {
  if (method === "get") {
    return undefined;
  }

  if (method === "delete") {
    return "destructive external side effect if connected to a real API; generated tool is definition-only.";
  }

  return "external side effect if connected to a real API; generated tool is definition-only.";
}

function uniqueName(name: string, usedNames: Set<string>): string {
  let candidate = name;
  let suffix = 2;

  while (usedNames.has(candidate)) {
    candidate = `${name}_${suffix}`;
    suffix += 1;
  }

  usedNames.add(candidate);
  return candidate;
}

function toSlug(value: string): string {
  return toSnakeCase(value).replace(/_/g, "-") || "openapi-tools";
}

function toSnakeCase(value: string): string {
  const words = toWords(value);
  return words.length > 0 ? words.join("_") : "unnamed_operation";
}

function toWords(value: string): string[] {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function singularize(value: string): string {
  return value.endsWith("s") && value.length > 1 ? value.slice(0, -1) : value;
}

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isJsonPrimitive(value: unknown): value is string | number | boolean | null {
  return value === null || ["string", "number", "boolean"].includes(typeof value);
}
