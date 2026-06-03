# AI Agent Usage

ToolSmith helps coding agents verify AI tool definitions before changes reach users. It is useful when Codex, Claude Code, or a similar coding agent edits tool definitions, task fixtures, schemas, scoring, reports, examples, or mock/provider behavior.

ToolSmith should not be treated as optional when tool behavior changes. After agent-tool changes, the coding agent should run lint, eval, and report commands, then summarize what changed and whether the tool set became easier or harder for an AI agent to use correctly.

## Codex

Codex should follow the project `AGENTS.md` instructions. Use `AGENTS.md` to keep ToolSmith expectations close to the codebase, including which commands to run and which generated/private files must not be committed.

After changing tools, tasks, schemas, eval behavior, scoring, reports, examples, or agent behavior, Codex should run ToolSmith and summarize:

- score and score change if there is a previous baseline
- CI threshold result when `eval --fail-under` is used
- failure categories and counts
- regressions or newly fixed failures
- changed tools and tasks
- recommendations for clearer tool names, descriptions, parameters, examples, or task wording
- generated report paths, if Markdown or HTML reports were requested

## Claude Code

Claude Code should use `CLAUDE.md`. When a project already has shared coding-agent rules in `AGENTS.md`, `CLAUDE.md` can import them with:

```md
@AGENTS.md
```

This lets teams keep shared ToolSmith rules in `AGENTS.md` while adding Claude-specific notes in `CLAUDE.md`.

Claude Code should run ToolSmith after changing agent-tool behavior and should report score, failure categories, regressions, changed tools/tasks, and recommendations in its final summary.

## Sample AGENTS.md Section

Copy this section into a project `AGENTS.md` when ToolSmith is used to protect AI tool behavior:

````md
## ToolSmith Checks

This project uses ToolSmith to verify AI tool definitions and example tasks.

Coding agents must run ToolSmith after changing:
- tools.json
- tasks.json
- tool schemas
- eval logic
- scoring logic
- report generation
- provider behavior
- examples

Prefer project scripts when available:

```sh
npm run toolsmith:lint
npm run toolsmith:eval
npm run toolsmith:report
```

If project scripts are not available, use the published CLI when the project allows it:

```sh
npx toolsmith@latest lint .
npx toolsmith@latest eval .
npx toolsmith@latest report
```

In the final summary, include:
- overall score
- failure categories and counts
- changed tools and tasks
- regressions or fixed failures
- recommendations for improving confusing tools or tasks

Do not treat ToolSmith as optional when tool behavior changed.
````

## Sample CLAUDE.md Section

Copy this section into a project `CLAUDE.md` when Claude Code should share the same ToolSmith rules as Codex:

````md
@AGENTS.md

## Claude Code ToolSmith Notes

When editing AI tools, tasks, schemas, eval behavior, scoring, reports, provider behavior, or examples, run the ToolSmith checks described in AGENTS.md.

Summarize the ToolSmith result with:
- score
- CI threshold result or compare result, when used
- failure categories and counts
- regressions
- changed tools and tasks
- recommendations

If ToolSmith fails because files are invalid or malformed, stop and fix that before continuing feature work.
````

## Claude Command Examples

These are documentation examples only. ToolSmith does not create `.claude/commands` files in this repo yet.

### toolsmith-lint

Purpose: check tool definitions for confusing names, weak descriptions, unclear parameters, overlap, risky wording, and missing examples.

Agent behavior:

```sh
npm run toolsmith:lint
```

Fallback:

```sh
npx toolsmith@latest lint .
```

Summarize the number of issues, severity levels, affected tools, and recommendations.

### toolsmith-eval

Purpose: run local eval tasks against the tool definitions.

Agent behavior:

```sh
npm run toolsmith:eval
```

Fallback:

```sh
npx toolsmith@latest eval .
```

Summarize the score, failure category breakdown, failed tasks, expected tools, actual tools, reasons, and recommendations.

### toolsmith-report

Purpose: read the saved eval run and produce a human-readable report.

Agent behavior:

```sh
npm run toolsmith:report
```

Fallback:

```sh
npx toolsmith@latest report
```

Summarize the overall score, failure categories, regressions, and any generated Markdown or HTML report path.

### toolsmith-fix-plan

Purpose: turn lint and eval failures into a focused fix plan before editing.

Agent behavior:

```sh
npm run toolsmith:lint
npm run toolsmith:eval
npm run toolsmith:report
```

Fallback:

```sh
npx toolsmith@latest lint .
npx toolsmith@latest eval .
npx toolsmith@latest report
```

Summarize a short plan that names the affected tools/tasks, the failure categories, the likely cause, and the smallest safe change to try next.
