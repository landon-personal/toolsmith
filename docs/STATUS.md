# Status

Date: 2026-06-03

Version: 0.7.0

## Done

- Initialized the npm project.
- Added a TypeScript CLI entry point.
- Added working `init`, `eval`, and `report` commands.
- Added local tools/tasks validation.
- Added a keyword mock agent.
- Added local eval result writing to `.toolsmith/runs/latest.json`.
- Added report rendering from the latest local run.
- Added mocked calendar/email starter fixtures.
- Added static tool linting for names, descriptions, parameters, overlap, risky wording, and missing examples.
- Added the `examples/confusing-tools` lint demo fixture.
- Added docs-only public distribution planning for a future public GitHub repo, GitHub Pages docs, npm CLI install path, and macOS/Windows support.
- Added package-ready CLI metadata for a future npm installable command.
- Added local package smoke checking with `npm run package:check`.
- Verified the compiled CLI can be packed, installed from a local tarball, and run as `toolsmith`.
- Added better eval scoring with failure categories, reasons, recommendations, and failure breakdown counts.
- Aligned eval score breakdown fields and failure category names with the v0.4.0 roadmap.
- Added locally generated JSON, Markdown, and static HTML reports from saved eval runs.
- Added docs-only coding-agent usage guidance for Codex, Claude Code, AGENTS.md, CLAUDE.md, and example Claude command workflows.
- Added CI-friendly `eval --fail-under <score>` threshold checks.
- Added `compare <baseline-run> <current-run>` regression comparison for saved eval run JSON files.
- Added docs-only GitHub Actions examples for future users.
- Added basic OpenAPI JSON import for generating ToolSmith tool definitions.
- Added `examples/openapi/tiny-api.json` as a local import fixture.
- Added Vitest tests.
- Added project docs and safety notes.

## Not Started

- JSON schema files.
- Model or API integration.
- Public GitHub release.
- GitHub Pages publishing or deployment.
- npm publishing.
- GitHub Actions or release automation.
- GitHub Actions workflow files in this repo.
- MCP-style import.

## Safety Status

The project currently has no real email, calendar, database, network, model, or API integration. The v0.7.0 update adds local OpenAPI JSON import only; imported API operations are not executed. No npm publishing happened, no GitHub push happened, and no GitHub Actions workflow automation was added.
