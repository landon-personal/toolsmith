# npm Publishing

ToolSmith is published to npm as `@landon-personal/toolsmith`. The v1.0.6 patch is prepared in this repository but is not published to npm in this step.

The unscoped package name `toolsmith` is already taken on npm. ToolSmith uses the scoped package name:

```text
@landon-personal/toolsmith
```

The CLI binary command remains:

```sh
toolsmith --help
```

## v1.0.5 Final Gate

The final npm publish gate verifies:

- npm user: `landon-personal`
- package name: `@landon-personal/toolsmith`
- CLI binary: `toolsmith`
- package metadata: scoped package name, published version, and description
- GitHub Pages: `https://landon-personal.github.io/toolsmith/`
- `npm pack --dry-run`
- `npm publish --dry-run --access public`

This gate does not run a real npm publish and does not create release tags.

## v1.0.6 Patch Gate

The v1.0.6 patch fixes first-user init scaffolding so `toolsmith init` creates:

- `toolsmith.config.json`
- `tools.json`
- `tasks.json`

The fresh user flow is:

```sh
toolsmith init
toolsmith lint .
toolsmith eval .
toolsmith report
```

Before a real v1.0.6 publish, rerun the checks below and get explicit approval. This documentation update does not publish the patch and does not create release tags.

## Install Commands

Current npm install commands are:

```sh
npm install -g @landon-personal/toolsmith
npx @landon-personal/toolsmith@latest --help
```

## Before Publishing

- Confirm npm auth with `npm whoami`.
- Confirm package metadata with `npm view @landon-personal/toolsmith name version description`.
- Run `npm run compile`.
- Run `npm test`.
- Run `npm run release:audit`.
- Run `npm run package:check`.
- Run `npm pack --dry-run`.
- Run `npm publish --dry-run --access public`.
- Inspect package contents for generated files, secrets, npm tarballs, reports, local run output, temp folders, and private files.

## Approval Gate

Real npm publishing requires explicit approval.

Do not publish with secrets or generated files included. Do not inspect, print, store, or commit npm tokens.

## After Publishing

After a real approved publish, verify:

```sh
npm view @landon-personal/toolsmith
npx @landon-personal/toolsmith@latest --help
toolsmith --help
```
