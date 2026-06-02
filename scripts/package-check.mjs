#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");
const packageJson = JSON.parse(readFileSync(join(projectRoot, "package.json"), "utf8"));
const npmCommand = "npm";
const binName = process.platform === "win32" ? "toolsmith.cmd" : "toolsmith";

let packageTarballPath;
let tempDirectory;
let npmEnvironment = process.env;
let succeeded = false;

try {
  tempDirectory = await mkdtemp(join(tmpdir(), "toolsmith-package-check-"));
  npmEnvironment = {
    ...process.env,
    npm_config_cache: join(tempDirectory, "npm-cache")
  };

  console.log("Packing ToolSmith...");
  const packOutput = runCapture(npmCommand, ["pack", "--json"], projectRoot);
  const packResult = parsePackOutput(packOutput);
  packageTarballPath = join(projectRoot, packResult.filename);

  assertCleanPackFiles(packResult.files);

  console.log(`Installing package into ${tempDirectory}...`);
  runInherited(npmCommand, [
    "install",
    "--prefix",
    tempDirectory,
    packageTarballPath,
    "--no-audit",
    "--fund=false"
  ]);

  const installedBinPath = join(tempDirectory, "node_modules", ".bin", binName);
  const helpOutput = runCapture(installedBinPath, ["--help"], tempDirectory);
  if (!helpOutput.includes("Usage: toolsmith") || !helpOutput.includes("eval")) {
    throw new Error("Installed CLI --help output did not include expected ToolSmith usage text.");
  }

  const versionOutput = runCapture(installedBinPath, ["--version"], tempDirectory).trim();
  if (versionOutput !== packageJson.version) {
    throw new Error(
      `Installed CLI --version returned "${versionOutput}", expected "${packageJson.version}".`
    );
  }

  succeeded = true;
  console.log(`Package check passed for toolsmith@${packageJson.version}.`);
} finally {
  if (succeeded) {
    await cleanup(tempDirectory, packageTarballPath);
  } else {
    console.error("Package check failed.");
    if (tempDirectory) {
      console.error(`Temporary install directory retained: ${tempDirectory}`);
    }
    if (packageTarballPath) {
      console.error(`Package tarball retained: ${packageTarballPath}`);
    }
  }
}

function runCapture(command, args, cwd) {
  const normalized = normalizeCommand(command, args);

  return execFileSync(normalized.command, normalized.args, {
    cwd,
    env: npmEnvironment,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"]
  });
}

function runInherited(command, args) {
  const normalized = normalizeCommand(command, args);

  execFileSync(normalized.command, normalized.args, {
    cwd: projectRoot,
    env: npmEnvironment,
    stdio: "inherit"
  });
}

function normalizeCommand(command, args) {
  if (process.platform !== "win32") {
    return { command, args };
  }

  return {
    command: process.env.ComSpec ?? "cmd.exe",
    args: ["/d", "/s", "/c", [quoteForCmd(command), ...args.map(quoteForCmd)].join(" ")]
  };
}

function quoteForCmd(value) {
  return `"${String(value).replace(/"/g, '\\"')}"`;
}

function parsePackOutput(packOutput) {
  const parsed = JSON.parse(packOutput);
  const packResult = parsed[0];

  if (!packResult || typeof packResult.filename !== "string") {
    throw new Error("npm pack --json did not return a package filename.");
  }

  return packResult;
}

function assertCleanPackFiles(files) {
  if (!Array.isArray(files)) {
    throw new Error("npm pack --json did not return a file list.");
  }

  const disallowedPatterns = [
    /^node_modules\//,
    /^coverage\//,
    /^scripts\//,
    /^src\//,
    /^test\//,
    /^\.toolsmith\/runs\//,
    /^\.env(?:\.|$)/,
    /^\.DS_Store$/
  ];

  const disallowedFile = files
    .map((file) => String(file.path ?? ""))
    .find((filePath) => disallowedPatterns.some((pattern) => pattern.test(filePath)));

  if (disallowedFile) {
    throw new Error(`Package tarball includes disallowed file: ${disallowedFile}`);
  }
}

async function cleanup(tempPath, tarballPath) {
  if (tempPath) {
    await rm(tempPath, { recursive: true, force: true });
  }

  if (tarballPath) {
    await rm(tarballPath, { force: true });
  }
}
