# Cross-Platform Notes

ToolSmith targets macOS and Windows for the public local CLI.

Development expectations:

- Use Node `path`, `fs`, `os`, and `child_process` APIs in source and tests.
- Avoid Unix-only shell commands in source and tests.
- Avoid hardcoded path separators.
- Keep npm scripts simple and cross-platform.
- Keep package bin behavior compatible with npm on macOS and Windows.
- Use `npm run package:check` to verify local package install behavior.

Future public CI should run compile, tests, lint, eval, report, import, compare, and package smoke checks on macOS and Windows.

Current package smoke check:

```sh
npm run package:check
```

This command builds the CLI, packs it locally, installs it into an OS temporary directory, runs `toolsmith --help`, runs `toolsmith --version`, and cleans up on success.
