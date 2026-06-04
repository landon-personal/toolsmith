# Quickstart

ToolSmith is published to npm as `@landon-personal/toolsmith`, and the npm `latest` dist-tag points to v1.0.7. The first-user `toolsmith init` scaffold creates `toolsmith.config.json`, `tools.json`, and `tasks.json`.

Install globally:

```sh
npm install -g @landon-personal/toolsmith
toolsmith --help
```

Run without a global install:

```sh
npx @landon-personal/toolsmith@latest --help
```

Create a starter project:

```sh
mkdir demo-agent-tools
cd demo-agent-tools
toolsmith init
toolsmith lint .
toolsmith eval .
toolsmith report
```

`toolsmith init` creates a mock calendar/email starter. The tools and tasks are local fixtures only; ToolSmith does not call models, send email, edit calendars, or run real tool side effects.

Local development from the repository:

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

Generate shareable reports:

```sh
toolsmith report --format markdown
toolsmith report --format html
```

The Markdown report writes `report.md` by default. The HTML report writes `report.html` by default. These files are local generated artifacts.

Test local package installation:

```sh
npm run package:check
```
