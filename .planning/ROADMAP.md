# Roadmap

## Phase 1: Sessions & Foundation
**Goal:** Implement session management and establish the TypeScript codebase.
- [x] TypeScript Migration (migrating server.js to src/index.ts).
- [x] Implement `GET /sessions` (list sessions from storage).
- [x] Implement `GET /sessions/:id` (fetch session history).
- [x] Standardize error responses.

## Phase 2: OpenAI Compatibility Layer
- [x] Implement `/v1/chat/completions` endpoint.
- [x] Implement request/response transformation logic.
- [x] Support streaming responses (SSE).

## Phase 3: Polish & Documentation
- [x] Update README with new Session API documentation.
- [x] Final E2E testing.
