# ToolSmith

Before shipping your AI agent, test whether it knows how to use its tools.

ToolSmith is a local-first CLI for testing, linting, scoring, comparing, and reporting on AI agent tool use before real tool behavior reaches users.

Repository: [github.com/landon-personal/toolsmith](https://github.com/landon-personal/toolsmith)

## Quickstart

ToolSmith is published to npm as `@landon-personal/toolsmith`, and the npm `latest` dist-tag points to v1.0.7. The GitHub repository is public, GitHub Pages is live at `https://landon-personal.github.io/toolsmith/`, and the CLI binary command remains `toolsmith`.

Fresh user flow:

```sh
npm install -g @landon-personal/toolsmith
mkdir demo-agent-tools
cd demo-agent-tools
toolsmith init
toolsmith lint .
toolsmith eval .
toolsmith report
```

Local development:

```sh
git clone https://github.com/landon-personal/toolsmith.git
cd toolsmith
npm install
npm run compile
npm test
npm run dev -- --help
npm run dev -- lint examples/calendar-email
npm run dev -- eval examples/calendar-email
npm run dev -- report
```

## Commands

```sh
npm run dev -- --help
npm run dev -- --version
npm run dev -- init
npm run dev -- lint examples/calendar-email
npm run dev -- eval examples/calendar-email
npm run dev -- report
npm run dev -- report --format markdown
npm run dev -- report --format html
npm run dev -- compare .toolsmith/runs/latest.json .toolsmith/runs/latest.json
npm run dev -- import openapi examples/openapi/tiny-api.json --out examples/openapi/tools.generated.json
```

Stable CLI commands:

- `toolsmith --help`
- `toolsmith --version`
- `toolsmith init`
- `toolsmith lint <path>`
- `toolsmith eval <path>`
- `toolsmith report`
- `toolsmith compare <baseline-run> <current-run>`
- `toolsmith import openapi <path> --out <path>`

## Documentation

- [Quickstart](site/quickstart.md)
- [Installation](site/installation.md)
- [Writing tools](site/writing-tools.md)
- [Writing tasks](site/writing-tasks.md)
- [Running evals](site/running-evals.md)
- [Reports](site/reports.md)
- [CI mode](site/ci-mode.md)
- [Importers](site/importers.md)
- [Coding agents](site/coding-agents.md)
- [Safety](site/safety.md)
- [Roadmap](site/roadmap.md)
- [Public release plan](PUBLIC_RELEASE.md)
- [v1.0.0 release notes](RELEASE_NOTES_v1.0.0.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [Schema](SCHEMA.md)

## Safety

ToolSmith uses a deterministic local mock agent by default. v1.1.0 adds an optional OpenAI provider for tool-selection evals only. It does not execute imported APIs, send emails, edit calendars, charge money, delete data, deploy code, publish packages, print secrets, or perform real tool side effects.

## Future Install Goal

Future npm install commands are expected to be:

```sh
npm install -g @landon-personal/toolsmith
npx @landon-personal/toolsmith@latest --help
toolsmith --help
```

These commands should not be used until npm publishing is explicitly approved and completed.
