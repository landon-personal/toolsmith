# OpenAPI Import Example

`tiny-api.json` is a small OpenAPI JSON fixture for testing ToolSmith imports.

`tools.generated.json` is committed as intentional example output from the import command. Regenerate it when importer behavior changes.

Generate ToolSmith tool definitions locally:

```sh
npm run dev -- import openapi examples/openapi/tiny-api.json --out examples/openapi/tools.generated.json
```

The generated file is an example tool definition file only. ToolSmith does not call the API, execute endpoints, send network requests, or perform real side effects.

Lint the generated tools:

```sh
npm run dev -- lint . --tools examples/openapi/tools.generated.json
```
