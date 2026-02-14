# Codebase Concerns

**Analysis Date:** 2025-02-14

## Tech Debt

**Dependency Management:**
- Issue: There is no `package.json` or `package-lock.json` in the repository. Dependencies like `express` are installed directly in the `Dockerfile`.
- Files: `Dockerfile`, `server.js`
- Impact: Non-deterministic builds. Reproducing the exact environment is difficult, and security vulnerabilities in dependencies are harder to track.
- Fix approach: Create a `package.json` and `package-lock.json`, and use `npm install` during the Docker build process.

**CLI-based Architecture:**
- Issue: The application is a thin wrapper that spawns a new process for every request using `execFile`.
- Files: `server.js`
- Impact: Significant overhead per request. Not suitable for high-concurrency scenarios.
- Fix approach: If performance becomes an issue, consider using the Gemini SDK directly or a more persistent connection if the CLI supports it.

## Security Considerations

**Authentication:**
- Risk: The API has no built-in authentication. Anyone who can reach the network port can make requests and use the configured Google Account/API Key.
- Files: `server.js`, `docker-compose.yml`
- Current mitigation: README warning against public exposure.
- Recommendations: Implement Basic Auth, API Key validation, or an API Gateway.

**Argument Injection:**
- Risk: The `prompt` is passed directly as an argument to `execFile`. If the prompt starts with a hyphen (e.g., `-V`), it might be interpreted as a flag by the `gemini` CLI.
- Files: `server.js`
- Current mitigation: None.
- Recommendations: Use `--` to signal the end of command-line options if the CLI supports it: `args.push('--', prompt)`.

**Session Isolation:**
- Risk: All users share the same `.gemini` directory mounted via volume. `session_id` can be used to resume sessions, potentially allowing one user to access another's conversation history if IDs are predictable or discoverable.
- Files: `docker-compose.yml`, `server.js`
- Current mitigation: None.
- Recommendations: Implement user-based isolation or use separate storage paths per user/session.

## Performance Bottlenecks

**Buffered Output:**
- Problem: `execFile` buffers the entire stdout/stderr. Large responses from the Gemini model could exceed the default buffer limit (typically 1MB) or cause high memory usage.
- Files: `server.js`
- Cause: Node.js `execFile` implementation.
- Improvement path: Use `spawn` and stream the output, or increase the `maxBuffer` option in `execFile`.

**No Request Timeout:**
- Problem: `execFile` is called without a timeout. If the `gemini` CLI hangs or takes too long, the HTTP request will remain open indefinitely.
- Files: `server.js`
- Cause: Missing `timeout` option in `execFile`.
- Improvement path: Add a reasonable `timeout` (e.g., 60000ms) to the `execFile` options.

## Fragile Areas

**CLI Output Parsing:**
- Files: `server.js`
- Why fragile: The API relies on `gemini --output-format json` producing valid JSON. If the CLI fails or produces malformed JSON (or includes non-JSON warnings in stdout), parsing will fail.
- Safe modification: The current code has a `try...catch` fallback to raw string, but this might break clients expecting JSON.
- Test coverage: No tests detected.

## Test Coverage Gaps

**Missing Tests:**
- What's not tested: Entire application. There are no unit, integration, or E2E tests.
- Files: `server.js`
- Risk: Regressions in argument handling, error handling, or parsing could go unnoticed.
- Priority: Medium (due to small codebase size, but critical for growth).

---

*Concerns audit: 2025-02-14*
