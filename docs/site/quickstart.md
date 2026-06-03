# Quickstart

Fresh clone flow:

```sh
git clone <repo-url>
cd toolsmith
```

Use the real repository URL after the repository is public.

Install local development dependencies:

```sh
npm install
```

Compile TypeScript:

```sh
npm run compile
```

Run tests:

```sh
npm test
```

Show CLI help:

```sh
npm run dev -- --help
```

Lint the starter tools:

```sh
npm run dev -- lint examples/calendar-email
```

Run the starter eval:

```sh
npm run dev -- eval examples/calendar-email
```

Print the latest terminal report:

```sh
npm run dev -- report
```

Generate shareable reports:

```sh
npm run dev -- report --format markdown
npm run dev -- report --format html
```

The Markdown report writes `report.md` by default. The HTML report writes `report.html` by default. These files are local generated artifacts.

Test local package installation:

```sh
npm run package:check
```
