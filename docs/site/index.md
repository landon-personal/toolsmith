# ToolSmith

Before shipping your AI agent, test whether it knows how to use its tools.

ToolSmith is a local-first developer tool for testing whether AI agents can correctly use tool definitions. It is for developers, coding agents, and teams that define tools, write example tasks, run evals, and need readable reports before exposing tool behavior to users.

Core workflow:

```text
tools + tasks -> eval run -> score/report -> suggestions
```

ToolSmith currently runs locally with a deterministic mock agent. It does not call real models, execute real tools, send email, edit calendars, connect to databases, deploy, publish, or print secrets.

Current commands:

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

Future install goal:

```sh
npm install -g toolsmith
npx toolsmith@latest --help
```

ToolSmith is not published to npm yet. Public release, npm publishing, GitHub Pages deployment, and GitHub push should happen only after explicit approval.
