---
task: 003-update-session-logic
type: quick
files_modified: [src/services/SessionService.ts]
---

# Quick Task: Update Session ID Matching and List Output

Objective: Modify `SessionService` to match sessions using the full ID verified against file content, and update the session list to include the filename.

## Plan
1. Update `SessionMetadata` interface in `src/services/SessionService.ts` to include `filename`.
2. Update `listSessions` to:
    - Read each session file to get the true `sessionId`.
    - Return the full `sessionId` as `id`.
    - Include the file's basename as `filename`.
3. Update `getSession(id)` to:
    - Extract the prefix from the provided `id`.
    - Find files that match this prefix in their name.
    - Verify the `sessionId` inside the file matches the full `id`.
4. Update `STATE.md`.
