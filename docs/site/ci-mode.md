# CI Mode

ToolSmith can fail builds when eval scores fall below a threshold:

```sh
npm run dev -- eval examples/calendar-email --fail-under 80
```

If the score is below the threshold, the command exits non-zero and prints:

```text
Fail-under threshold: 80%
CI result: failed
```

Compare a baseline run with a current run:

```sh
npm run dev -- compare baseline.json .toolsmith/runs/latest.json
```

Fail on score regression:

```sh
npm run dev -- compare baseline.json .toolsmith/runs/latest.json --fail-on-regression
```

The docs-only GitHub Actions example lives at:

```text
docs/examples/github-actions.md
```

No GitHub Actions workflow is enabled in this repo. GitHub Pages is used for documentation only and does not run CI checks.

Before using CI checks publicly, review `docs/RELEASE_CHECKLIST.md` and verify macOS/Windows expectations in `docs/CROSS_PLATFORM.md`.
