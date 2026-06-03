# Confusing Tools Example

This example intentionally contains bad or confusing tool definitions.

It demonstrates linter warnings for:

- vague tool names
- weak descriptions
- unclear parameter names
- overlapping tools
- risky side-effect wording
- missing examples

Run:

```sh
npm run dev -- lint examples/confusing-tools
```

Expected behavior: lint should print several warnings but exit successfully because these are warning-level issues, not malformed files.

Safety: this fixture is local-only. ToolSmith does not execute these tools or perform real side effects.
