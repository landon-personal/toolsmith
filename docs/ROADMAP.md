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

## Later

- Add stricter JSON schema files for tools and tasks.
- Add richer failure messages for missing tools, wrong arguments, and unsafe actions.
- Consider model/provider integration only after the local runner, schemas, and safety model are stable.
- Keep all real-world side effects behind explicit mock adapters unless a future design proves otherwise.
