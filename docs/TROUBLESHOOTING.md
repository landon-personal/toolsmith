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

ToolSmith is published to npm as `@landon-personal/toolsmith`. If you are testing an unpublished patch from this repository, use the local development commands instead.

## Node Version Problems

If commands fail with syntax or module errors, use Node 20 or newer. The package metadata declares:

```json
"engines": {
  "node": ">=20"
}
```

## Command Not Found

Install the published CLI or run it with `npx`:

```sh
npm install -g @landon-personal/toolsmith
toolsmith --help
npx @landon-personal/toolsmith@latest --help
```

For the local checkout, run commands through npm:

```sh
npm run dev -- --help
```

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
toolsmith eval .
toolsmith report
```

If you do not have `tools.json` and `tasks.json` yet, run `toolsmith init` first.

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

## Published npm Package

ToolSmith is published to npm as `@landon-personal/toolsmith`:

```sh
npm install -g @landon-personal/toolsmith
npx @landon-personal/toolsmith@latest --help
toolsmith --help
```

The currently published npm package is v1.0.6. The v1.0.7 patch is not published to npm in this step. Publishing future patches requires explicit approval.
