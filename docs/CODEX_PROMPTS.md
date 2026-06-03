# Codex Prompts

Use these prompts for future ToolSmith development sessions.

## Continue the Local Runner

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Extend the local-only ToolSmith runner that loads tools.json and tasks.json, validates them, and reports pass/fail results without calling models, APIs, databases, email, calendar, or network services.
```

## Add Schema Validation

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Add JSON schema validation for ToolSmith tool and task files. Keep all validation local. Do not add model/API integration, API keys, network calls, or environment variable printing.
```

## Improve Reports

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Improve the report command so it reads local ToolSmith result files and prints a concise text summary. Do not add real tool adapters or external service calls.
```

## Improve Tool Linting

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Improve the v0.2.0 static tool linter for tools.json files. Keep analysis local and deterministic. Do not add real model/API integration, API keys, network calls, or real email, calendar, database, deploy, publish, or other tool side effects.
```

## Improve Package Readiness

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Improve ToolSmith npm CLI packaging readiness without publishing. Preserve macOS and Windows compatibility, use Node path/fs/os/child_process APIs for package checks, keep `npm run dev --` as the local development command, and do not add GitHub Actions, GitHub Pages publishing, npm publishing, real model/API integration, or real tool side effects.
```

## Improve Eval Scoring

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Improve ToolSmith local mock eval scoring with clearer failure categories, saved result summaries, terminal report output, reasons, and recommendations. Keep the agent deterministic and local. Do not add real model/API integration, external API calls, publishing, dashboards, cloud features, or real tool side effects.
```

## Align Scoring Roadmap

```text
Work only in ~/toolsmith. Do not modify ~/devtrail.

Align ToolSmith local mock eval scoring with the roadmap category names and score breakdown fields. Keep all scoring deterministic and local. Do not start a new version line, add Markdown/HTML reports, publish to npm, push to GitHub, add real model/API integration, or add real tool side effects.
```
