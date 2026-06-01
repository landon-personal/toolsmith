# ToolSmith Agent Instructions

ToolSmith is a local-first developer tool for testing whether AI agents can correctly use tool definitions.

## Project goal

ToolSmith helps developers define tools, define example tasks, run evaluations, and see whether an agent chooses the correct tool.

Core product loop:

tools + tasks -> eval run -> score/report -> suggestions

## Current version

Current checkpoint: v0.1.0 local mock eval MVP.

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

## Commands to run

Before finishing any coding change, run:

npm run compile
npm test

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
- add real OpenAI/model integration
- print environment variables
- commit API keys or secrets
- remove safety notes from docs

For now, ToolSmith should stay local-first and mock-agent-based unless a prompt explicitly says to add model provider support.

## Versioning rules

Do not start a new version unless explicitly instructed.

Current next planned version:
- v0.2.0 Tool Linter

v0.2.0 should focus on static analysis of tool definitions:
- vague tool names
- overlapping tools
- missing examples
- risky tool descriptions
- unclear schemas
- missing confirmation requirements

Do not jump directly to real AI/model integration unless explicitly instructed.

## Code style

Use TypeScript with clear types.

Prefer small files with focused responsibilities.

Keep CLI output readable and beginner-friendly.

Error messages should explain:
- what failed
- where it failed
- how to fix it

Avoid clever abstractions until the product loop is proven.

## Git rules

Do not push to GitHub unless explicitly instructed.

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
