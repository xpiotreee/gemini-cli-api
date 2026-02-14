# Roadmap

## Phase 1: Sessions & Foundation
**Goal:** Implement session management and establish the TypeScript codebase.
- [ ] TypeScript Migration (migrating server.js to src/index.ts).
- [ ] Implement `GET /sessions` (list sessions from storage).
- [ ] Implement `GET /sessions/:id` (fetch session history).
- [ ] Standardize error responses.

## Phase 2: OpenAI Compatibility Layer
- [ ] Implement `/v1/chat/completions` endpoint.
- [ ] Implement request/response transformation logic.
- [ ] Support streaming responses (SSE).

## Phase 3: Polish & Documentation
- [ ] Update README with new Session API documentation.
- [ ] Final E2E testing.
