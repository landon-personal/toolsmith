# Privacy

ToolSmith v1.1.0 is local-first by default.

## Current Behavior

- ToolSmith runs locally in the project checkout.
- The deterministic mock provider is the default.
- The optional OpenAI provider is used only when `--provider openai` is passed.
- `OPENAI_API_KEY` is required only for `--provider openai`.
- `OPENAI_MODEL` is optional.
- There is no telemetry.
- There is no analytics.
- There is no cloud account requirement.
- Normal lint, eval, report, compare, and validation commands do not make network calls.
- OpenAPI import reads a local JSON file and writes local ToolSmith tool definitions.
- Imported APIs are not executed.
- Generated reports are local files.

## Optional OpenAI Provider

When `--provider openai` is used, ToolSmith sends task prompts and tool definitions to OpenAI for tool-selection behavior. Do not use private, student, production, or sensitive data in manual provider tests.

ToolSmith must not log API keys or print environment variables. Saved runs can include provider name, model name, selected tool, arguments, and optional model text response. Selected tools are simulated and never executed.
