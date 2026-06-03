# ToolSmith v1.0.0 Release Notes

ToolSmith v1.0.0 is the stable public local CLI baseline for testing and linting AI agent tool use.

Before shipping your AI agent, test whether it knows how to use its tools.

## Summary

ToolSmith helps developers define tool files, define task files, run local evals, score tool selection, inspect failure categories, lint confusing definitions, generate reports, compare runs, and import basic OpenAPI specs into ToolSmith tool definitions.

ToolSmith remains local-first and mock-agent-based in v1.0.0.

## Major Features

- v0.1.0: local TypeScript CLI, validation, mock evals, saved latest run, starter calendar/email example.
- v0.2.0: static tool linter and confusing-tools demo.
- v0.3.0: package-ready CLI metadata and local package smoke check.
- v0.4.0: better scoring, failure categories, reasons, and recommendations.
- v0.4.1: roadmap-aligned failure categories and score breakdowns.
- v0.5.0: JSON, Markdown, and static HTML reports.
- v0.5.1: coding-agent usage docs for Codex and Claude Code.
- v0.6.0: CI mode with `--fail-under` and saved-run comparison.
- v0.7.0: basic OpenAPI JSON import.
- v0.8.0: GitHub Pages-ready documentation content.
- v0.9.0: public beta readiness docs, troubleshooting, release checklist, and example READMEs.
- v1.0.0: stable local-first CLI baseline and schema/release documentation.

## Stable Commands

```sh
toolsmith --help
toolsmith --version
toolsmith init
toolsmith lint <path>
toolsmith eval <path>
toolsmith report
toolsmith compare <baseline-run> <current-run>
toolsmith import openapi <path> --out <path>
```

Local development usage remains:

```sh
npm run dev -- <command>
```

## Safety Model

ToolSmith v1.0.0 does not:

- call real models or external APIs
- execute imported OpenAPI endpoints
- send emails
- create calendar events
- charge money
- delete data
- deploy code
- modify production systems
- print API keys or secrets

Real model providers and real side-effect integrations are future optional work only.

## Known Limitations

- The current eval agent is a deterministic keyword mock agent, not a real model.
- Argument scoring is intentionally simple.
- `tools.json` and `tasks.json` do not yet have separately published JSON Schema files.
- Tags and anti-examples are not first-class schema fields yet.
- OpenAPI import supports only a small useful subset.
- GitHub Pages content exists, but deployment is not enabled.
- ToolSmith is not published to npm yet unless a future explicit approval changes that.

## Publishing Status

v1.0.0 preparation does not publish to npm, push to GitHub, create release tags, or enable GitHub Pages deployment.

Future npm publishing requires explicit approval and package name availability checks.

## Next Planned Version

v1.1.0 is planned as optional real model provider work. It should remain opt-in and must not add real tool side effects by default.
