# Codex Prompts

Use these prompts for future ToolSmith development sessions.

## Continue the Local Runner

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Extend the local-only ToolSmith runner that loads tools.json and tasks.json, validates them, and reports pass/fail results without calling models, APIs, databases, email, calendar, or network services.
```

## Add Schema Validation

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Add JSON schema validation for ToolSmith tool and task files. Keep all validation local. Do not add model/API integration, API keys, network calls, or environment variable printing.
```

## Improve Reports

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Improve the report command so it reads local ToolSmith result files and prints a concise text summary. Do not add real tool adapters or external service calls.
```

## Improve Tool Linting

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Improve the v0.2.0 static tool linter for tools.json files. Keep analysis local and deterministic. Do not add real model/API integration, API keys, network calls, or real email, calendar, database, deploy, publish, or other tool side effects.
```

## Improve Package Readiness

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Improve ToolSmith npm CLI packaging readiness without publishing. Preserve macOS and Windows compatibility, use Node path/fs/os/child_process APIs for package checks, keep `npm run dev --` as the local development command, and do not add GitHub Actions, GitHub Pages publishing, npm publishing, real model/API integration, or real tool side effects.
```

## Fix First-User Init Flow

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Fix the published ToolSmith CLI first-user flow so a fresh folder can run `toolsmith init`, `toolsmith lint .`, `toolsmith eval .`, and `toolsmith report`. Ensure init creates config, tools, and tasks starter files without overwriting existing files by default. Keep all examples mock-only, do not publish to npm, do not create release tags, do not start v1.1.0, and do not add real model/API integration or real tool side effects.
```

## Fix CLI Version Output

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Fix ToolSmith CLI version output so `toolsmith --version` matches `package.json`. Avoid duplicated version strings where practical, verify the built/package CLI version path, keep npm publishing dry-run only unless explicitly approved, do not create release tags, do not start v1.1.0, and do not add real model/API integration or real tool side effects.
```

## Improve Eval Scoring

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Improve ToolSmith local mock eval scoring with clearer failure categories, saved result summaries, terminal report output, reasons, and recommendations. Keep the agent deterministic and local. Do not add real model/API integration, external API calls, publishing, dashboards, cloud features, or real tool side effects.
```

## Align Scoring Roadmap

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Align ToolSmith local mock eval scoring with the roadmap category names and score breakdown fields. Keep all scoring deterministic and local. Do not start a new version line, add Markdown/HTML reports, publish to npm, push to GitHub, add real model/API integration, or add real tool side effects.
```

## Add Shareable Reports

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Add local shareable report generation from saved eval run JSON. Keep terminal reports working, generate Markdown and static HTML locally, escape HTML content, avoid external assets or analytics, and do not publish to npm, push to GitHub, deploy GitHub Pages, add real model/API integration, or add real tool side effects.
```

## Add Coding Agent Usage Docs

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Add docs-only guidance for using ToolSmith with Codex, Claude Code, and similar coding agents. Document AGENTS.md and CLAUDE.md snippets, explain when agents should run lint/eval/report, include docs-only Claude command examples, and do not add runtime features, setup commands, publishing, GitHub push, real model/API integration, or real tool side effects.
```

## Add CI Mode and Regression Compare

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Add CI-friendly ToolSmith eval thresholds and saved-run regression comparison. Support eval --fail-under, compare baseline/current run JSON files, and compare --fail-on-regression. Keep GitHub Actions examples docs-only, and do not publish to npm, push to GitHub, create workflow files, add real model/API integration, or add real tool side effects.
```

## Add OpenAPI Importer

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Add a local OpenAPI JSON importer that converts a small supported subset into ToolSmith tool definitions. Support toolsmith import openapi <path> --out <path>, generate stable names and input schemas, warn on unsupported features, and do not execute imported APIs, build MCP server behavior, publish to npm, push to GitHub, add real model/API integration, or add real tool side effects.
```

## Prepare Docs Site

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Prepare plain Markdown documentation under docs/site for future GitHub Pages hosting. Cover quickstart, installation, tools, tasks, evals, reports, CI mode, importers, coding agents, safety, and roadmap. Do not enable GitHub Pages deployment, create GitHub Actions workflows, publish to npm, push to GitHub, add real model/API integration, or add real tool side effects.
```

## Prepare Public Beta

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Prepare ToolSmith for outside testers without publishing. Polish README and docs for fresh clone setup, examples, reports, CI checks, OpenAPI import, local package smoke checks, troubleshooting, release checklist, cross-platform expectations, and safety. Do not publish to npm, push to GitHub, create release tags, enable GitHub Pages, create GitHub Actions workflows, add real model/API integration, or add real tool side effects.
```

## Prepare Stable Local CLI

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Prepare ToolSmith v1.0.0 as the stable local-first CLI baseline. Confirm the stable command surface, update README, schema docs, migration notes, safety docs, public release docs, and release notes. Do not publish to npm, push to GitHub, create release tags, enable GitHub Pages, create GitHub Actions workflows, add real model/API integration, or add real tool side effects.
```

## Prepare Public Repository

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Prepare ToolSmith v1.0.1 for future public GitHub repository and npm publishing review. Keep changes focused on docs, metadata review, repo hygiene, and safety checks. Add public repository prep, security, privacy, and contributing docs, document package metadata blockers, optionally add a local release audit, and do not publish to npm, push to GitHub, create release tags, enable GitHub Pages, create GitHub Actions workflows, add real model/API integration, or add real tool side effects.
```

## Launch GitHub Pages Docs

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Prepare ToolSmith v1.0.3 GitHub Pages documentation using the public GitHub repository. Publish from the main branch /docs folder, add a simple docs/index.md landing page and minimal docs/_config.yml if useful, and do not publish to npm, create release tags, create GitHub Actions workflows, add real model/API integration, or add real tool side effects.
```

## Prepare Scoped npm Package

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Prepare ToolSmith v1.0.4 for scoped npm package dry-runs. Use the npm username from `npm whoami` as the scope, keep the CLI binary command as `toolsmith`, document that the unscoped `toolsmith` package is taken, run npm pack and npm publish dry-runs only, and do not run real npm publish, create release tags, create GitHub Actions workflows, add real model/API integration, or add real tool side effects.
```
