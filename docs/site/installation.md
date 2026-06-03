# Installation

ToolSmith is not published to npm yet.

Current local usage:

```sh
git clone https://github.com/landon-personal/toolsmith.git
cd toolsmith
npm install
npm run dev -- <command>
```

Future public install goal:

```sh
npm install -g @landon-personal/toolsmith
npx @landon-personal/toolsmith@latest --help
toolsmith --help
```

The unscoped `toolsmith` package name is already taken on npm. ToolSmith is preparing the scoped package `@landon-personal/toolsmith`, while keeping the CLI binary command as `toolsmith`.

Publishing must not happen without explicit approval.

Local package smoke check:

```sh
npm run package:check
```

This builds the CLI, packs it locally, installs the tarball into a temporary directory, runs `toolsmith --help`, runs `toolsmith --version`, and cleans up on success. It does not publish to npm.
