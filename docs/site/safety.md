# Safety

ToolSmith is local-first.

Current safety properties:

- mock provider by default
- no real model/API calls
- no real side-effect tool execution
- no real email sending
- no real calendar editing
- no database modification
- no deploy or publish behavior
- no API keys or secrets printed
- no imported API execution

OpenAPI importers generate tool definitions only. They do not execute endpoints or make network requests.

Do not publish to npm, create release tags, add GitHub Actions deployment, or add real side-effect behavior unless explicitly approved.

v1.0.4 scoped npm package preparation does not change this safety model.
