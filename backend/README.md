# StudentHub AI — Backend

AI-powered study companion backend built with **FastAPI** and **OpenAI GPT-4.1-mini**.

Provides APIs for:
- AI Tutor Chat (with streaming support)
- Notes Summarizer
- Quiz Generator (10 MCQs per request)
- Study Planner
- Assignment Generator
- Flashcards Generator

---

## Tech Stack

- **Python 3.12**
- **FastAPI** — web framework
- **OpenAI SDK** — LLM provider (GPT-4.1-mini, swappable)
- **Pydantic v2** — request/response validation
- **sse-starlette** — Server-Sent Events streaming
- **Docker** — containerized deployment
- **AWS App Runner** — target deployment platform

---

## Project Structure

```
backend/
├── app/
│   ├── main.py                  # App entry point, CORS, routers, error handlers
│   ├── config.py                # Environment-based settings
│   ├── routers/                 # One router per feature
│   │   ├── chat.py
│   │   ├── summarize.py
│   │   ├── quiz.py
│   │   ├── planner.py
│   │   ├── assignment.py
│   │   └── flashcards.py
│   ├── services/
│   │   └── ai_service.py        # Single reusable AI service (OpenAI wrapper)
│   ├── models/
│   │   ├── request_models.py    # Pydantic request schemas
│   │   └── response_models.py   # Pydantic response schemas
│   └── utils/
│       ├── prompts.py           # Prompt templates
│       └── logger.py            # Centralized logging
├── requirements.txt
├── Dockerfile
├── .env.example
├── .gitignore
└── README.md
```

---

## Getting Started (Local Development)

### 1. Clone and set up a virtual environment

```bash
python3.12 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and set your real `OPENAI_API_KEY`.

### 4. Run the server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`.
Interactive docs (Swagger UI): `http://localhost:8000/docs`

---

## Environment Variables

| Variable                  | Description                              | Default                  |
|---------------------------|-------------------------------------------|---------------------------|
| `OPENAI_API_KEY`          | Your OpenAI API key (**required**)        | —                         |
| `OPENAI_MODEL`             | Model name used for all AI calls          | `gpt-4.1-mini`            |
| `APP_ENV`                  | `development` or `production`             | `development`             |
| `LOG_LEVEL`                 | Logging verbosity                         | `INFO`                    |
| `FRONTEND_ORIGIN`           | Allowed CORS origin                       | `http://localhost:5173`   |
| `REQUEST_TIMEOUT_SECONDS`   | OpenAI request timeout                    | `60`                      |
| `MAX_NOTES_LENGTH`          | Max character length for `/summarize`     | `20000`                   |

---

## API Reference

### `POST /chat`
AI Tutor chat. Supports SSE streaming via `?stream=true`.

```json
// Request
{ "message": "Explain DBMS" }

// Response
{ "reply": "..." }
```

### `POST /summarize`
```json
// Request
{ "notes": "..." }

// Response
{
  "summary": "...",
  "key_points": ["..."],
  "keywords": ["..."],
  "revision_notes": "..."
}
```

### `POST /quiz`
Generates exactly 10 MCQs.
```json
// Request
{ "topic": "Operating System", "difficulty": "Medium" }

// Response
{ "questions": [{ "question": "", "options": [], "answer": "", "explanation": "" }] }
```

### `POST /planner`
```json
// Request
{ "subject": "DBMS", "exam_date": "2026-08-20", "hours_per_day": 3 }

// Response
{ "daily_plan": [{ "date": "2026-07-17", "topics": ["..."], "tasks": "..." }] }
```

### `POST /assignment`
```json
// Request
{ "topic": "Cloud Computing", "word_limit": 800 }

// Response
{ "assignment": "..." }
```

### `POST /flashcards`
```json
// Request
{ "topic": "Binary Trees" }

// Response
{ "flashcards": [{ "question": "", "answer": "" }] }
```

### `GET /health`
Health check endpoint used by AWS App Runner.

---

## Error Responses

All errors return a consistent JSON shape:

```json
{ "error": "Validation failed", "detail": "message: message cannot be empty or whitespace only" }
```

Status codes used: `400`, `404`, `422`, `429`, `500`, `502`.

---

## Running with Docker

### Build the image
```bash
docker build -t studenthub-ai-backend .
```

### Run the container
```bash
docker run -p 8000:8000 --env-file .env studenthub-ai-backend
```

The API will be available at `http://localhost:8000`.

---

## Deploying to AWS App Runner

1. Push this repository to GitHub (or push the image to Amazon ECR).
2. In AWS App Runner, create a new service:
   - **Source**: your GitHub repo (or ECR image).
   - **Build**: App Runner will detect the `Dockerfile` automatically.
   - **Port**: `8000`.
3. Under **Environment variables**, add:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
   - `APP_ENV=production`
   - `FRONTEND_ORIGIN` (your deployed frontend URL)
   - `LOG_LEVEL`, `REQUEST_TIMEOUT_SECONDS`, `MAX_NOTES_LENGTH` (optional, defaults apply)
4. Set the **health check path** to `/health`.
5. Deploy. App Runner will build the image and expose an HTTPS URL.

---

## Swapping the LLM Provider (e.g. to Claude)

All LLM interaction is isolated inside `app/services/ai_service.py`. To swap providers:

1. Replace the client construction in `AIService.__init__`.
2. Update `_complete` and `_complete_stream` to call the new provider's SDK.
3. Keep method signatures (`generate_chat`, `generate_summary`, etc.) unchanged.

No router, model, or prompt file needs to change.

---

## License

Proprietary — internal project.
