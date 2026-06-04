import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { ToolSmithError } from "./errors.js";
import type { EvalRun } from "./types.js";

export const LATEST_RUN_PATH = join(".toolsmith", "runs", "latest.json");

export async function writeLatestRun(run: EvalRun, cwd = process.cwd()): Promise<string> {
  const path = resolve(cwd, LATEST_RUN_PATH);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(run, null, 2)}\n`, "utf8");
  return path;
}

export async function readLatestRun(cwd = process.cwd()): Promise<EvalRun> {
  const path = resolve(cwd, LATEST_RUN_PATH);
  return readRunFile(path, `No latest run found at ${path}. Run "toolsmith eval ." first.`);
}

export async function readRunFile(
  path: string,
  missingMessage = `No run file found at ${resolve(path)}.`
): Promise<EvalRun> {
  const resolvedPath = resolve(path);

  try {
    const raw = await readFile(resolvedPath, "utf8");
    return JSON.parse(raw) as EvalRun;
  } catch (error: unknown) {
    if (isNodeError(error) && error.code === "ENOENT") {
      throw new ToolSmithError(missingMessage);
    }

    if (error instanceof SyntaxError) {
      throw new ToolSmithError(`Run file is malformed JSON: ${resolvedPath}.`);
    }

    throw error;
  }
}

export function latestRunPath(cwd = process.cwd()): string {
  return join(cwd, LATEST_RUN_PATH);
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
