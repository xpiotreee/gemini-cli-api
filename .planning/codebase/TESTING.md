# Testing Patterns

**Analysis Date:** 2025-02-14

## Test Framework

**Runner:**
- Not detected. No testing framework is currently configured in the codebase.

**Assertion Library:**
- Not applicable.

**Run Commands:**
```bash
# No test commands defined
```

## Test File Organization

**Location:**
- Proposed: Create a `tests/` directory at the root or co-locate `*.test.js` files with source logic.

**Naming:**
- Proposed: `[filename].test.js` or `[filename].spec.js`.

**Structure:**
```
tests/
├── unit/           # Unit tests for logic
└── integration/    # Integration tests for API endpoints
```

## Test Structure

**Suite Organization:**
- No existing tests to reference. If added, use standard `describe`/`it` blocks.

**Patterns:**
- Proposed pattern for API testing:
```javascript
const request = require('supertest');
const app = require('./server'); // Requires refactoring server.js to export app

describe('POST /generate', () => {
  it('should return 400 if prompt is missing', async () => {
    // ...
  });
});
```

## Mocking

**Framework:** None.

**What to Mock:**
- **`child_process.execFile`**: Critical to mock this to avoid calling the actual `gemini` CLI during tests.
- **`express` requests/responses**: If testing logic in isolation.

## Fixtures and Factories

**Test Data:**
- Example JSON responses from the `gemini` CLI should be stored as fixtures for testing the parsing logic.

**Location:**
- Proposed: `tests/fixtures/*.json`.

## Coverage

**Requirements:** None enforced.

## Test Types

**Unit Tests:**
- Not used.

**Integration Tests:**
- Not used. Recommended for testing the `/generate` endpoint's interaction with `execFile`.

**E2E Tests:**
- Not used.

## Common Patterns

**Async Testing:**
- Use `async/await` with a test runner like Vitest or Jest.

**Error Testing:**
- Verify that the API returns correct status codes (`400`, `500`) and error message structures.

---

*Testing analysis: 2025-02-14*
