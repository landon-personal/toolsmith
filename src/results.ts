import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { ToolSmithError } from "./errors.js";
import type { EvalRun } from "./types.js";

export const LATEST_RUN_PATH = ".toolsmith/runs/latest.json";

export async function writeLatestRun(run: EvalRun, cwd = process.cwd()): Promise<string> {
  const path = resolve(cwd, LATEST_RUN_PATH);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(run, null, 2)}\n`, "utf8");
  return path;
}

export async function readLatestRun(cwd = process.cwd()): Promise<EvalRun> {
  const path = resolve(cwd, LATEST_RUN_PATH);

  try {
    const raw = await readFile(path, "utf8");
    return JSON.parse(raw) as EvalRun;
  } catch (error: unknown) {
    if (isNodeError(error) && error.code === "ENOENT") {
      throw new ToolSmithError(
        `No latest run found at ${path}. Run "npm run dev -- eval examples/calendar-email" first.`
      );
    }

    if (error instanceof SyntaxError) {
      throw new ToolSmithError(`Latest run file is malformed JSON: ${path}.`);
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
