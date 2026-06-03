# Schema

This document describes the ToolSmith v1.0.0 local file shapes at a high level.

ToolSmith validates JSON files locally. It does not require external schema downloads and does not call remote services during validation.

## `tools.json`

Top-level shape:

```json
{
  "name": "calendar-email",
  "version": "1.0.0",
  "description": "Optional description.",
  "safety": {
    "network": false,
    "realSideEffects": false
  },
  "tools": []
}
```

Required fields:

- `name`: non-empty string
- `version`: non-empty string
- `tools`: non-empty array

Optional fields:

- `description`: string
- `safety.network`: boolean
- `safety.realSideEffects`: boolean

Each tool:

```json
{
  "name": "send_email",
  "description": "Send a mocked email without contacting an email service.",
  "sideEffects": "mock-only",
  "requiresConfirmation": true,
  "examples": ["Email Jordan a short status update."],
  "inputSchema": {
    "type": "object",
    "properties": {
      "to": { "type": "string" },
      "subject": { "type": "string" },
      "body": { "type": "string" }
    },
    "required": ["to", "subject", "body"]
  },
  "outputSchema": {
    "type": "object"
  }
}
```

Required tool fields:

- `name`: non-empty string, unique within the file

Optional tool fields:

- `description`: string
- `sideEffects`: string
- `requiresConfirmation`: boolean
- `examples`: array of strings
- `inputSchema`: JSON object
- `outputSchema`: JSON object

Risk metadata:

- `sideEffects` is free text in v1.0.0. Use values such as `mock-only`, `external side effect if connected to a real API`, or `destructive external side effect if connected to a real API`.
- `requiresConfirmation` is optional and useful for tools that would need human approval before any future real execution.

Anti-examples are not a first-class v1.0.0 field. Add non-use guidance in the description until a future schema supports a dedicated field.

## `tasks.json`

Top-level shape:

```json
{
  "name": "calendar-email",
  "version": "1.0.0",
  "tasks": []
}
```

Required fields:

- `name`: non-empty string
- `version`: non-empty string
- `tasks`: non-empty array

Each task:

```json
{
  "id": "email-status-update",
  "prompt": "Email Jordan a short status update about the release.",
  "expectedTool": "send_email",
  "successCriteria": ["The mock agent chooses the local email tool."]
}
```

Required task fields:

- `id`: non-empty string, unique within the file
- `prompt`: non-empty string
- `expectedTool`: non-empty string

Optional task fields:

- `successCriteria`: array of strings

Use `expectedTool: "none"` when no tool should be selected.

Clarification behavior is represented through failure categories in v1.0.0. A task with unclear wording may produce categories such as `should_have_asked_clarifying_question`.

## Eval Run Result

Eval runs are saved to:

```text
.toolsmith/runs/latest.json
```

High-level shape:

```json
{
  "id": "run-...",
  "version": "1.0.0",
  "createdAt": "2026-06-03T00:00:00.000Z",
  "examplePath": "examples/calendar-email",
  "toolsPath": "examples/calendar-email/tools.json",
  "tasksPath": "examples/calendar-email/tasks.json",
  "agent": {
    "name": "keyword-mock-agent",
    "version": "1.0.0"
  },
  "summary": {
    "total": 5,
    "passed": 3,
    "failed": 2,
    "score": 60,
    "scoreBreakdown": {},
    "failureCategories": {}
  },
  "results": []
}
```

Each result includes task id, prompt, expected tool, actual tool, pass/fail, failure category, reason, recommendation, and tool call details when available.

## Failure Categories

v1.0.0 reports these failure category names:

- `wrong_tool`
- `missing_tool_call`
- `hallucinated_tool`
- `invalid_arguments`
- `missing_required_argument`
- `unnecessary_tool_call`
- `unsafe_tool_attempt`
- `should_have_asked_clarifying_question`
- `should_not_have_asked_clarifying_question`
- `unknown_error`

Passed tasks use `passed`.

## Stability Notes

ToolSmith v1.0.0 treats these local JSON shapes as the stable baseline for the public local CLI.

Future versions may add optional fields, richer JSON schema files, tags, anti-examples, or deeper argument validation. Future additions should remain backward-compatible where practical.
