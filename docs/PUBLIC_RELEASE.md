# Public Release Plan

ToolSmith is public on GitHub, documented through GitHub Pages, and published to npm as `@landon-personal/toolsmith`. This document describes the distribution model and the guardrails that must stay in place before any future patch publish or release tag.

As of v0.3.0, ToolSmith can be built, packed into a local npm tarball, installed into a temporary directory, and run as the `toolsmith` command for local smoke testing. This is packaging readiness only, not a public release.

As of v0.4.1, eval results include roadmap-aligned failure categories, score breakdown fields, reasons, recommendations, and breakdown counts. This remains local mock-agent behavior and does not add real model/API integration or real tool side effects.

As of v0.5.0, ToolSmith can generate local Markdown and static HTML reports from saved eval runs. These reports are local files only; no GitHub Pages deployment, analytics, external assets, or network calls are added.

As of v0.6.0, ToolSmith includes CI-friendly local eval thresholds and saved-run regression comparison. GitHub Actions documentation is example-only; no workflow automation, GitHub push, npm publishing, model/API integration, or real tool side effects are added.

As of v0.7.0, ToolSmith can import a basic OpenAPI JSON file into ToolSmith tool definitions. Import is local and definition-only; ToolSmith does not execute imported API endpoints, send network requests, build a full MCP server, or add real side effects.

As of v0.8.0, ToolSmith has plain Markdown documentation content under `docs/site/` for future GitHub Pages hosting. This is documentation preparation only; no Pages deployment, GitHub Actions workflow, npm publishing, or GitHub push is enabled.

As of v0.9.0, ToolSmith has public beta readiness documentation, troubleshooting, release checklist, cross-platform notes, and example READMEs. This prepares outside testers to clone and run ToolSmith locally, but it is not a public release and does not publish anything.

As of v1.0.0, ToolSmith's stable local-first CLI preparation is complete. The project is ready for future public release approval steps, but v1.0.0 preparation does not publish to npm, push to GitHub, create release tags, or enable GitHub Pages.

As of v1.0.1, ToolSmith has public repository preparation docs, basic security/privacy/contributing docs, and a local release audit script. A private GitHub repository now exists at `https://github.com/landon-personal/toolsmith`, but public visibility, release tags, npm publishing, GitHub Pages deployment, GitHub Actions workflow, model/API integration, and real tool side effects remain out of scope until explicitly approved.

As of v1.0.2, ToolSmith adds the approved root MIT `LICENSE` file and safe GitHub `repository`/`bugs` package metadata. The existing GitHub repository is prepared for public visibility at `https://github.com/landon-personal/toolsmith`, while npm publishing, release tags, GitHub Pages deployment, GitHub Actions workflow, model/API integration, and real tool side effects remain out of scope until explicitly approved.

As of v1.0.3, ToolSmith enables GitHub Pages documentation from the `main` branch `/docs` folder. Pages is for documentation only; npm publishing, release tags, GitHub Actions workflow automation, model/API integration, and real tool side effects remain out of scope until explicitly approved.

As of v1.0.4, ToolSmith prepares npm publishing under the scoped package `@landon-personal/toolsmith` because the unscoped `toolsmith` package name is already taken on npm. The CLI binary command remains `toolsmith`. This is dry-run preparation only; no real npm publish or release tag is created.

As of v1.0.5, ToolSmith is published to npm as `@landon-personal/toolsmith`.

As of v1.0.6, ToolSmith fixes first-user init scaffolding so `toolsmith init` creates `toolsmith.config.json`, `tools.json`, and `tasks.json` for the fresh `toolsmith lint .`, `toolsmith eval .`, `toolsmith report` flow. This patch is not published to npm in this step, and no release tag is created.

## Distribution Targets

- Public GitHub repository: `https://github.com/landon-personal/toolsmith` for source code, issues, pull requests, releases, release tags, and project history.
- GitHub Pages: documentation site with the quickstart, examples, safety notes, roadmap, and release instructions.
- npm: CLI installation path for users who want to run ToolSmith without cloning the repository.

## Install Commands

```sh
npm install -g @landon-personal/toolsmith
npx @landon-personal/toolsmith@latest --help
toolsmith --help
```

The unscoped `toolsmith` package name is taken. ToolSmith uses the scoped package `@landon-personal/toolsmith`, while the CLI binary command remains `toolsmith`.

## Platform Support

ToolSmith should support macOS and Windows. Source code and tests should use Node path and filesystem APIs instead of hardcoded path separators or Unix-only shell assumptions.

See `docs/CROSS_PLATFORM.md` for detailed expectations.

Use this local package smoke check before any future publishing work:

```sh
npm run package:check
```

The package check builds the CLI, packs it locally, installs the tarball into an OS temporary directory, runs `toolsmith --help`, runs `toolsmith --version`, and cleans up on success.

## Publishing Rules

Patch publishing should not happen until explicitly approved. Do not publish to npm, push release tags, or turn on release automation as part of ordinary development.

Before any npm publish, verify package metadata and complete `docs/RELEASE_CHECKLIST.md`.

Before any npm publish, complete `docs/PUBLIC_REPOSITORY_PREP.md` and `docs/NPM_PUBLISHING.md`. Current blockers include final approval for real publishing and any npm account or 2FA requirements.

GitHub Pages is enabled for documentation only from `main` `/docs`. Do not add Pages workflows, analytics, external scripts, trackers, CDN dependencies, or complex docs build systems without explicit approval.

ToolSmith must keep no real tool side effects by default. Public distribution should not add real email, calendar, database, deploy, publish, model, API, or network behavior unless explicitly approved in a future scope.
