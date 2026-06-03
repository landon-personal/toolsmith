#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const problems = [];

function rel(path) {
  return relative(root, path) || ".";
}

function exists(path) {
  return existsSync(join(root, path));
}

function addProblem(message) {
  problems.push(message);
}

for (const forbiddenPath of ["report.md", "report.html", ".toolsmith/runs"]) {
  if (exists(forbiddenPath)) {
    addProblem(`Generated artifact is present: ${forbiddenPath}`);
  }
}

if (exists(".github/workflows")) {
  addProblem("GitHub Actions workflow directory is present: .github/workflows");
}

const rootEntries = readdirSync(root);
for (const entry of rootEntries) {
  if (entry === ".env" || entry.startsWith(".env.")) {
    addProblem(`Environment file is present: ${entry}`);
  }
}

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    const relativePath = rel(fullPath);

    if ([".git", "node_modules", "dist", "coverage"].includes(entry)) {
      continue;
    }

    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (entry.endsWith(".tgz")) {
      addProblem(`npm package tarball is present: ${relativePath}`);
    }
  }
}

walk(root);

let trackedFiles = [];
try {
  trackedFiles = execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" })
    .split("\n")
    .filter(Boolean);
} catch (error) {
  addProblem(`Could not list tracked files with git: ${error.message}`);
}

const secretPatterns = [
  { name: "OpenAI-style API key", regex: /sk-[A-Za-z0-9_-]{20,}/ },
  { name: "private key block", regex: /-----BEGIN (?:RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----/ },
  {
    name: "AWS secret access key assignment",
    regex: /AWS_SECRET_ACCESS_KEY\s*[:=]\s*["']?[A-Za-z0-9/+=]{20,}/i
  },
  {
    name: "generic secret assignment",
    regex: /\b(api[_-]?key|secret|token)\s*[:=]\s*["'][A-Za-z0-9_\-./+=]{24,}["']/i
  }
];

const skippedTrackedPrefixes = ["package-lock.json"];

for (const file of trackedFiles) {
  if (skippedTrackedPrefixes.includes(file)) {
    continue;
  }

  const fullPath = join(root, file);
  if (!existsSync(fullPath) || statSync(fullPath).isDirectory()) {
    continue;
  }

  const content = readFileSync(fullPath, "utf8");
  for (const pattern of secretPatterns) {
    if (pattern.regex.test(content)) {
      addProblem(`Possible ${pattern.name} in tracked file: ${file}`);
    }
  }
}

if (problems.length > 0) {
  console.error("Release audit failed:");
  for (const problem of problems) {
    console.error(`- ${problem}`);
  }
  process.exit(1);
}

console.log("Release audit passed.");
