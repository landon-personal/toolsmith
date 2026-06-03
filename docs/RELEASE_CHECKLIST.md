# Release Checklist

Use this checklist before any future public beta, prerelease, or stable release.

For v1.0.0 local release preparation, local verification items should pass before committing. Approval-gated publishing and deployment items remain blocked until explicitly approved.

For v1.0.3 GitHub Pages documentation launch, this checklist also covers repository metadata, security/privacy docs, generated-file cleanup, license checks, Pages docs checks, and approval blockers.

## Local Verification

- Run `npm run compile`.
- Run `npm test`.
- Run `npm run dev -- --help`.
- Run `npm run dev -- --version`.
- Run `npm run dev -- lint examples/calendar-email`.
- Run `npm run dev -- lint examples/confusing-tools`.
- Run `npm run dev -- eval examples/calendar-email`.
- Run `npm run dev -- report`.
- Run `npm run dev -- compare .toolsmith/runs/latest.json .toolsmith/runs/latest.json`.
- Run `npm run dev -- import openapi examples/openapi/tiny-api.json --out examples/openapi/tools.generated.json`.
- Run `npm run package:check`.
- Run `npm run release:audit`.

## Package Review

- Verify `package.json` name, version, description, bin, files allowlist, scripts, keywords, license, and Node engine.
- Verify `docs/SCHEMA.md`, `docs/MIGRATIONS.md`, and release notes are current.
- Verify package files do not include `node_modules`, `dist` unless intentionally packed from build output, `coverage`, `.toolsmith/runs`, `.env`, npm tarballs, temp install folders, or generated reports.
- Verify package name availability before publishing.
- Verify npm publishing has explicit approval.

## Public Repository Prep

- Verify `docs/PUBLIC_REPOSITORY_PREP.md` is current.
- Choose or confirm the final public repository name.
- Confirm the public GitHub repository URL before adding `repository`, `bugs`, or `homepage` package fields.
- Confirm package name availability before npm publishing.
- Confirm the license decision and add a matching root `LICENSE` file if approved.
- Configure a security contact before public release.
- Decide whether to add a code of conduct before public release.
- Run a package dry run before publishing.
- Run macOS and Windows checks when CI is available.
- Explicitly approve GitHub push before pushing.
- Explicitly approve release tags before tagging.
- Explicitly approve npm publish before publishing.
- Explicitly approve GitHub Pages setup or setting changes before changing Pages configuration.

## Repository Review

- Verify no secrets or API keys are present.
- Run `npm run release:audit`.
- Verify `.toolsmith/runs/` is not committed.
- Verify npm tarballs are not committed.
- Verify generated/private files are not staged unless they are intentional fixtures.
- Verify README quickstart still works from a fresh clone.
- Verify `docs/site/` content is current.
- Verify example READMEs are current.
- Verify macOS and Windows compatibility expectations are documented.
- Verify package name availability before publishing.

## Approval Gates

- npm publish requires explicit approval.
- GitHub push requires explicit approval.
- Release tags require explicit approval.
- GitHub Pages setup or setting changes require explicit approval.
- GitHub Actions release automation requires explicit approval.
- Real model/API integration requires explicit approval.
- Real tool side effects require explicit approval.
