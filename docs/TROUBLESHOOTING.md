# Troubleshooting

## `npm install` fails

Check your Node.js version first:

```sh
node --version
```

ToolSmith currently requires Node 20 or newer. If dependencies still fail to install, remove any partial install and retry from a clean checkout:

```sh
npm install
```

Do not use `npm install -g toolsmith` yet. ToolSmith is not published to npm.

## Node Version Problems

If commands fail with syntax or module errors, use Node 20 or newer. The package metadata declares:

```json
"engines": {
  "node": ">=20"
}
```

## Command Not Found

For the local checkout, run commands through npm:

```sh
npm run dev -- --help
```

The global `toolsmith` command is a future install goal. It is tested locally through `npm run package:check`, but it is not published yet.

## `package:check` Fails

`npm run package:check` compiles the CLI, creates a local npm tarball, installs it into a temporary directory, runs `toolsmith --help`, runs `toolsmith --version`, and cleans up on success.

If it fails:

- run `npm run compile`
- run `npm test`
- check that `dist/cli.js` was generated locally
- check that no package tarball or temp install folder is being committed
- verify Node 20 or newer

## Generated Reports Not Found

Run an eval before reporting:

```sh
npm run dev -- eval examples/calendar-email
npm run dev -- report
```

Markdown and HTML reports are generated only when requested:

```sh
npm run dev -- report --format markdown
npm run dev -- report --format html
```

By default these write `report.md` and `report.html`. They are generated files and should not be committed unless a future task explicitly asks for fixtures.

## Compare Cannot Find Run Files

`compare` needs two saved eval run JSON files:

```sh
npm run dev -- compare baseline.json .toolsmith/runs/latest.json
```

Create `.toolsmith/runs/latest.json` by running:

```sh
npm run dev -- eval examples/calendar-email
```

Do not commit `.toolsmith/runs/`; it is generated local output.

## `--fail-under` Exits 1

This can be intentional. `eval --fail-under <score>` exits non-zero when the current score is below the threshold:

```sh
npm run dev -- eval examples/calendar-email --fail-under 80
```

The starter example currently includes intentionally tricky failures, so high thresholds may fail.

## OpenAPI Import File Path Issues

Use a JSON file path and an explicit output path:

```sh
npm run dev -- import openapi examples/openapi/tiny-api.json --out examples/openapi/tools.generated.json
```

The importer reads and writes local JSON only. It does not call imported APIs.

## Windows Path Notes

Prefer npm scripts and Node paths instead of Unix-only shell assumptions. Commands in this repo use forward slashes in examples because npm and Node handle them well in typical shells, but source and tests should use Node `path` and `fs` APIs.

## No npm Package Exists Yet

ToolSmith is not published. Do not rely on:

```sh
npm install -g toolsmith
npx toolsmith@latest --help
```

Those are future public install goals and should be used only after explicit publishing approval.
