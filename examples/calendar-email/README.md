# Calendar Email Example

This is the starter ToolSmith example.

It demonstrates:

- two mock tools: `create_calendar_event` and `send_email`
- clear tasks
- ambiguous tasks
- a no-tool task
- categorized eval failures
- local reports

Run lint:

```sh
npm run dev -- lint examples/calendar-email
```

Run eval:

```sh
npm run dev -- eval examples/calendar-email
```

Print the latest report:

```sh
npm run dev -- report
```

Expected behavior: the eval currently includes intentionally tricky tasks, so the score is not 100%. This is useful for showing failure categories and recommendations.

Safety: these tools are mock definitions only. ToolSmith does not create real calendar events or send real email.
