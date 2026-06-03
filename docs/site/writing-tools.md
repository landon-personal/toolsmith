# Writing Tools

Tool definitions live in `tools.json`.

The starter fixture is `examples/calendar-email/tools.json`. It defines:

- `create_calendar_event`
- `send_email`

Good tool names should be specific, stable, and agent-friendly. Prefer verb-noun names such as `create_calendar_event`, `send_email`, or `refund_order`.

Descriptions should explain what the tool does and when an agent should choose it. Weak descriptions like `Process data.` or `Manage user.` are hard for agents to use reliably.

Parameters live in `inputSchema.properties`. Use clear parameter names like `user_id`, `email_body`, `starts_at`, or `order_id`. Avoid vague names like `data`, `input`, `payload`, `args`, `value`, and `info`.

Examples are optional today, but the linter warns when they are missing. Add 1-3 short examples when possible.

Risk metadata:

- `sideEffects` can describe mock-only, external, or destructive behavior.
- `requiresConfirmation` can mark tools that should require confirmation before real execution in a future integration.

Anti-examples are not a first-class schema field yet. For now, put non-use guidance in the description.

The lint demo at `examples/confusing-tools/tools.json` intentionally includes vague names, weak descriptions, unclear parameters, overlapping tools, risky wording, and missing examples. Run:

```sh
npm run dev -- lint examples/confusing-tools
```
