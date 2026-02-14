---
task: 002-fix-docker-build
type: quick
files_modified: [Dockerfile]
---

# Quick Task: Fix Docker Build Type Errors

Objective: Resolve TypeScript compilation errors in Docker build caused by missing devDependencies (types) when `NODE_ENV=production`.

## Plan
1. Modify `Dockerfile` to install devDependencies before running `npm run build`.
2. Ensure `NODE_ENV` is set to `production` only after the build or during the build in a way that doesn't block `npm install`.
3. Keep `npm prune --production` to ensure the final image is optimized.
