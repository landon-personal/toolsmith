# Safety

ToolSmith v1.0.1 is a local-first CLI for testing and linting AI agent tool use. It must not perform real-world actions.

## Default Behavior

- ToolSmith uses a deterministic local mock agent by default.
- ToolSmith does not call real model providers by default.
- ToolSmith does not call external APIs by default.
- ToolSmith stores eval output locally under `.toolsmith/runs/`.

## No Real Tool Side Effects

ToolSmith v1.0.1 does not:

- send emails
- create, update, or delete calendar events
- charge money
- delete data
- modify databases
- deploy code
- publish packages
- modify production systems
- execute imported OpenAPI endpoints

Example tools may describe email, calendar, refund, delete, or API-shaped behavior, but they are definitions only.

## Secrets

API keys and secrets should never be printed, committed, or included in reports. ToolSmith should not print environment variables.

## OpenAPI Import

OpenAPI import reads a local JSON file and writes local ToolSmith tool definitions. It does not send network requests and does not execute imported endpoints.

## Future Work

Real model providers are future optional work planned after the stable local CLI baseline. They should be opt-in and documented.

Real side-effect integrations are not part of v1.0.1. If future versions ever support them, they should require explicit scope, dry-run defaults, confirmation rules, and tests that protect against accidental real-world actions.
