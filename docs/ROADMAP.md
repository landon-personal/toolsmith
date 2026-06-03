# Roadmap

## v0.0.0

- Create the TypeScript CLI skeleton.
- Add `init`, `eval`, and `report` stubs.
- Add mocked calendar/email example fixtures.
- Add Vitest coverage.

## v0.1.0

- Define schemas and TypeScript types for tools and tasks.
- Validate fixture files before running an evaluation.
- Write local result files under `.toolsmith/runs/latest.json`.
- Add report rendering from local result files.
- Add a keyword mock agent with no model/API integration.

## v0.2.0

- Add a static `lint` command for local tool definitions.
- Flag vague tool names, weak descriptions, unclear parameters, overlapping tools, risky side-effect wording, and missing examples.
- Add an intentionally confusing local-only fixture for lint demos.
- Keep ToolSmith free of real model/API calls and real tool side effects.

## v0.2.1

- Document the public distribution plan.
- Clarify the long-term target for a public GitHub repository, GitHub Pages documentation, npm installation, and macOS/Windows support.
- Keep this release docs-only with no new runtime features and no publishing.

## v0.3.0

- Prepare the CLI for npm packaging without publishing it.
- Verify `toolsmith` maps to the compiled `dist/cli.js` package bin.
- Add a cross-platform local package smoke check that packs, installs, and runs the CLI from a temporary directory.
- Preserve macOS and Windows compatibility basics by using Node path, filesystem, OS, and child process APIs in package checks.
- Keep ToolSmith free of real model/API calls, cloud features, and real tool side effects.

## v0.4.0

- Improve local eval scoring with readable failure categories.
- Add failure breakdown counts to saved results, eval output, and reports.
- Add short reasons and practical recommendations for failed tasks.
- Keep the evaluator deterministic and mock-agent-based with no real model/API calls or real tool side effects.
- Preserve package-ready CLI behavior from v0.3.0.

## v0.4.1

- Align score breakdown fields with the roadmap: correct tool selection, valid arguments, unnecessary tool calls, safe behavior, clarification behavior, and error recovery.
- Align failure category names with the roadmap, including wrong tools, missing tool calls, hallucinated tools, invalid arguments, missing required arguments, unnecessary tool calls, unsafe attempts, and clarification behavior failures.
- Keep deeper scoring deterministic and mock-agent-based until later versions add richer argument validation and agent behavior.

## v0.5.0

- Add locally generated Markdown and static HTML reports from saved eval run JSON.
- Keep terminal report output as the default.
- Include score breakdowns, failure breakdowns, task tables, failed task details, recommendations, tool confusion matrices, and raw JSON details.
- Keep reports dependency-light, static, local-only, and free of analytics, network calls, model/API calls, and real tool side effects.

## v0.5.1

- Add docs-only guidance for using ToolSmith with Codex, Claude Code, and similar coding agents.
- Document copy-paste `AGENTS.md` and `CLAUDE.md` snippets for projects that use ToolSmith.
- Document example Claude command workflows without creating `.claude/commands` files.
- Keep this release docs-only with no runtime behavior changes, publishing, GitHub push, model/API integration, or real tool side effects.

## Future Agent Setup

- Consider an agent setup command that generates `AGENTS.md` and `CLAUDE.md` snippets and optional Claude command examples.
- Possible future commands:

```sh
toolsmith init --agent codex
toolsmith init --agent claude
toolsmith init --agent both
toolsmith agents setup --codex --claude
```

- This is future work and is not implemented in v0.5.1.

## v0.6.0

- Add CI-friendly eval threshold checks with `eval --fail-under <score>`.
- Add saved-run regression comparison with `compare <baseline-run> <current-run>`.
- Support `compare --fail-on-regression` for builds that should fail when the current score drops below the baseline.
- Document GitHub Actions examples without creating workflow files or enabling automation in this repo.
- Keep ToolSmith mock-agent-based with no real model/API calls, no real tool side effects, no npm publishing, and no GitHub push.

## Public Release Track

- Package-ready CLI: make the existing TypeScript CLI ready for public installation without changing the local-first safety model.
- Cross-platform CI: verify compile, tests, lint, eval, and report on macOS and Windows before public release.
- GitHub Pages docs: publish quickstart, examples, safety notes, and release documentation from the public repository.
- npm prerelease: publish only after explicit approval, package-name checks, and dry-run verification.
- npm stable release: publish only after prerelease feedback confirms install, docs, and cross-platform behavior are reliable.

## Later

- Add stricter JSON schema files for tools and tasks.
- Add richer failure messages for missing tools, wrong arguments, and unsafe actions.
- Consider model/provider integration only after the local runner, schemas, and safety model are stable.
- Keep all real-world side effects behind explicit mock adapters unless a future design proves otherwise.
