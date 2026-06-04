# ToolSmith

Before shipping your AI agent, test whether it knows how to use its tools.

ToolSmith is a local-first developer tool for testing whether AI agents can correctly use tool definitions. It is for developers, coding agents, and teams that define tools, write example tasks, run evals, and need readable reports before exposing tool behavior to users.

Core workflow:

```text
tools + tasks -> eval run -> score/report -> suggestions
```

ToolSmith currently runs locally with a deterministic mock agent. It does not call real models, execute real tools, send email, edit calendars, connect to databases, execute imported APIs, deploy, publish, or print secrets.

Current status: v1.0.7 CLI version output fix. ToolSmith is stable locally, available on GitHub, and published to npm as `@landon-personal/toolsmith`; npm currently has v1.0.6 published. This v1.0.7 patch is not published to npm in this step.

Fresh user flow:

```sh
toolsmith init
toolsmith lint .
toolsmith eval .
toolsmith report
```

`toolsmith init` creates `toolsmith.config.json`, `tools.json`, and `tasks.json`.

Local development commands:

```sh
npm run dev -- init
npm run dev -- lint examples/calendar-email
npm run dev -- eval examples/calendar-email
npm run dev -- report
npm run dev -- report --format markdown
npm run dev -- report --format html
npm run dev -- compare .toolsmith/runs/latest.json .toolsmith/runs/latest.json
npm run dev -- import openapi examples/openapi/tiny-api.json --out examples/openapi/tools.generated.json
```

Install commands:

```sh
npm install -g @landon-personal/toolsmith
npx @landon-personal/toolsmith@latest --help
toolsmith --help
```

Publishing future patches and creating release tags require explicit approval. The CLI binary command remains `toolsmith`.
