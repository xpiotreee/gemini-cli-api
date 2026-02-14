# Codebase Structure

**Analysis Date:** 2025-01-24

## Directory Layout

```
gemini-cli-api/
├── .gemini-container/  # Persistent storage for CLI (sessions, config)
├── .planning/          # GSD planning and documentation
├── server.js           # Main application logic (Express server)
├── Dockerfile          # Container definition
├── docker-compose.yml  # Container orchestration
├── LICENSE             # Project license
└── README.md           # Documentation
```

## Directory Purposes

**.gemini-container/:**
- Purpose: Persistent storage for the underlying `gemini` CLI tool.
- Contains: Configuration files, OAuth2 tokens, and session history.
- Key files: `GEMINI.md`, `settings.json`.

**.planning/:**
- Purpose: Contains development planning, codebase analysis, and phase documentation.
- Contains: Markdown files for architecture, stack, conventions, etc.

## Key File Locations

**Entry Points:**
- `server.js`: The primary entry point for the REST API.

**Configuration:**
- `docker-compose.yml`: Defines environment variables and volume mounts.
- `Dockerfile`: Defines the runtime environment and dependencies.
- `.gemini-container/settings.json`: Configuration for the underlying CLI tool.

**Core Logic:**
- `server.js`: Contains both the API routing and the CLI interaction logic.

**Testing:**
- Not detected: No automated tests found in the current structure.

## Naming Conventions

**Files:**
- Lowercase with hyphens or underscores: `server.js`, `docker-compose.yml`.

**Directories:**
- Dot-prefixed for configuration/system: `.gemini-container`, `.planning`.

## Where to Add New Code

**New API Endpoint:**
- Primary code: `server.js` (add new `app.get/post` routes).

**New Middleware:**
- Implementation: `server.js` (add via `app.use()`).

**Utilities:**
- Shared helpers: Currently none, but should be placed in a new `src/utils/` directory if added.

## Special Directories

**.gemini-container/:**
- Purpose: Acts as the home directory for the `node` user's `.gemini` config inside the container.
- Generated: Semi-generated (CLI creates files here during authentication/use).
- Committed: Yes (partially, to preserve base config).

---

*Structure analysis: 2025-01-24*
