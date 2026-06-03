# Coding Agents

ToolSmith is useful when coding agents edit AI tool definitions, task fixtures, schemas, scoring, reports, importers, examples, or mock/provider behavior.

Codex should use `AGENTS.md`.

Claude Code should use `CLAUDE.md`. Claude Code projects can keep shared rules in `AGENTS.md` and import them from `CLAUDE.md`:

```md
@AGENTS.md
```

Coding agents should run lint/eval/report after tool-related changes:

```sh
npm run dev -- lint examples/calendar-email
npm run dev -- eval examples/calendar-email
npm run dev -- report
```

Agents should summarize:

- score
- failure categories
- regressions
- changed tools and tasks
- imported OpenAPI operations, when import output changed
- recommendations

Future idea: an agent setup command could generate `AGENTS.md`, `CLAUDE.md`, and optional Claude command snippets.
