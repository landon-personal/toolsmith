# Installation

ToolSmith is published to npm as `@landon-personal/toolsmith`. The npm `latest` dist-tag points to v1.0.7, and the CLI binary command remains `toolsmith`.

Install globally:

```sh
npm install -g @landon-personal/toolsmith
toolsmith --help
toolsmith --version
```

Run without a global install:

```sh
npx @landon-personal/toolsmith@latest --help
```

Fresh starter flow:

```sh
mkdir demo-agent-tools
cd demo-agent-tools
toolsmith init
toolsmith lint .
toolsmith eval .
toolsmith report
```

`toolsmith init` creates `toolsmith.config.json`, `tools.json`, and `tasks.json`.

Local development from the repository:

```sh
git clone https://github.com/landon-personal/toolsmith.git
cd toolsmith
npm install
npm run dev -- <command>
```

The unscoped `toolsmith` package name is already taken on npm. ToolSmith uses the scoped package `@landon-personal/toolsmith`, while keeping the CLI binary command as `toolsmith`.

Publishing future patches must not happen without explicit approval.

Local package smoke check:

```sh
npm run package:check
```

This builds the CLI, packs it locally, installs the tarball into a temporary directory, runs `toolsmith --help`, runs `toolsmith --version`, and cleans up on success. It does not publish to npm.
