import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { ToolSmithError } from "../errors.js";
import type { CommandIO } from "../io.js";
import { defaultIO } from "../io.js";
import { importOpenApiDocument, type OpenApiImportResult } from "../importers/openapi.js";
import { validateToolsFile } from "../validation.js";

export interface ImportOpenApiOptions {
  out?: string;
  cwd?: string;
}

export async function runImportOpenApi(
  sourcePath: string,
  options: ImportOpenApiOptions,
  io: CommandIO = defaultIO
): Promise<OpenApiImportResult> {
  if (!options.out) {
    throw new ToolSmithError("Missing required --out <path> for OpenAPI import.");
  }

  const cwd = options.cwd ?? process.cwd();
  const resolvedSourcePath = resolve(cwd, sourcePath);
  const resolvedOutputPath = resolve(cwd, options.out);
  const document = await readJsonFile(resolvedSourcePath);
  const result = importOpenApiDocument(document);

  if (result.operationsImported === 0) {
    throw new ToolSmithError("OpenAPI import found no supported operations to convert.");
  }

  validateToolsFile(result.toolFile, options.out);
  await mkdir(dirname(resolvedOutputPath), { recursive: true });
  await writeFile(resolvedOutputPath, `${JSON.stringify(result.toolFile, null, 2)}\n`, "utf8");

  printSummary(sourcePath, options.out, result, io);

  return result;
}

async function readJsonFile(path: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as unknown;
  } catch (error: unknown) {
    if (isNodeError(error) && error.code === "ENOENT") {
      throw new ToolSmithError(`Missing OpenAPI file: expected JSON at ${path}.`);
    }

    if (error instanceof SyntaxError) {
      throw new ToolSmithError(`Malformed OpenAPI file: ${path} is not valid JSON.`);
    }

    throw error;
  }
}

function printSummary(
  sourcePath: string,
  outputPath: string,
  result: OpenApiImportResult,
  io: CommandIO
): void {
  io.stdout("ToolSmith OpenAPI Import");
  io.stdout(`Source: ${sourcePath}`);
  io.stdout(`Output: ${outputPath}`);
  io.stdout(`Paths scanned: ${result.pathsScanned}`);
  io.stdout(`Operations imported: ${result.operationsImported}`);
  io.stdout("");
  io.stdout("Warnings:");

  if (result.warnings.length === 0) {
    io.stdout("- none");
  } else {
    for (const warning of result.warnings) {
      io.stdout(`- ${warning}`);
    }
  }

  io.stdout("");
  io.stdout(`Next: npm run dev -- lint . --tools ${outputPath}`);
  io.stdout("Safety: generated tool definitions only; no imported API operations were executed.");
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
