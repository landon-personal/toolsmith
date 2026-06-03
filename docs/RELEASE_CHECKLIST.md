# Release Checklist

Use this checklist before any future public beta, prerelease, or stable release.

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

## Package Review

- Verify `package.json` name, version, description, bin, files allowlist, scripts, keywords, license, and Node engine.
- Verify package files do not include `node_modules`, `dist` unless intentionally packed from build output, `coverage`, `.toolsmith/runs`, `.env`, npm tarballs, temp install folders, or generated reports.
- Verify package name availability before publishing.
- Verify npm publishing has explicit approval.

## Repository Review

- Verify no secrets or API keys are present.
- Verify `.toolsmith/runs/` is not committed.
- Verify npm tarballs are not committed.
- Verify generated/private files are not staged unless they are intentional fixtures.
- Verify README quickstart still works from a fresh clone.
- Verify `docs/site/` content is current.
- Verify example READMEs are current.
- Verify macOS and Windows compatibility expectations are documented.

## Approval Gates

- npm publish requires explicit approval.
- GitHub push requires explicit approval.
- Release tags require explicit approval.
- GitHub Pages deployment requires explicit approval.
- GitHub Actions release automation requires explicit approval.
- Real model/API integration requires explicit approval.
- Real tool side effects require explicit approval.
