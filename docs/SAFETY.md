# Safety

ToolSmith v0.2.1 is a local mock evaluator with static tool linting and docs-only public distribution planning. It must not perform real-world actions.

## Current Rules

- Do not send email.
- Do not create, update, or delete calendar events.
- Do not connect to databases.
- Do not make network calls.
- Do not include API keys.
- Do not print environment variables.
- Use mocked fixtures for examples.
- Keep the mock agent deterministic and local.

## Fixture Rules

Example tool definitions may describe email, calendar, or database-shaped behavior, but they must be clearly marked as mocked and side-effect free.

## Future Guardrails

- Validate tool definitions for declared side effects.
- Require explicit dry-run mode by default.
- Store evaluation outputs locally.
- Redact secrets if logs are ever introduced.
- Add tests that fail if unsafe adapters are added by accident.
