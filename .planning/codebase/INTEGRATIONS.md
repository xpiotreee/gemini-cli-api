# External Integrations

**Analysis Date:** 2025-02-14

## APIs & External Services

**AI Services:**
- Google Gemini - The primary service providing LLM capabilities.
  - SDK/Client: `gemini-cli` (binary executed via `child_process`).
  - Auth: `GOOGLE_API_KEY` (env var) or OAuth2 (interactive login).

## Data Storage

**Databases:**
- None detected.

**File Storage:**
- Local filesystem - Used for persisting CLI configuration, OAuth tokens, and session history.
  - Path: `.gemini-container/` (mounted to `/home/node/.gemini` in the container).

**Caching:**
- None (CLI might handle internal caching, but not managed by the API wrapper).

## Authentication & Identity

**Auth Provider:**
- Google OAuth2 / API Key.
  - Implementation: Handled by the `gemini-cli`. The API wrapper passes arguments to the CLI, which uses the stored credentials in the mounted volume.

## Monitoring & Observability

**Error Tracking:**
- None.

**Logs:**
- Console logging in `server.js` (standard output).
- `execFile` error logs for CLI execution failures.

## CI/CD & Deployment

**Hosting:**
- Docker-compatible environment.

**CI Pipeline:**
- Not detected.

## Environment Configuration

**Required env vars:**
- `GOOGLE_API_KEY` - Optional if using OAuth2.

**Secrets location:**
- `.gemini-container/oauth_creds.json` - Stores OAuth2 credentials (persisted via volume).
- `.env` file (if used locally, not committed).

## Webhooks & Callbacks

**Incoming:**
- None.

**Outgoing:**
- None.

---

*Integration audit: 2025-02-14*
