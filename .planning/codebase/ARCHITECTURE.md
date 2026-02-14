# Architecture

**Analysis Date:** 2025-01-24

## Pattern Overview

**Overall:** Thin Wrapper / Bridge Pattern

**Key Characteristics:**
- RESTful interface for a Command Line Interface (CLI).
- Stateless API logic (state is managed by the underlying CLI and its configuration files).
- Process-based execution: Each request spawns a new CLI process.

## Layers

**API Layer:**
- Purpose: Provides HTTP endpoints for external clients to interact with the system.
- Location: `server.js`
- Contains: Express.js routes, request validation, and CLI invocation logic.
- Depends on: `express`, `child_process.execFile`
- Used by: External HTTP clients.

**CLI Layer (External):**
- Purpose: Handles the core logic of communicating with Google's Gemini models.
- Location: Pre-installed in the Docker image (`gemini` command).
- Contains: OAuth2 authentication, model interaction, and session management.
- Depends on: Google Gemini API / OAuth2 credentials.
- Used by: API Layer via `execFile`.

## Data Flow

**Content Generation Flow:**

1. Client sends a POST request to `/generate` with a JSON body.
2. `server.js` validates the presence of the `prompt` field.
3. `server.js` constructs an array of arguments for the `gemini` CLI.
4. `server.js` invokes the `gemini` CLI using `execFile`.
5. The `gemini` CLI communicates with Google services and returns a JSON string to stdout.
6. `server.js` parses the stdout from the CLI.
7. `server.js` sends the parsed JSON (or raw string if parsing fails) back to the client.

**State Management:**
- State (session history and configuration) is managed by the `gemini` CLI.
- Persistent data is stored in `/home/node/.gemini` (mapped to `.gemini-container/` on the host).

## Key Abstractions

**CLI Execution Wrapper:**
- Purpose: Encapsulates the logic of calling the external binary and handling its output.
- Examples: `execFile('gemini', args, ...)` in `server.js`.
- Pattern: Child Process Execution.

## Entry Points

**HTTP Server:**
- Location: `server.js`
- Triggers: Incoming HTTP requests on port 3000.
- Responsibilities: Routing, input sanitization, process orchestration, and response formatting.

## Error Handling

**Strategy:** Bubbling errors from the CLI to the API response.

**Patterns:**
- HTTP 400 for invalid request bodies (missing `prompt`).
- HTTP 500 when the CLI execution fails (e.g., auth issues, network errors).
- JSON parsing fallback: If CLI output isn't valid JSON, it returns the raw string.

## Cross-Cutting Concerns

**Logging:** Basic console logging for server start and errors (`console.log`, `console.error`, `console.warn`).
**Validation:** Minimal manual check for required fields in `server.js`.
**Authentication:** Delegated to the `gemini` CLI (OAuth2 or API Key). The API itself is currently unauthenticated (relying on infrastructure/proxy for security).

---

*Architecture analysis: 2025-01-24*
