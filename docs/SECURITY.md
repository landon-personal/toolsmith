# Security

Security contact is not configured yet. This must be filled in before public release.

Do not include secrets, API keys, tokens, private URLs, private logs, or environment variable values in issues, reports, eval output, screenshots, or public discussions.

## Current Safety Scope

ToolSmith v1.0.1 is local-first and mock-agent-based by default.

- ToolSmith should not print API keys, secrets, or environment variables.
- ToolSmith does not execute real side-effect tools by default.
- ToolSmith does not send email, edit calendars, charge money, delete data, deploy code, publish packages, or modify production systems.
- Real model providers are future optional work and are not part of v1.0.1.
- Imported OpenAPI specs are converted into local tool definitions only. Imported APIs are not executed.

## Before Public Release

- Configure a public security contact or security policy.
- Run local release checks and a secret scan.
- Confirm `.env`, `.toolsmith/runs/`, npm tarballs, generated reports, `node_modules/`, and unintended build output are not committed.
