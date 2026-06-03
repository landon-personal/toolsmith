# Privacy

ToolSmith v1.0.1 is local-first.

## Current Behavior

- ToolSmith runs locally in the project checkout.
- The deterministic mock provider is the default.
- There is no telemetry.
- There is no analytics.
- There is no cloud account requirement.
- Normal lint, eval, report, compare, and validation commands do not make network calls.
- OpenAPI import reads a local JSON file and writes local ToolSmith tool definitions.
- Imported APIs are not executed.
- Generated reports are local files.

## Future Provider Work

Future optional real provider support may involve model API calls, provider credentials, and different privacy considerations. That work is not part of v1.0.1 and should require explicit scope, documentation, and approval.
