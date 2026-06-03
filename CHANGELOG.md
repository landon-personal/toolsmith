# Changelog

## 1.0.0

- Finalized ToolSmith as the stable local-first CLI baseline.
- Confirmed stable commands for help, version, init, lint, eval, report, compare, and OpenAPI import.
- Added `docs/SCHEMA.md`.
- Added `docs/MIGRATIONS.md`.
- Added `docs/RELEASE_NOTES_v1.0.0.md`.
- Refreshed README and safety documentation for v1.0.0.
- Kept npm publishing, GitHub push, release tags, GitHub Pages deployment, GitHub Actions workflow automation, real model/API integration, and real tool side effects out of scope.

## 0.9.0

- Polished README for outside testers and fresh clone usage.
- Added `docs/TROUBLESHOOTING.md`.
- Added `docs/RELEASE_CHECKLIST.md`.
- Added `docs/CROSS_PLATFORM.md`.
- Added README files for calendar/email and confusing-tools examples, and expanded OpenAPI example docs.
- Updated docs-site pages for public beta readiness.
- Reviewed package metadata expectations and kept npm publishing, GitHub push, release tags, GitHub Pages deployment, real model/API integration, and real tool side effects out of scope.

## 0.8.0

- Added plain Markdown documentation content under `docs/site/` for future GitHub Pages hosting.
- Added public-facing quickstart, installation, tool/task authoring, eval, report, CI, importer, coding-agent, safety, and roadmap pages.
- Added `docs/SITE.md` and `docs/site/README.md` to clarify that no deployment is enabled.
- Kept this release documentation-only apart from version metadata, with no GitHub Pages deployment, no GitHub Actions workflow, no npm publishing, no GitHub push, no real model/API calls, and no real tool side effects.

## 0.7.0

- Added `import openapi <path> --out <path>` for basic OpenAPI JSON imports.
- Converted supported OpenAPI operations into ToolSmith tool definitions with stable snake_case names.
- Converted path/query/header parameters and JSON request body properties into ToolSmith `inputSchema` properties.
- Added warning-friendly side-effect metadata for non-GET imported operations.
- Added a tiny OpenAPI fixture under `examples/openapi/`.
- Kept import local and definition-only with no imported API execution, no real model/API calls, no real tool side effects, no npm publishing, and no GitHub push.

## 0.6.0

- Added `eval --fail-under <score>` for CI-friendly score thresholds.
- Added `compare <baseline-run> <current-run>` for saved eval run regression checks.
- Added `compare --fail-on-regression` to exit non-zero when the current score is lower than the baseline.
- Added docs-only GitHub Actions examples for future users.
- Kept ToolSmith mock-agent-based with no real model/API calls, no real tool side effects, no npm publishing, and no GitHub push.

## 0.5.1

- Added coding-agent usage docs for ToolSmith.
- Added Codex `AGENTS.md` guidance.
- Added Claude Code `CLAUDE.md` guidance, including importing shared rules with `@AGENTS.md`.
- Added docs-only Claude command examples for lint, eval, report, and fix-plan workflows.
- Kept this release docs-only with no runtime behavior changes.

## 0.5.0

- Added local JSON, Markdown, and static HTML report generation from saved eval runs.
- Added `report --format json|markdown|html` and `--out <path>` support.
- Added tool confusion matrix helpers for shareable reports.
- Kept terminal report output as the default behavior.
- Kept reports local and static with no external assets, analytics, network calls, real model/API calls, real tool side effects, npm publishing, GitHub push, or GitHub Pages deployment.

## 0.4.1

- Aligned eval failure categories with the roadmap names, including `wrong_tool`, `missing_tool_call`, `hallucinated_tool`, `invalid_arguments`, `missing_required_argument`, `unnecessary_tool_call`, `unsafe_tool_attempt`, `should_have_asked_clarifying_question`, and `should_not_have_asked_clarifying_question`.
- Added score breakdown fields for `correct_tool_selection`, `valid_arguments`, `no_unnecessary_tool_calls`, `safe_behavior`, `clarification_behavior`, and `error_recovery`.
- Kept score breakdowns deterministic and mock-agent-based, with deeper argument and behavior scoring left for later versions.
- Kept ToolSmith unpublished with no real model/API calls and no real tool side effects.

## 0.4.0

- Added readable eval failure categories including `passed`, `wrong_tool`, `no_tool_selected`, `unexpected_tool_selected`, `invalid_tool_call`, `missing_expected_tool`, `unclear_task`, and `unknown_error`.
- Added failure breakdown counts to eval summaries and saved results.
- Added short reasons and recommendations to each eval result and report output.
- Improved deterministic mock-agent behavior for clear email, clear calendar, ambiguous, and no-match prompts.
- Kept ToolSmith mock-agent-based with no real model/API calls, no real tool side effects, no npm publishing, and no GitHub push.

## 0.3.0

- Prepared package metadata for a future npm-installable `toolsmith` CLI.
- Added local package smoke checking that builds, packs, installs, and runs the CLI from a temporary directory.
- Added tests for package version, bin metadata, CLI version wiring, and package allowlist basics.
- Documented the package check command and macOS/Windows compatibility expectations.
- Kept ToolSmith unpublished with no GitHub push, no release automation, no real model/API integration, and no real tool side effects.

## 0.2.1

- Documented the public distribution plan.
- Documented the GitHub Pages documentation and npm release target.
- Documented the macOS and Windows support goal.
- Kept the update docs-only with no publishing and no new runtime behavior.

## 0.2.0

- Added the `lint` CLI command for static local analysis of tool definitions.
- Added linter issue types and rules for vague names, weak descriptions, unclear parameters, overlapping tools, risky side-effect wording, and missing examples.
- Added optional `examples` and `requiresConfirmation` fields for tool definitions without breaking existing v0.1.0 fixtures.
- Added `examples/confusing-tools` as an intentionally problematic lint demo.
- Kept ToolSmith local-only with no real model/API calls and no real tool side effects.

## 0.1.0

- Added the local TypeScript CLI with `init`, `eval`, and `report`.
- Added local validation, keyword mock evaluation, saved latest results, and the calendar/email starter example.
