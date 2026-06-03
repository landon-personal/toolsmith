# ToolSmith

ToolSmith is a local-first developer tool for testing whether AI agents can correctly use tool definitions.

The project is intentionally small. The current runtime provides a TypeScript Node CLI with a local mock evaluation pipeline, categorized scoring, and static tool linting:

- `init` creates a local `toolsmith.config.json` file.
- `lint` loads local `tools.json`, validates it, and reports static issues that could confuse AI agents.
- `eval` loads local `tools.json` and `tasks.json`, runs tasks through a keyword mock agent, scores results, categorizes failures, and writes `.toolsmith/runs/latest.json`. It can fail CI with `--fail-under <score>`.
- `report` reads `.toolsmith/runs/latest.json` and prints score, failure breakdown, passed tasks, failed tasks, reasons, and recommendations. It can also generate local JSON, Markdown, and static HTML reports.
- `compare` compares two saved eval run JSON files and can fail CI with `--fail-on-regression`.
- `import openapi` converts a basic OpenAPI JSON file into ToolSmith tool definitions for review and linting.

ToolSmith does not call models, send email, edit calendars, connect to databases, deploy, publish, use API keys, or print environment variables.

## Install

```sh
npm install
```

ToolSmith is not published to npm yet. This command installs development dependencies for the local checkout.

## Future Install Goal

ToolSmith is not published to npm yet. The planned public install path is npm, with commands such as `npm install -g toolsmith` or `npx toolsmith@latest --help` after publishing is explicitly approved.

For now, use the local development command format: `npm run dev -- <command>`.

## Use

```sh
npm run dev -- --help
npm run dev -- init
npm run dev -- lint examples/calendar-email
npm run dev -- lint examples/confusing-tools
npm run dev -- eval examples/calendar-email
npm run dev -- eval examples/calendar-email --fail-under 80
npm run dev -- report
npm run dev -- report --format markdown
npm run dev -- report --format html
npm run dev -- compare baseline.json .toolsmith/runs/latest.json --fail-on-regression
npm run dev -- import openapi examples/openapi/tiny-api.json --out examples/openapi/tools.generated.json
npm run dev -- lint . --tools examples/openapi/tools.generated.json
```

Imported OpenAPI tools should be reviewed and linted before use. ToolSmith does not execute imported APIs, send network requests, or perform imported API side effects.

## Using ToolSmith with Coding Agents

ToolSmith is useful when Codex, Claude Code, or similar coding agents edit AI tool definitions. Keep shared instructions in `AGENTS.md`; Claude Code projects can use `CLAUDE.md`, and can import shared rules with `@AGENTS.md` when appropriate.

After changing agent tools, tasks, schemas, eval behavior, scoring, reports, provider behavior, or examples, run lint/eval/report and summarize the score, failure categories, regressions, changed tools/tasks, and recommendations. This is especially useful for people vibe coding agent tools because ToolSmith gives the agent a concrete local check instead of relying on intuition.

See `docs/AI_AGENT_USAGE.md` for copy-paste `AGENTS.md` and `CLAUDE.md` guidance.

## Develop

```sh
npm run compile
npm test
npm run package:check
```

`npm run package:check` builds the CLI, creates a local npm tarball, installs it into a temporary directory, runs `toolsmith --help`, runs `toolsmith --version`, and removes the temporary package artifacts on success. It does not publish to npm.

## Project Layout

- `src/` contains the CLI and command handlers.
- `test/` contains Vitest tests.
- `docs/` contains planning and safety notes.
- `examples/calendar-email/` contains starter mocked tool and task definitions.
- `examples/confusing-tools/` contains intentionally confusing tool definitions for lint demos.
- `examples/openapi/` contains a tiny OpenAPI import fixture.

## Current Scope

v0.7.0 adds basic OpenAPI JSON import while preserving CI checks, shareable reports, and package-ready CLI behavior. ToolSmith remains unpublished, local-first, mock-agent-based, and free of real model/API integration or real tool side effects.
