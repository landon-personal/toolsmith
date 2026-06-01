# Project Plan

## Purpose

ToolSmith helps developers test whether AI agents can read tool definitions, choose the right tool, pass the right arguments, and avoid unsafe side effects.

## v0.1.0 Scope

- TypeScript Node CLI.
- Commands for `init`, `eval`, and `report`.
- Local mocked example data.
- Schema and type definitions for tools, tasks, runs, results, tool calls, and failure reasons.
- Friendly validation for malformed or missing local JSON files.
- Keyword mock agent for local-only evaluation.
- Vitest test coverage for loading, validation, evaluation, and reporting.
- Safety documentation.

## Design Principles

- Local-first: fixtures and results should live on disk.
- Explicit safety: examples must not perform real email, calendar, database, or network actions.
- Small contracts: tool definitions and tasks should be simple JSON files before any runner is added.
- Testable handlers: command behavior should be callable directly from tests.

## Initial Architecture

- `src/cli.ts` is the executable entry point.
- `src/index.ts` builds the CLI.
- `src/commands/` contains command handlers.
- `src/validation.ts` loads and validates local fixtures.
- `src/mockAgent.ts` contains the keyword mock agent.
- `src/evaluator.ts` produces local run results.
- `examples/` contains safe starter fixtures.
- `docs/` records project direction and constraints.

## Out of Scope

- Model provider calls.
- API key handling.
- Real tool adapters.
- Networked services.
