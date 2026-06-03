# Public Repository Prep

ToolSmith v1.0.1 is a release-prep patch for a future public GitHub repository and future npm publishing review.

This checklist does not publish to npm, tag, deploy, enable automation, or make the repository public. Public release steps remain approval-gated.

Private setup repository:

```text
https://github.com/landon-personal/toolsmith
```

## Repository Name

- Private repository name: `toolsmith`.
- TODO: Confirm the final public repository name before changing visibility.
- TODO: Confirm whether the npm package name should remain `toolsmith` after checking availability.
- `origin` is configured for the private GitHub repository after explicit approval.

## Repository Description

Current package description:

```text
Local-first CLI for testing whether AI agents use tool definitions correctly.
```

Private repository description:

```text
Test, lint, and report on AI agent tool use before shipping.
```

TODO: Confirm the public GitHub repository description before making the repository public.

## README Readiness

- README explains what ToolSmith is, who it is for, the local-first status, quickstart commands, stable commands, reports, CI mode, importers, coding-agent usage, safety, and package checks.
- README still uses `<repo-url>` as a placeholder until public visibility is explicitly approved.
- README must not claim npm or GitHub publication before those steps are explicitly approved.

## Docs Readiness

- `docs/site/` contains plain Markdown pages for future GitHub Pages hosting.
- `docs/SCHEMA.md`, `docs/MIGRATIONS.md`, `docs/SAFETY.md`, `docs/TROUBLESHOOTING.md`, `docs/CROSS_PLATFORM.md`, and `docs/RELEASE_CHECKLIST.md` are present.
- `docs/SECURITY.md`, `docs/PRIVACY.md`, and `docs/CONTRIBUTING.md` are added for public repository review.
- TODO: Decide whether to add a code of conduct before public release.

## Examples Readiness

- `examples/calendar-email/` documents the starter lint/eval/report workflow.
- `examples/confusing-tools/` documents intentionally confusing tools for linter demos.
- `examples/openapi/` documents local OpenAPI import and generated tool definitions.
- Examples are definitions and local fixtures only. They do not send emails, edit calendars, call APIs, delete data, or perform real side effects.

## Package Metadata Readiness

Reviewed fields:

- `name`: `toolsmith`
- `version`: `1.0.1`
- `description`: present
- `bin`: maps `toolsmith` to `./dist/cli.js`
- `files`: allows `dist`, README, changelog, docs, and examples
- `scripts`: includes compile, test, package smoke check, and release audit
- `keywords`: present
- `license`: currently `MIT` in `package.json`
- `engines`: Node `>=20`

Release blockers and TODOs:

- TODO: Check npm package name availability before publishing.
- TODO: Confirm the license decision and add a root `LICENSE` file if approved. The package metadata currently says `MIT`, but there is no root license file.
- TODO: Add `repository`, `bugs`, and `homepage` package fields only after public-facing metadata is explicitly approved. The current private repository URL is `https://github.com/landon-personal/toolsmith`.
- TODO: Run a final package dry run before any npm publish.

## License Decision

The current `package.json` declares `MIT`. This should be confirmed before public release, and a matching root `LICENSE` file should be added only after approval.

## Security And Safety Review

- `docs/SECURITY.md` documents the current security-reporting placeholder and secret-handling expectations.
- `docs/SAFETY.md` documents the local mock-provider safety model.
- ToolSmith should not print API keys, secrets, or environment variables.
- ToolSmith does not execute real side-effect tools by default.
- Real model providers are future optional work and are not part of v1.0.1.

## Secret Scan

Before public release:

- Run `npm run release:audit`.
- Review `git status --short`.
- Confirm no `.env` files, secrets, npm tarballs, root generated reports, `.toolsmith/runs/`, `node_modules/`, or unintended `dist/` files are staged.
- Use an external secret scanning tool if required by the release owner.

## Ignored And Generated File Review

`.gitignore` should cover:

- `node_modules/`
- `dist/`
- `coverage/`
- `.env` and `.env.*`
- `.toolsmith/runs/`
- root `report.md` and `report.html`
- npm package tarballs such as `*.tgz`
- local temp package-check folders if they appear in the repo
- `.DS_Store`

Intentional example fixtures should not be ignored accidentally.

## GitHub Pages Readiness

- `docs/site/` is prepared as plain Markdown content.
- No GitHub Pages deployment is enabled.
- No GitHub Actions workflow has been created for Pages.
- TODO: Choose a Pages publishing approach only after explicit approval.

## npm Publishing Readiness

- Local package smoke checks are available through `npm run package:check`.
- npm publishing has not happened.
- TODO: Check package name availability.
- TODO: Confirm package metadata after public-facing repository metadata is approved.
- TODO: Get explicit approval before any `npm publish`.

## Release Tagging Readiness

- No release tags were created for v1.0.1.
- TODO: Define a tagging policy before public release.
- TODO: Get explicit approval before creating public release tags.

## Explicit Approval Required

These actions must be explicitly approved before public release:

- making the private GitHub repository public
- pushing to a public GitHub repository
- creating release tags
- publishing to npm
- enabling GitHub Pages deployment
- creating GitHub Actions release or deployment automation
- adding real model/API integration
- adding real side-effect tool execution

## v1.0.1 Status

- Private GitHub repository setup was approved and pushed to `https://github.com/landon-personal/toolsmith`.
- No release tags were created.
- No npm publish happened.
- No GitHub Pages deployment was enabled.
- No GitHub Actions workflow files were created.
