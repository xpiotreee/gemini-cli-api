# Coding Conventions

**Analysis Date:** 2025-02-14

## Naming Patterns

**Files:**
- Lowercase with hyphens or underscores (e.g., `server.js`, `docker-compose.yml`).

**Functions:**
- Anonymous callback functions are used for middleware and subprocess execution in `server.js`.

**Variables:**
- `camelCase` for general variables and constants (e.g., `app`, `port`, `args`, `error`, `stdout`).
- `snake_case` is used for incoming API request parameters to match potential external API expectations (e.g., `session_id` in `req.body`).

**Types:**
- Not applicable as the project uses plain JavaScript.

## Code Style

**Formatting:**
- **Indentation:** 4 spaces.
- **Quotes:** Single quotes (`'`) for string literals in code, double quotes (`"`) for JSON responses and key strings.
- **Semicolons:** Required at the end of statements.
- **Trailing Commas:** Used in objects and arrays (e.g., `res.json({ result: result, });`).

**Linting:**
- Not detected. No configuration files like `.eslintrc` or `.prettierrc` exist.

## Import Organization

**Order:**
1. Core Node.js modules (e.g., `child_process`).
2. Third-party dependencies (e.g., `express`).

**Path Aliases:**
- Not used. Standard relative paths or package names only.

## Error Handling

**Patterns:**
- **Validation:** Early return with HTTP 400 for missing required fields in `server.js`.
- **Subprocess Errors:** Checked via the `error` parameter in the `execFile` callback.
- **HTTP Status Codes:** 
    - `400` for client-side errors (validation).
    - `500` for server-side or CLI execution failures.
- **Try-Catch:** Used specifically for parsing JSON output from the CLI to prevent crashing on malformed stdout.

## Logging

**Framework:** Native `console`.

**Patterns:**
- `console.log`: Used for server startup confirmation.
- `console.error`: Used for critical execution errors (e.g., CLI failure).
- `console.warn`: Used for non-critical issues like JSON parsing failures.

## Comments

**When to Comment:**
- Minimal commenting observed. Use comments sparingly for explaining complex logic or unusual workarounds.

**JSDoc/TSDoc:**
- Not used.

## Function Design

**Size:**
- Small, single-responsibility functions/middleware.

**Parameters:**
- Standard Express `(req, res)` signature for routes.
- Destructuring used for extracting data from `req.body`.

**Return Values:**
- Standard Express `res.json()` or `res.status().json()`.

## Module Design

**Exports:**
- Not used (single-file server implementation).

**Barrel Files:**
- Not used.

---

*Convention analysis: 2025-02-14*
