# Safety

ToolSmith is local-first.

Current safety properties:

- mock provider by default
- no real model/API calls by default
- optional OpenAI provider only when `--provider openai` is passed
- no real side-effect tool execution
- no real email sending
- no real calendar editing
- no database modification
- no deploy or publish behavior
- no API keys or secrets printed
- no imported API execution
- no selected tool execution

The OpenAI provider tests model tool-choice behavior only. It requires `OPENAI_API_KEY`, may incur API costs, and should not be used with private, student, production, or sensitive data. It records selected tool metadata but never sends email, edits calendars, modifies databases, deploys code, charges money, or executes imported APIs.

OpenAPI importers generate tool definitions only. They do not execute endpoints or make network requests.

Do not publish to npm, create release tags, add GitHub Actions deployment, or add real side-effect behavior unless explicitly approved.

v1.1.0 optional provider support does not change the no-real-tool-execution safety model. No npm publish or release tag was created for v1.1.0 in this step.
