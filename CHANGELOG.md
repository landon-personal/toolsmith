# Changelog

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
