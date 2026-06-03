# Public Release Plan

ToolSmith is not published yet. This document describes the intended public distribution model and the guardrails that must stay in place before any release.

As of v0.3.0, ToolSmith can be built, packed into a local npm tarball, installed into a temporary directory, and run as the `toolsmith` command for local smoke testing. This is packaging readiness only, not a public release.

As of v0.4.1, eval results include roadmap-aligned failure categories, score breakdown fields, reasons, recommendations, and breakdown counts. This remains local mock-agent behavior and does not add real model/API integration or real tool side effects.

As of v0.5.0, ToolSmith can generate local Markdown and static HTML reports from saved eval runs. These reports are local files only; no GitHub Pages deployment, analytics, external assets, or network calls are added.

As of v0.6.0, ToolSmith includes CI-friendly local eval thresholds and saved-run regression comparison. GitHub Actions documentation is example-only; no workflow automation, GitHub push, npm publishing, model/API integration, or real tool side effects are added.

## Distribution Targets

- Public GitHub repository: source code, issues, pull requests, release tags, and project history.
- GitHub Pages: documentation site with the quickstart, examples, safety notes, roadmap, and release instructions.
- npm: CLI installation path for users who want to run ToolSmith without cloning the repository.

## Planned Install Commands

```sh
npm install -g toolsmith
npx toolsmith@latest --help
```

The `toolsmith` package name may need to be checked before publishing. If the name is unavailable or unsuitable, choose a package name intentionally and update the docs before release.

## Platform Support

ToolSmith should support macOS and Windows. Source code and tests should use Node path and filesystem APIs instead of hardcoded path separators or Unix-only shell assumptions.

Use this local package smoke check before any future publishing work:

```sh
npm run package:check
```

The package check builds the CLI, packs it locally, installs the tarball into an OS temporary directory, runs `toolsmith --help`, runs `toolsmith --version`, and cleans up on success.

## Publishing Rules

Publishing should not happen until explicitly approved. Do not publish to npm, push release tags, or turn on public release automation as part of ordinary development.

ToolSmith must keep no real tool side effects by default. Public distribution should not add real email, calendar, database, deploy, publish, model, API, or network behavior unless explicitly approved in a future scope.
