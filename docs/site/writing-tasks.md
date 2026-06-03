# Writing Tasks

Task definitions live in `tasks.json`.

The starter fixture is `examples/calendar-email/tasks.json`. Each task includes:

- `id`
- `prompt`
- `expectedTool`
- optional `successCriteria`

Use `expectedTool` to name the tool the agent should choose. Use `none` when no tool should be selected.

Good eval sets include:

- clear tool-use tasks
- no-tool tasks
- ambiguous tasks that expose overlap
- unclear tasks that show whether the agent should ask for clarification
- intentionally tricky tasks that protect against regressions

Tags are not a first-class task field yet. Use clear `id` values and `successCriteria` until a future schema adds tagging.

Example:

```json
{
  "id": "email-status-update",
  "prompt": "Email Jordan a short status update about the release.",
  "expectedTool": "send_email"
}
```
