# ToolSmith

Before shipping your AI agent, test whether it knows how to use its tools.

ToolSmith is a local-first CLI for testing AI tool definitions. It helps developers define tools, define example tasks, run evals, and see whether an agent chooses the correct tool.

ToolSmith is for:

- developers building tool-using AI agents
- teams reviewing tool definitions before release
- coding agents such as Codex or Claude Code that edit tools, tasks, scoring, reports, or examples
- people who want a local eval lab before adding real model or provider integrations

Core workflow:

```text
tools + tasks -> eval run -> score/report -> suggestions
```

ToolSmith currently uses a deterministic keyword mock agent. It does not call models, send email, edit calendars, connect to databases, deploy, publish, use API keys, execute imported APIs, or print environment variables.

## Current Status

ToolSmith is at v0.9.0 public beta readiness. It is not published to npm yet.

Current local features:

- `init` creates a local `toolsmith.config.json` file.
- `lint` validates `tools.json` and reports static issues that could confuse agents.
- `eval` validates tools/tasks, runs a mock eval, scores results, categorizes failures, and writes `.toolsmith/runs/latest.json`.
- `report` prints terminal reports and can generate JSON, Markdown, and static HTML.
- `compare` compares saved eval runs for regressions.
- `import openapi` converts basic OpenAPI JSON into ToolSmith tool definitions.
- `package:check` verifies the CLI can be packed, installed locally, and run as `toolsmith`.

## Fresh Clone Quickstart

Use the real repository URL once the repo is public:

```sh
git clone <repo-url>
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

## Run Examples

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

Markdown and HTML reports:

```sh
npm run dev -- report --format markdown
npm run dev -- report --format html
```

Use `--out <path>` to choose an output path:

```sh
npm run dev -- report --format markdown --out report.md
npm run dev -- report --format html --out report.html
```

Generated `report.md` and `report.html` are local artifacts and should not be committed unless a future task explicitly asks for fixtures.

## CI and Regression Checks

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

## Local Package Smoke Check

```sh
npm run package:check
```

This compiles ToolSmith, creates a local npm tarball, installs it into a temporary directory, runs `toolsmith --help`, runs `toolsmith --version`, and cleans up on success. It does not publish to npm.

## Future Install Goal

ToolSmith is not published to npm yet. Future public install commands are expected to be:

```sh
npm install -g toolsmith
npx toolsmith@latest --help
```

The package name must be checked before publishing. npm publishing requires explicit approval.

## Documentation

- `docs/site/` contains public-facing Markdown docs prepared for future GitHub Pages hosting.
- `docs/TROUBLESHOOTING.md` covers common setup and command issues.
- `docs/RELEASE_CHECKLIST.md` covers future public release checks.
- `docs/CROSS_PLATFORM.md` documents macOS and Windows expectations.
- `docs/AI_AGENT_USAGE.md` explains how Codex, Claude Code, and similar coding agents should use ToolSmith.

No GitHub Pages deployment is enabled. No GitHub Actions release/deploy workflow is created.

## Safety Model

ToolSmith is local-first and mock-agent-based by default.

It does not:

- call real models or external APIs
- send real email
- create real calendar events
- modify real databases
- deploy or publish
- execute imported OpenAPI endpoints
- print secrets or environment variables

Real model/API integration and real side-effect tool execution are future, explicit-scope work only.
