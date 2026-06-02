# Changelog

## 0.2.0

- Added the `lint` CLI command for static local analysis of tool definitions.
- Added linter issue types and rules for vague names, weak descriptions, unclear parameters, overlapping tools, risky side-effect wording, and missing examples.
- Added optional `examples` and `requiresConfirmation` fields for tool definitions without breaking existing v0.1.0 fixtures.
- Added `examples/confusing-tools` as an intentionally problematic lint demo.
- Kept ToolSmith local-only with no real model/API calls and no real tool side effects.

## 0.1.0

- Added the local TypeScript CLI with `init`, `eval`, and `report`.
- Added local validation, keyword mock evaluation, saved latest results, and the calendar/email starter example.
