# Public Release Plan

ToolSmith is not published yet. This document describes the intended public distribution model and the guardrails that must stay in place before any release.

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

## Publishing Rules

Publishing should not happen until explicitly approved. Do not publish to npm, push release tags, or turn on public release automation as part of ordinary development.

ToolSmith must keep no real tool side effects by default. Public distribution should not add real email, calendar, database, deploy, publish, model, API, or network behavior unless explicitly approved in a future scope.
