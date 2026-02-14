# Technology Stack

**Analysis Date:** 2025-02-14

## Languages

**Primary:**
- JavaScript (Node.js) - Used for the main API server in `server.js`.

**Secondary:**
- Shell/Bash - Used in `Dockerfile` for environment setup and implicitly for CLI interaction.

## Runtime

**Environment:**
- Node.js (Version defined by `naoyoshinori/gemini-cli:0-typescript-node` base image)

**Package Manager:**
- npm - Used in `Dockerfile` to install dependencies.
- Lockfile: missing (dependencies are installed via `npm install express` in `Dockerfile`).

## Frameworks

**Core:**
- Express (Latest version installed at build time) - Used as the web framework for the REST API in `server.js`.

**Testing:**
- Not detected. No test framework or test files found in the codebase.

**Build/Dev:**
- Docker - Used for containerization and environment consistency.
- Docker Compose - Used for local orchestration and volume management.

## Key Dependencies

**Critical:**
- `express` - Handles HTTP requests and routing in `server.js`.
- `gemini-cli` - Provided by the base Docker image; the core engine for interacting with Google Gemini.

**Infrastructure:**
- `child_process` (Native Node.js module) - Used to execute the `gemini` CLI binary.

## Configuration

**Environment:**
- Configured via Docker environment variables and a mounted volume.
- `GOOGLE_API_KEY` - Optional API key for Gemini.

**Build:**
- `Dockerfile` - Defines the container image and build steps.
- `docker-compose.yml` - Defines service configuration, port mapping, and volumes.

## Platform Requirements

**Development:**
- Docker
- Docker Compose

**Production:**
- Any Docker-compatible host.

---

*Stack analysis: 2025-02-14*
