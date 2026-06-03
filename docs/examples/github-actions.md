# GitHub Actions Example

This is a documentation example only. ToolSmith v0.6.0 does not create `.github/workflows` files, enable GitHub Actions, push to GitHub, publish to npm, or add release automation.

Use this pattern when a future project wants CI to fail if ToolSmith eval quality drops below an accepted threshold.

## Local Checkout Example

```yaml
name: ToolSmith

on:
  pull_request:
  push:

jobs:
  toolsmith:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run compile
      - run: npm test
      - run: npm run dev -- eval examples/calendar-email --fail-under 80
      - run: npm run dev -- report
```

## Future Package-Installed Example

ToolSmith is not published yet. After publishing is explicitly approved, future projects may use a package-installed command like:

```yaml
- run: npx toolsmith@latest eval . --fail-under 90
- run: npx toolsmith@latest report
```

## Regression Comparison Example

When a project stores a baseline run JSON fixture, CI can compare it with the current run:

```yaml
- run: npm run dev -- eval examples/calendar-email
- run: npm run dev -- compare baselines/toolsmith/latest.json .toolsmith/runs/latest.json --fail-on-regression
```

Do not commit generated `.toolsmith/runs` files unless a project intentionally stores a stable baseline outside the generated runs directory.
