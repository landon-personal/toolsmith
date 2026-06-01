#!/usr/bin/env node
import { buildCli } from "./index.js";

async function main(): Promise<void> {
  await buildCli().parseAsync(process.argv);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`ToolSmith error: ${message}`);
  process.exitCode = 1;
});
