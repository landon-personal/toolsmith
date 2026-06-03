# ToolSmith

ToolSmith is a local-first developer tool for testing whether AI agents can correctly use tool definitions.

The project is intentionally small. The current runtime provides a TypeScript Node CLI with a local mock evaluation pipeline, categorized scoring, and static tool linting:

- `init` creates a local `toolsmith.config.json` file.
- `lint` loads local `tools.json`, validates it, and reports static issues that could confuse AI agents.
- `eval` loads local `tools.json` and `tasks.json`, runs tasks through a keyword mock agent, scores results, categorizes failures, and writes `.toolsmith/runs/latest.json`.
- `report` reads `.toolsmith/runs/latest.json` and prints score, failure breakdown, passed tasks, failed tasks, reasons, and recommendations.

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
npm run dev -- report
```

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

## Current Scope

v0.4.1 aligns eval score breakdowns and failure categories with the roadmap while preserving the package-ready CLI behavior from v0.3.0. ToolSmith remains unpublished, local-first, mock-agent-based, and free of real model/API integration or real tool side effects.
