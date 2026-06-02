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
