# Roadmap

Current version: v1.0.7.

Completed:

- v0.0.0: TypeScript CLI skeleton and starter fixtures
- v0.1.0: local validation, mock evals, saved runs, reports
- v0.2.0: static tool linter
- v0.2.1: public distribution planning docs
- v0.3.0: package-ready CLI smoke checks
- v0.4.0: better scoring and failure categories
- v0.4.1: roadmap-aligned score breakdown and category names
- v0.5.0: Markdown and static HTML reports
- v0.5.1: coding-agent usage docs for Codex and Claude Code
- v0.6.0: CI mode and saved-run regression comparison
- v0.7.0: basic OpenAPI JSON importer
- v0.8.0: GitHub Pages-ready documentation content
- v0.9.0: public beta readiness docs, troubleshooting, release checklist, and example polish
- v1.0.0: stable public local CLI baseline
- v1.0.1: public repository prep docs, security/privacy/contributing docs, and release audit
- v1.0.2: root MIT license, GitHub repository metadata, and public visibility readiness
- v1.0.3: GitHub Pages documentation from `main` `/docs`
- v1.0.4: scoped npm package prep with `@landon-personal/toolsmith`
- v1.0.5: final npm publish gate with dry-run verification
- v1.0.6: first-user init scaffold fix for config, tools, tasks, lint, eval, and report
- v1.0.7: CLI version output fix so `toolsmith --version` follows package metadata

Near-term path:

- v1.1.0: optional OpenAI tool-selection provider, with mock provider still default

Post-1.0 ideas:

- agent setup command for `AGENTS.md` and `CLAUDE.md`
- MCP-style import
- stricter JSON schema files
- richer eval cases and argument validation

Additional model providers and real side-effect adapters should remain optional and explicit. v1.1.0 does not execute selected tools.
