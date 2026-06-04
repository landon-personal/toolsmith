# ToolSmith

Before shipping your AI agent, test whether it knows how to use its tools.

ToolSmith is a local-first CLI for testing and linting AI agent tool definitions. It helps developers define tools, write example tasks, run local evals, inspect failure categories, generate reports, compare runs, and import basic OpenAPI specs into ToolSmith tool definitions.

## Who It Is For

- developers building tool-using AI agents
- teams reviewing tool definitions before release
- coding agents such as Codex or Claude Code that edit tools, tasks, scoring, reports, importers, or examples
- people who want a local eval lab before adding real model or provider integrations

Core workflow:

```text
tools + tasks -> eval run -> score/report -> suggestions
```

## Current Status

ToolSmith is at v1.0.6. It is stable locally, available on GitHub, documented through GitHub Pages, and published to npm as `@landon-personal/toolsmith`. The v1.0.6 patch fixes first-user init scaffolding in this repository; this change does not publish the patch to npm.

ToolSmith currently uses a deterministic keyword mock agent. It does not call models, send email, edit calendars, connect to databases, deploy, publish, execute imported APIs, use API keys, or print environment variables.

## Quickstart

Install from npm:

```sh
npm install -g @landon-personal/toolsmith
toolsmith --help
```

Or run without a global install:

```sh
npx @landon-personal/toolsmith@latest --help
```

Create a starter project:

```sh
mkdir demo-agent-tools
cd demo-agent-tools
toolsmith init
toolsmith lint .
toolsmith eval .
toolsmith report
```

`toolsmith init` creates `toolsmith.config.json`, `tools.json`, and `tasks.json` with a mock calendar/email example. The files are local fixtures only; ToolSmith does not send email, edit calendars, call models, or execute real tools.

Local development:

```sh
git clone https://github.com/landon-personal/toolsmith.git
cd toolsmith
npm install
npm run compile
npm test
npm run dev -- --help
npm run dev -- lint examples/calendar-email
npm run dev -- eval examples/calendar-email
npm run dev -- report
npm run package:check
```

## Command Overview

```sh
npm run dev -- --help
npm run dev -- --version
npm run dev -- init
npm run dev -- lint examples/calendar-email
npm run dev -- eval examples/calendar-email
npm run dev -- report
npm run dev -- compare .toolsmith/runs/latest.json .toolsmith/runs/latest.json
npm run dev -- import openapi examples/openapi/tiny-api.json --out examples/openapi/tools.generated.json
```

Stable CLI commands:

- `toolsmith --help`
- `toolsmith --version`
- `toolsmith init`
- `toolsmith lint <path>`
- `toolsmith eval <path>`
- `toolsmith report`
- `toolsmith compare <baseline-run> <current-run>`
- `toolsmith import openapi <path> --out <path>`

## Examples

Starter calendar/email eval:

```sh
npm run dev -- lint examples/calendar-email
npm run dev -- eval examples/calendar-email
npm run dev -- report
```

Intentionally confusing tools lint demo:

```sh
npm run dev -- lint examples/confusing-tools
```

OpenAPI import demo:

```sh
npm run dev -- import openapi examples/openapi/tiny-api.json --out examples/openapi/tools.generated.json
npm run dev -- lint . --tools examples/openapi/tools.generated.json
```

## Reports

Terminal report:

```sh
npm run dev -- report
```

JSON, Markdown, and HTML reports:

```sh
npm run dev -- report --format json
npm run dev -- report --format markdown
npm run dev -- report --format html
```

Use `--out <path>` to choose an output path:

```sh
npm run dev -- report --format markdown --out report.md
npm run dev -- report --format html --out report.html
```

Generated `report.md` and `report.html` are local artifacts and should not be committed unless a future task explicitly asks for fixtures.

## CI Mode

Fail when score is below a threshold:

```sh
npm run dev -- eval examples/calendar-email --fail-under 80
```

Compare baseline and current runs:

```sh
npm run dev -- compare baseline.json .toolsmith/runs/latest.json
npm run dev -- compare baseline.json .toolsmith/runs/latest.json --fail-on-regression
```

The docs-only GitHub Actions example is in `docs/examples/github-actions.md`. No real workflow is enabled in this repo.

## Importers

OpenAPI import supports a small useful subset of OpenAPI JSON:

```sh
npm run dev -- import openapi examples/openapi/tiny-api.json --out examples/openapi/tools.generated.json
```

Imported tools should be reviewed and linted. ToolSmith does not execute imported API endpoints.

## Coding Agent Usage

Use ToolSmith after coding agents edit tools, tasks, schemas, scoring, reports, importers, examples, or mock/provider behavior.

- Codex should follow `AGENTS.md`.
- Claude Code can use `CLAUDE.md` and import shared rules with `@AGENTS.md`.
- See `docs/AI_AGENT_USAGE.md`.

## Local Package Smoke Check

```sh
npm run package:check
```

This compiles ToolSmith, creates a local npm tarball, installs it into a temporary directory, runs `toolsmith --help`, runs `toolsmith --version`, and cleans up on success. It does not publish to npm.

## Public Release Status

ToolSmith is stable locally at v1.0.x. The GitHub repository, GitHub Pages documentation, and npm package are public.

- npm package: `@landon-personal/toolsmith`
- The GitHub repository is public at `https://github.com/landon-personal/toolsmith`.
- Release tags have not been created.
- GitHub Pages documentation is live at `https://landon-personal.github.io/toolsmith/`.
- The CLI binary command remains `toolsmith`.

Install commands:

```sh
npm install -g @landon-personal/toolsmith
npx @landon-personal/toolsmith@latest --help
toolsmith --help
```

The unscoped `toolsmith` package name is already taken on npm. ToolSmith uses the scoped package name `@landon-personal/toolsmith`.

Before any future npm publishing, review `docs/NPM_PUBLISHING.md`, run `npm run release:audit`, confirm npm auth, run pack/publish dry-runs, and explicitly approve publishing steps.

## npm Install

ToolSmith is published to npm as `@landon-personal/toolsmith`:

```sh
npm install -g @landon-personal/toolsmith
npx @landon-personal/toolsmith@latest --help
toolsmith --help
```

Future npm publishing requires explicit approval.

## Documentation

- `docs/SCHEMA.md` documents the v1.0.0 local file shapes.
- `docs/MIGRATIONS.md` summarizes migration notes.
- `docs/RELEASE_NOTES_v1.0.0.md` contains v1.0.0 release notes.
- `docs/PUBLIC_REPOSITORY_PREP.md` tracks public repository and npm publishing readiness TODOs.
- `docs/NPM_PUBLISHING.md` documents npm dry-run checks and scoped package prep.
- `docs/SECURITY.md`, `docs/PRIVACY.md`, and `docs/CONTRIBUTING.md` cover public repo review basics.
- `docs/TROUBLESHOOTING.md` covers common setup and command issues.
- `docs/RELEASE_CHECKLIST.md` covers future public release checks.
- `docs/CROSS_PLATFORM.md` documents macOS and Windows expectations.
- `docs/site/` contains public-facing Markdown docs prepared for future GitHub Pages hosting.
- `docs/index.md` is the GitHub Pages landing page.

No GitHub Actions release/deploy workflow is created.

## Safety Model

ToolSmith is local-first and mock-agent-based by default.

It does not:

- call real models or external APIs
- send real email
- create real calendar events
- charge money
- delete data
- modify databases
- deploy code
- publish packages
- execute imported OpenAPI endpoints
- print secrets or environment variables

Real model/API integration and real side-effect tool execution are future, explicit-scope work only.
