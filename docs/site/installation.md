# Installation

ToolSmith is not published to npm yet.

Current local usage:

```sh
git clone <repo-url>
cd toolsmith
npm install
npm run dev -- <command>
```

Use the real repository URL after the repository is public.

Future public install goal:

```sh
npm install -g toolsmith
npx toolsmith@latest --help
```

The `toolsmith` package name must be verified before publishing. Publishing must not happen without explicit approval.

Local package smoke check:

```sh
npm run package:check
```

This builds the CLI, packs it locally, installs the tarball into a temporary directory, runs `toolsmith --help`, runs `toolsmith --version`, and cleans up on success. It does not publish to npm.
