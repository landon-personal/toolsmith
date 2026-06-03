# Contributing

ToolSmith is a local-first CLI for testing and linting AI agent tool use.

## Local Setup

```sh
npm install
npm run compile
npm test
```

## Useful Checks

```sh
npm run dev -- lint examples/calendar-email
npm run dev -- eval examples/calendar-email
npm run dev -- report
npm run package:check
npm run release:audit
```

## Guardrails

- Do not commit `node_modules/`, `dist/`, `coverage/`, `.toolsmith/runs/`, `.env` files, npm tarballs, root generated reports, or secrets.
- Do not add real tool side effects without explicit approval.
- Do not publish to npm, push release tags, enable GitHub Pages, or add release automation without explicit approval.
- Keep macOS and Windows compatibility in mind. Prefer Node `path`, `fs`, `os`, and `child_process` APIs over shell-specific assumptions.
- Coding agents should follow `AGENTS.md`.

## Safety

ToolSmith should remain mock-agent-based and local-first by default. Example tools can describe risky operations, but ToolSmith must not execute real emails, calendar edits, database changes, deployments, payments, deletes, API calls, or other side effects unless a future approved scope explicitly changes that.
