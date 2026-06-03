# Reports

Print the latest terminal report:

```sh
npm run dev -- report
```

Generate JSON:

```sh
npm run dev -- report --format json
npm run dev -- report --format json --out report.json
```

Generate Markdown:

```sh
npm run dev -- report --format markdown
npm run dev -- report --format markdown --out report.md
```

Generate static HTML:

```sh
npm run dev -- report --format html
npm run dev -- report --format html --out report.html
```

Reports include:

- overall score
- score breakdown
- failure breakdown
- passed tasks
- failed task details
- expected vs actual tools
- reasons and recommendations
- tool confusion matrix
- raw JSON details

HTML reports are static, local files with no external CDN dependencies, analytics, or network calls.
