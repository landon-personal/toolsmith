# Status

Date: 2026-06-04

Version: 1.0.6

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
- Added plain Markdown documentation site content under `docs/site/` for future GitHub Pages hosting.
- Added public beta readiness documentation for fresh clones, troubleshooting, release checks, cross-platform expectations, and examples.
- Added v1.0.0 schema documentation, migration notes, and release notes.
- Confirmed the stable local CLI command surface.
- Added v1.0.1 public repository prep documentation.
- Added security, privacy, and contributing docs for future public review.
- Added a local release audit script for generated files and obvious secret-shaped strings.
- Updated release checklist and public release notes for approval-gated public repo/npm prep.
- Added the approved root MIT `LICENSE` file.
- Added safe GitHub `repository` and `bugs` package metadata.
- Prepared/applied public GitHub repository visibility.
- Added `docs/index.md` as a GitHub Pages landing page.
- Added minimal `docs/_config.yml` for branch/folder GitHub Pages publishing.
- Enabled GitHub Pages documentation from the `main` branch `/docs` folder.
- Prepared scoped npm package metadata for `@landon-personal/toolsmith`.
- Documented that the unscoped `toolsmith` package name is taken on npm.
- Added npm publishing dry-run documentation.
- Completed the final npm publish gate with scoped package availability, release audit, package contents, and dry-run publish checks.
- Confirmed GitHub Pages documentation is built and live at `https://landon-personal.github.io/toolsmith/`.
- Published the npm package as `@landon-personal/toolsmith` with CLI binary command `toolsmith`.
- Fixed the v1.0.6 first-user init scaffold so `toolsmith init` creates `toolsmith.config.json`, `tools.json`, and `tasks.json`.
- Added a fresh starter flow: `toolsmith init`, `toolsmith lint .`, `toolsmith eval .`, `toolsmith report`.
- Updated user-facing runtime suggestions to use published `toolsmith` commands.
- Added Vitest tests.
- Added project docs and safety notes.

## Not Started

- JSON schema files.
- Model or API integration.
- Public GitHub release.
- GitHub Actions or release automation.
- GitHub Actions workflow files in this repo.
- MCP-style import.
- npm prerelease publishing.
- release tags.
- v1.0.6 npm patch publishing.
- v1.1.0 optional real model provider.

## Safety Status

The project currently has no real email, calendar, database, network, model, or API integration. The v1.0.6 update fixes first-user scaffolding and runtime guidance only; no GitHub Actions workflow was created, no v1.0.6 npm publish happened, and no release tags were created.
