# Running Evals

Run the local mock eval:

```sh
npm run dev -- eval examples/calendar-email
```

The eval command loads `tools.json` and `tasks.json`, validates them, runs a deterministic keyword mock agent, scores results, categorizes failures, and writes:

```text
.toolsmith/runs/latest.json
```

The current mock provider is local and deterministic. It does not call a real model.

Eval summaries include:

- total tasks
- passed count
- failed count
- score percentage
- score breakdown
- failure category counts
- per-task reasons and recommendations

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
