# Migrations

ToolSmith v1.0.0 is the stable baseline for the public local CLI.

## From v0.1.x

- `tools.json` and `tasks.json` remain compatible when they include the required top-level fields.
- Tool definitions can now include optional `examples` and `requiresConfirmation`.
- Eval runs include richer failure categories, reasons, recommendations, and score breakdown fields.

## From v0.2.x

- Static linting remains warning-oriented for confusing tool definitions.
- Existing tools without `examples` still validate, but lint may warn that examples are missing.

## From v0.4.x

- Failure categories use roadmap-aligned names such as `missing_tool_call`, `hallucinated_tool`, and `should_have_asked_clarifying_question`.
- Saved runs include score breakdown fields for tool selection, arguments, unnecessary tool calls, safety, clarification behavior, and error recovery.

## From v0.5.x

- Terminal report output remains the default.
- JSON, Markdown, and HTML reports are available through `report --format`.

## From v0.6.x

- CI behavior is opt-in through `eval --fail-under` and `compare --fail-on-regression`.
- Normal eval/report behavior is unchanged when CI flags are omitted.

## From v0.7.x

- OpenAPI imports generate ToolSmith tool definitions only.
- Imported API endpoints are not executed.

## From v0.8.x and v0.9.x

- Documentation and public beta readiness changes do not require schema migration.
