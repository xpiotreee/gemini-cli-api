# Gemini CLI API Wrapper

This project provides a lightweight REST API wrapper around the [Gemini CLI](https://github.com/naoyoshinori/gemini-cli). It allows you to interact with Google's Gemini models via HTTP requests, 

## Why use this?
While Google provides a standard API, the **Gemini CLI** (when used with OAuth2) often offers **higher rate limits** and access to models that might be restricted or paid in the standard API tier. This wrapper allows you to leverage those benefits programmatically via a simple REST interface.

## Features

-   **RESTful API**: Simple POST endpoint to send prompts.
-   **OpenAI Compatible**: Support for `/v1/chat/completions` (Standard & Streaming).
-   **Session Management**: List and retrieve detailed conversation history.
-   **JSON Output**: Returns parsed JSON responses from the CLI when available.
-   **Dockerized**: Easy deployment using Docker and Docker Compose.

## Prerequisites

-   Docker and Docker Compose installed on your machine.
-   Google account or a valid [Google API Key](https://aistudio.google.com/app/apikey) for Gemini.

## Installation & Setup

### 1. Clone the repository:
```bash
git clone https://github.com/xpiotreee/gemini-cli-api
cd gemini-cli-api
```

### 2. Configure Environment (Optional)
If you plan to use a standard API Key instead of OAuth2, set it now. Create an .env file or export it:
    
```bash
export GOOGLE_API_KEY="your_api_key_here"
```

### 3. Build and Run with Docker Compose:
```bash
docker-compose up --build -d
```
The API will be available at `http://localhost:3000`.
### 4. Authentication (Crucial Step)

You have two options for authentication. **OAuth2 is recommended** for better free tier limits.

#### Option A: Google OAuth2 (Recommended)
After the container is running (step 3), run the interactive login command:
```bash
docker-compose exec gemini-api gemini
```
Follow the instructions in the terminal (visit the link, copy the code, and paste it back into the terminal).

#### Option B: Google API Key
If you provided `GOOGLE_API_KEY` in step 2, you are ready to go.

### 5. Advanced Configuration
By default, tools are disabled. You can edit the configuration file located in `.gemini-container/` to enable specific tools or change model settings.

## Security Note
This wrapper exposes functionality linked to your Google Account. **Do not expose port 3000 to the public internet** without adding an authentication layer (like Basic Auth, API Gateway, or Nginx) in front of it.

## API Usage

### Generate Content (Legacy)

**Endpoint:** `POST /generate`

**Request Body:**

| Field        | Type   | Required | Description |
| :---         | :---   | :---     | :---        |
| `prompt`     | String | Yes      | The input text prompt for Gemini. |
| `model`      | String | No       | Specific model to use (e.g., `gemini-3-flash-preview`). |
| `session_id` | String | No       | ID to resume a previous conversation context. |

**Example Request:**

```bash
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain quantum computing in simple terms",
    "model": "gemini-3-flash-preview"
  }'
```

**Example Response:**

```json
{
   "result":{
      "session_id":"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "response":"Quantum computing uses quantum bits, or ...",
      "stats":{
         "models":{
            "gemini-3-flash-preview":{
               "api":{
                  "totalRequests":1,
                  "totalErrors":0,
                  "totalLatencyMs":12007
               },
               "tokens":{
                  "input":3245,
                  "prompt":3245,
                  "candidates":99,
                  "total":4854,
                  "cached":0,
                  "thoughts":1510,
                  "tool":0
               }
            }
         },
         "tools":{
            /* ... */
         },
         "files":{
            /* ... */
         }
      }
   }
}
```

### Sessions

**List Sessions**

**Endpoint:** `GET /sessions`

Returns a list of available conversation sessions.

**Example Response:**
```json
{
  "sessions": [
    {
      "id": "session-2026-02-14T15-26-7c2a37fd",
      "startTime": "2026-02-14T15:26:06.490Z",
      "lastUpdated": "2026-02-14T15:26:16.252Z"
    }
  ]
}
```

**Get Session Details**

**Endpoint:** `GET /sessions/:id`

Returns the full message history and metadata for a specific session.

---

### OpenAI Compatibility Layer

This wrapper provides an OpenAI-compatible interface, allowing you to use the Gemini CLI with any tool or SDK designed for OpenAI.

**Chat Completions**

**Endpoint:** `POST /v1/chat/completions`

**Request Body:**

| Field      | Type    | Required | Description |
| :---       | :---    | :---     | :---        |
| `model`    | String  | Yes      | Gemini model name (e.g., `gemini-3-flash-preview`). |
| `messages` | Array   | Yes      | Array of message objects with `role` and `content`. |
| `stream`   | Boolean | No       | If true, returns a stream of SSE events. |

**Example Request:**

```bash
curl -X POST http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3-flash-preview",
    "messages": [
      { "role": "system", "content": "You are a helpful assistant." },
      { "role": "user", "content": "Hello!" }
    ]
  }'
```

**Streaming Support:**

When `stream: true` is provided, the API returns Server-Sent Events (SSE) compatible with OpenAI streaming.

```bash
curl -N -X POST http://localhost:3010/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3-flash-preview",
    "messages": [{ "role": "user", "content": "Count to 5" }],
    "stream": true
  }'
```

## Configuration

-   **Persistence**: The `.gemini-container` directory is mounted to `/home/node/.gemini` inside the container. This persists CLI configuration and session history across container restarts.

## Future plans
-   [ ] **Account management**: Easier account switching via API endpoints.
-   [ ] **Tool support**: Expose MCP and extension functionality via API.

## License

[GPL](LICENSE)
