import { mkdir, writeFile } from "node:fs/promises";
import { resolve, join, relative } from "node:path";
import type { CommandIO } from "../io.js";
import { defaultIO } from "../io.js";
import { VERSION } from "../version.js";

export interface InitOptions {
  directory?: string;
  force?: boolean;
}

export async function runInit(
  options: InitOptions = {},
  io: CommandIO = defaultIO
): Promise<void> {
  const targetDirectory = resolve(options.directory ?? process.cwd());
  const configPath = join(targetDirectory, "toolsmith.config.json");
  const displayPath = relative(process.cwd(), configPath) || configPath;
  const config = {
    version: VERSION,
    profile: "local-only",
    safety: {
      network: false,
      realEmail: false,
      realCalendar: false,
      realDatabase: false,
      printEnvironment: false
    }
  };

  await mkdir(targetDirectory, { recursive: true });
  try {
    await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, {
      flag: options.force ? "w" : "wx"
    });
  } catch (error: unknown) {
    if (isNodeError(error) && error.code === "EEXIST") {
      io.stdout(`Config already exists at ${displayPath}. Use --force to overwrite it.`);
      return;
    }

    throw error;
  }

  io.stdout(`Created ${displayPath}`);
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
