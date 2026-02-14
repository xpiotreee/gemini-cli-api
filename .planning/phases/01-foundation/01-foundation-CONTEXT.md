# Phase 1: Sessions & Foundation - Context

## Goals
- Migrate to TypeScript for a robust foundation.
- Implement Session Listing and History retrieval from Gemini CLI storage.
- Standardize error handling.

## Decisions
- **TypeScript:** Strict mode enabled. Restructured into `src/`.
- **Session Discovery:** 
  - Base path: `/home/node/.gemini/tmp/` (mapped from host `.gemini-container/tmp/`).
  - Search: Scan all subdirectories for `chats/*.json`.
- **API Endpoints:**
  - `GET /sessions`: Returns `{ sessions: [{ id, startTime, lastUpdated }] }`.
  - `GET /sessions/:id`: Returns full JSON content from the session file.
- **Error Handling:** Standardized JSON errors `{ error: "CODE", message: "..." }`.
- **Authentication:** NONE (Internal Docker use only).

## Constraints
- Must correctly resolve paths inside Docker.
- Must preserve all metadata (thoughts, tokens) in history response.
- Maintain existing `/generate` functionality.
