# npm Publishing

ToolSmith is not published to npm yet.

The unscoped package name `toolsmith` is already taken on npm. ToolSmith is preparing to use the scoped package name:

```text
@landon-personal/toolsmith
```

The CLI binary command remains:

```sh
toolsmith --help
```

## Future Install Goal

After npm publishing is explicitly approved and completed, expected install commands are:

```sh
npm install -g @landon-personal/toolsmith
npx @landon-personal/toolsmith@latest --help
```

## Before Publishing

- Confirm npm auth with `npm whoami`.
- Confirm package name availability with `npm view @landon-personal/toolsmith name version description`.
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
