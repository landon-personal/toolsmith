# Safety

ToolSmith v1.1.0 is a local-first CLI for testing and linting AI agent tool use. It must not perform real-world actions.

## Default Behavior

- ToolSmith uses a deterministic local mock agent by default.
- ToolSmith does not call real model providers by default.
- `--provider openai` is opt-in and tests tool selection only.
- `OPENAI_API_KEY` is required only when `--provider openai` is used.
- ToolSmith does not call external APIs by default.
- ToolSmith stores eval output locally under `.toolsmith/runs/`.

## No Real Tool Side Effects

ToolSmith v1.1.0 does not:

- send emails
- create, update, or delete calendar events
- charge money
- delete data
- modify databases
- deploy code
- publish packages
- modify production systems
- execute imported OpenAPI endpoints
- execute model-selected tools

Example tools may describe email, calendar, refund, delete, or API-shaped behavior, but they are definitions only.

## Secrets

API keys and secrets should never be printed, committed, or included in reports. ToolSmith should not print environment variables. The OpenAI provider reads `OPENAI_API_KEY` from the environment but must never log it.

## OpenAI Provider

The OpenAI provider is optional. It sends task prompts and tool definitions to OpenAI so a model can choose a tool. It records the selected tool name, arguments, optional text response, provider, and model metadata.

Using `--provider openai` may incur API costs. Do not use private, student, production, or sensitive data in manual provider tests.

The provider never executes selected tools.

## OpenAPI Import

OpenAPI import reads a local JSON file and writes local ToolSmith tool definitions. It does not send network requests and does not execute imported endpoints.

## Future Work

Real side-effect integrations are not part of v1.1.0. If future versions ever support them, they should require explicit scope, dry-run defaults, confirmation rules, and tests that protect against accidental real-world actions.
