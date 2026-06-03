# ToolSmith Agent Instructions

ToolSmith is a local-first developer tool for testing whether AI agents can correctly use tool definitions.

## Project goal

ToolSmith helps developers define tools, define example tasks, run evaluations, and see whether an agent chooses the correct tool.

Core product loop:

tools + tasks -> eval run -> score/report -> suggestions

## Current version

Current checkpoint: v0.4.1 roadmap-aligned scoring and failure categories.

v0.1.0 includes:
- TypeScript Node CLI
- init, eval, and report commands
- local tool/task validation
- keyword-based mock agent
- eval scoring
- latest run saved to .toolsmith/runs/latest.json
- report command for saved results
- no real model/API calls
- no real tool side effects

v0.2.0 adds:
- lint command for static local analysis of tool definitions
- warnings for vague names, weak descriptions, unclear parameters, overlapping tools, risky wording, and missing examples
- examples/confusing-tools/ lint demo
- no real model/API calls
- no real tool side effects

v0.2.1 adds:
- public distribution planning docs only
- public GitHub repository, GitHub Pages docs, npm CLI installation, and macOS/Windows support as long-term targets
- no new runtime features
- no publishing

v0.3.0 adds:
- package metadata for a future npm-installable `toolsmith` CLI
- local package smoke checking with `npm run package:check`
- verification that the compiled CLI can be packed, installed from a local tarball, and run as `toolsmith`
- macOS/Windows compatibility basics for package-check logic
- no npm publishing
- no GitHub push or release automation
- no real model/API calls
- no real tool side effects

v0.4.0 adds:
- readable eval failure categories
- failure breakdown counts in saved results, eval output, and report output
- short reasons and recommendations for each eval result
- deterministic mock-agent handling for clear email, clear calendar, ambiguous, and no-match prompts
- no npm publishing
- no GitHub push or release automation
- no real model/API calls
- no real tool side effects

v0.4.1 adds:
- roadmap-aligned eval failure category names
- score breakdown fields for correct tool selection, valid arguments, unnecessary tool calls, safe behavior, clarification behavior, and error recovery
- deterministic mock-agent scoring placeholders for categories that will deepen later
- no npm publishing
- no GitHub push or release automation
- no real model/API calls
- no real tool side effects

## Important directories

- src/ contains CLI source code.
- src/commands/ contains command implementations.
- src/types.ts contains core TypeScript types.
- src/validation.ts validates tools and tasks.
- src/mockAgent.ts contains the local keyword mock agent.
- src/evaluator.ts runs evaluation logic.
- src/results.ts reads/writes eval results.
- examples/calendar-email/ contains the starter demo.
- docs/ contains planning, safety, roadmap, prompts, and status docs.
- test/ contains Vitest tests.

## Ultimate distribution goal

ToolSmith should eventually be distributed through:
- a public GitHub repository for source code
- a GitHub Pages site for docs and quickstart material
- npm as the CLI installation channel

Expected future install commands:

```sh
npm install -g toolsmith
npx toolsmith@latest --help
```

Do not publish to npm, push public release tags, enable release automation, or push to GitHub unless explicitly asked.

## Commands to run

Before finishing any coding change, run:

npm run compile
npm test

When touching package metadata or CLI packaging behavior, also run:

npm run package:check

Before finishing docs-only changes, run the checks requested by the prompt.

When touching eval/report behavior, also run:

npm run dev -- eval examples/calendar-email
npm run dev -- report

## Safety rules

Never add real side effects without explicit approval.

Do not:
- send real emails
- create real calendar events
- modify real databases
- call external APIs
- publish to npm
- push to GitHub unless explicitly asked
- add real OpenAI/model integration
- print environment variables
- commit API keys or secrets
- remove safety notes from docs

For now, ToolSmith should stay local-first and mock-agent-based unless a prompt explicitly says to add model provider support.

## Versioning rules

Do not start a new version unless explicitly instructed.

Current next planned version:
- Public release readiness, only when explicitly requested.

Do not jump directly to real AI/model integration unless explicitly instructed.
Do not start packaging, GitHub Actions, npm publishing, or release automation unless explicitly instructed.
Packaging readiness is allowed only when explicitly requested, and still must not publish.

## Code style

Use TypeScript with clear types.

Prefer small files with focused responsibilities.

Keep CLI output readable and beginner-friendly.

Error messages should explain:
- what failed
- where it failed
- how to fix it

Avoid clever abstractions until the product loop is proven.

Maintain cross-platform compatibility for macOS and Windows.

Avoid Unix-only shell commands in source code and tests.

Use Node path/fs APIs instead of hardcoded path separators.

## Git rules

Do not push to GitHub unless explicitly instructed.
Do not publish packages unless explicitly instructed.

Before committing:
- run compile
- run tests
- run eval/report if behavior changed
- check git status --short

Do not commit:
- node_modules/
- dist/
- coverage/
- .env
- .env.*
- .toolsmith/runs/
- .DS_Store

## Product positioning

ToolSmith is not an AI OS.

ToolSmith is closer to:
- unit tests for AI tool use
- a linter for AI agent tools
- a local eval lab for tool definitions

Keep the project focused on helping developers answer:

"Can my AI agent actually use these tools correctly?"
