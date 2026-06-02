# ToolSmith

ToolSmith is a local-first developer tool for testing whether AI agents can correctly use tool definitions.

The project is intentionally small in v0.2.0. It provides a TypeScript Node CLI with a local mock evaluation pipeline and static tool linting:

- `init` creates a local `toolsmith.config.json` file.
- `lint` loads local `tools.json`, validates it, and reports static issues that could confuse AI agents.
- `eval` loads local `tools.json` and `tasks.json`, runs tasks through a keyword mock agent, scores results, and writes `.toolsmith/runs/latest.json`.
- `report` reads `.toolsmith/runs/latest.json` and prints passed tasks, failed tasks, expected tools, actual tools, and suggestions.

ToolSmith does not call models, send email, edit calendars, connect to databases, deploy, publish, use API keys, or print environment variables.

## Install

```sh
npm install
```

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
```

## Project Layout

- `src/` contains the CLI and command handlers.
- `test/` contains Vitest tests.
- `docs/` contains planning and safety notes.
- `examples/calendar-email/` contains starter mocked tool and task definitions.
- `examples/confusing-tools/` contains intentionally confusing tool definitions for lint demos.

## Current Scope

v0.2.0 adds static tool linting for vague names, weak descriptions, unclear parameters, overlapping tools, risky side-effect wording, and missing examples. Real model/API integration and real tool side effects remain intentionally out of scope.
