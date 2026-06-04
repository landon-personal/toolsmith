# Running Evals

Run the default local mock eval:

```sh
npm run dev -- eval examples/calendar-email
```

The eval command loads `tools.json` and `tasks.json`, validates them, runs the selected tool-choice provider, scores results, categorizes failures, and writes:

```text
.toolsmith/runs/latest.json
```

The mock provider is local, deterministic, and the default. It does not call a real model and requires no API key.

Provider options:

```sh
npm run dev -- eval examples/calendar-email --provider mock
npm run dev -- eval examples/calendar-email --provider openai
```

The OpenAI provider requires `OPENAI_API_KEY` and optionally reads `OPENAI_MODEL`:

```sh
export OPENAI_API_KEY=...
export OPENAI_MODEL=gpt-4.1-mini
npm run dev -- eval examples/calendar-email --provider openai
```

Using `--provider openai` may incur API costs. It records provider/model metadata, selected tool, arguments, and optional model text response. ToolSmith still does not execute selected tools.

Eval summaries include:

- total tasks
- passed count
- failed count
- score percentage
- score breakdown
- failure category counts
- per-task reasons and recommendations
- provider and model metadata when available

Failure categories include names such as `wrong_tool`, `missing_tool_call`, `hallucinated_tool`, `invalid_arguments`, and clarification behavior failures.

CI threshold:

```sh
npm run dev -- eval examples/calendar-email --fail-under 80
```

Compare two saved runs:

```sh
npm run dev -- compare baseline.json .toolsmith/runs/latest.json
npm run dev -- compare baseline.json .toolsmith/runs/latest.json --fail-on-regression
```
