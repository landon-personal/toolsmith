# Importers

v0.7.0 added basic OpenAPI JSON import.

Command:

```sh
npm run dev -- import openapi examples/openapi/tiny-api.json --out examples/openapi/tools.generated.json
```

Future package command:

```sh
toolsmith import openapi <path> --out <path>
```

Supported OpenAPI features:

- `openapi`
- `info.title`
- `paths`
- HTTP methods: `get`, `post`, `put`, `patch`, `delete`
- `operationId`
- `summary`
- `description`
- `parameters`
- JSON `requestBody` with `application/json` schema

Imported tools should be reviewed and linted:

```sh
npm run dev -- lint . --tools examples/openapi/tools.generated.json
```

ToolSmith does not execute imported APIs, send network requests, or perform imported endpoint side effects.

MCP-style import is future work.
