# Public Repository Prep

ToolSmith v1.0.3 is a release-prep patch that enables GitHub Pages documentation from the public repository.

This checklist does not publish to npm, tag, enable GitHub Actions automation, or publish packages. npm release steps remain approval-gated.

GitHub repository:

```text
https://github.com/landon-personal/toolsmith
```

## Repository Name

- Repository name: `toolsmith`.
- TODO: Confirm whether the npm package name should remain `toolsmith` after checking availability.
- `origin` is configured for `https://github.com/landon-personal/toolsmith.git`.

## Repository Description

Current package description:

```text
Local-first CLI for testing whether AI agents use tool definitions correctly.
```

Repository description:

```text
Test, lint, and report on AI agent tool use before shipping.
```

The repository description is configured on GitHub.

## README Readiness

- README explains what ToolSmith is, who it is for, the local-first status, quickstart commands, stable commands, reports, CI mode, importers, coding-agent usage, safety, and package checks.
- README uses the GitHub repository clone URL.
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
- `version`: `1.0.3`
- `description`: present
- `bin`: maps `toolsmith` to `./dist/cli.js`
- `files`: allows `dist`, README, changelog, docs, and examples
- `scripts`: includes compile, test, package smoke check, and release audit
- `keywords`: present
- `license`: currently `MIT` in `package.json`
- `repository`: `git+https://github.com/landon-personal/toolsmith.git`
- `bugs`: `https://github.com/landon-personal/toolsmith/issues`
- `engines`: Node `>=20`

Release blockers and TODOs:

- TODO: Check npm package name availability before publishing.
- Root `LICENSE` file: added with approved MIT text.
- `repository` and `bugs` package fields: added.
- Homepage field: intentionally not added until the Pages URL is verified and approved for package metadata.
- TODO: Run a final package dry run before any npm publish.

## License Decision

The current `package.json` declares `MIT`, and v1.0.2 adds the matching root `LICENSE` file with no private contact information.

## Security And Safety Review

- `docs/SECURITY.md` documents the current security-reporting placeholder and secret-handling expectations.
- `docs/SAFETY.md` documents the local mock-provider safety model.
- ToolSmith should not print API keys, secrets, or environment variables.
- ToolSmith does not execute real side-effect tools by default.
- Real model providers are future optional work and are not part of v1.0.3.

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

- `docs/index.md` is the Pages landing page.
- `docs/site/` contains plain Markdown content.
- `docs/_config.yml` keeps the Pages configuration minimal.
- GitHub Pages uses branch publishing from `main` `/docs`.
- No GitHub Actions workflow has been created for Pages.
- No analytics, external scripts, trackers, CDN dependencies, or complex docs framework has been added.

## npm Publishing Readiness

- Local package smoke checks are available through `npm run package:check`.
- npm publishing has not happened.
- TODO: Check package name availability.
- Package metadata now includes safe repository and bugs fields.
- TODO: Get explicit approval before any `npm publish`.

## Release Tagging Readiness

- No release tags were created for v1.0.3.
- TODO: Define a tagging policy before public release.
- TODO: Get explicit approval before creating public release tags.

## Explicit Approval Required

These actions must be explicitly approved before public release:

- creating release tags
- publishing to npm
- adding GitHub Pages workflow automation
- creating GitHub Actions release or deployment automation
- adding real model/API integration
- adding real side-effect tool execution

## v1.0.3 Status

- Root MIT `LICENSE` file was added.
- Package `repository` and `bugs` metadata was added.
- Public repository visibility was approved for `https://github.com/landon-personal/toolsmith`.
- GitHub Pages documentation was prepared/enabled from `main` `/docs`.
- No release tags were created.
- No npm publish happened.
- No GitHub Actions workflow files were created.
