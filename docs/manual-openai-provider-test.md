# Manual OpenAI Provider Smoke Test

ToolSmith v1.1.0 adds an optional OpenAI provider for tool-selection evals.

This test may incur API costs. Do not use private, student, production, or sensitive data.

```sh
export OPENAI_API_KEY=...
export OPENAI_MODEL=gpt-4.1-mini
npm run dev -- eval examples/calendar-email --provider openai
npm run dev -- report
```

`OPENAI_MODEL` is optional. If it is unset, ToolSmith uses its built-in default model.

The OpenAI provider asks a model which ToolSmith tool it would call. ToolSmith records the provider, model, selected tool, arguments, and optional model text response.

ToolSmith still simulates all tool behavior. It does not send email, edit calendars, modify databases, deploy code, charge money, execute imported APIs, or execute model-selected tools.

The mock provider remains the default and does not require an API key:

```sh
npm run dev -- eval examples/calendar-email --provider mock
```
