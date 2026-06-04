import { readFileSync } from "node:fs";

export const VERSION = readPackageVersion();

function readPackageVersion(): string {
  const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
    version?: unknown;
  };

  if (typeof packageJson.version !== "string" || packageJson.version.trim().length === 0) {
    throw new Error("package.json must include a non-empty version string.");
  }

  return packageJson.version;
}
