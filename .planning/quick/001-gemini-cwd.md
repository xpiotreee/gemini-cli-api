---
task: 001-gemini-cwd
type: quick
files_modified: [src/index.ts, src/services/OpenAIService.ts]
---

# Quick Task: Execute Gemini in /tmp/gemini

Objective: Ensure all `gemini` CLI calls are executed with `/tmp/gemini` as the working directory.

## Plan
1. Update `src/index.ts` to add `cwd: '/tmp/gemini'` to `execFile`.
2. Update `src/services/OpenAIService.ts` to add `cwd: '/tmp/gemini'` to `execFile` and `spawn`.
3. Verify by checking if the server still functions correctly.
