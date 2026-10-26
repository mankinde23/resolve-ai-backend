# Resolve AI — Backend API

Resolve AI is an AI-powered support-ticket classification and triage application. This repository contains the Node.js and Express API that validates requests, calls the Python ML service, and persists successful classifications in PostgreSQL.

## Phase One capabilities

- REST API built with Express and TypeScript.
- Request validation with Zod.
- Calls the separate Python FastAPI service for predictions.
- Persists classified tickets with Prisma ORM and PostgreSQL.
- Provides ticket creation, paginated listing, and ticket-detail endpoints.
- Centralized error handling, security headers, configurable CORS, and structured request logging.
- Unit and integration tests.

## Architecture

```text
React + TypeScript frontend
          |
          | HTTP / JSON
          v
Node.js + Express backend
       /           \
      /             \
     v               v
Python FastAPI    Prisma ORM
ML service            |
                      v
                  PostgreSQL
```

The backend is the application API boundary. The frontend does not connect directly to PostgreSQL or the ML service.

## Technology

- Node.js and TypeScript
- Express
- Zod
- Prisma ORM
- PostgreSQL
- Pino / pino-http
- Vitest and Supertest

## Requirements

- A supported Node.js LTS release
- npm
- Docker Desktop (for local PostgreSQL)
- The Resolve AI ML service running locally

## Environment configuration

Create `.env` in this repository. Adjust the password to match your local PostgreSQL container.

```dotenv
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:5173
ML_SERVICE_URL=http://localhost:8000
ML_SERVICE_TIMEOUT_MS=5000
resolve_ai
```



## Start local PostgreSQL

If the existing `resolve-ai-postgres` container is already running, keep using it. The current local mapping is host port `5433` to container port `5432`.

For a new local development database, a command similar to this can be used (choose your own local password and keep it consistent with `DATABASE_URL`):

```powershell
docker run --name resolve-ai-postgres `
  -e POSTGRES_USER=resolve_user `
  -e POSTGRES_PASSWORD=YOUR_LOCAL_PASSWORD `
  -e POSTGRES_DB=resolve_ai `
  -p 5433:5432 `
  -v resolve-ai-postgres-data:/var/lib/postgresql/data `
  -d postgres:16
```

Do not delete the container or its volume to troubleshoot ordinary connection issues; inspect the error and container logs first.

## Install and run

```bash
npm install
npm run dev
```

The API listens on `http://localhost:3000` by default.

## Prisma

The Prisma schema is in `prisma/schema.prisma`. The project uses Prisma's PostgreSQL adapter and a shared Prisma client.

After changing the Prisma schema, regenerate the client:

```bash
npx prisma generate
```

The existing local `tickets` table was created and introspected during Phase One. The initial SQL is maintained in `database/migrations/001_create_tickets.sql` if that file exists in your checkout.

Before applying schema changes to an existing or production database, review the generated migration SQL and back up important data. Do not run destructive schema commands against data you need to preserve.

## API endpoints

Base URL: `http://localhost:3000/api/v1`

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/health` | Check backend health |
| `POST` | `/predictions` | Run a prediction without persisting a ticket |
| `POST` | `/tickets` | Classify a ticket and persist the prediction |
| `GET` | `/tickets?limit=10&offset=0` | List tickets with pagination |
| `GET` | `/tickets/:id` | Retrieve a ticket by UUID |

### Create and classify a ticket

```powershell
$body = @{
  text = "I cannot reset my account password."
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:3000/api/v1/tickets" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

A successful creation returns the persisted ticket, including its ID, text, predicted category, model version, confidence, and creation timestamp.

### List tickets

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:3000/api/v1/tickets?limit=10&offset=0"
```

## Development checks

```bash
npm run build
npm test
```

## Design decisions

- **Separate ML service:** isolates model inference and lets the API and model service evolve independently.
- **Prisma:** provides typed database access from TypeScript and a clear schema representation.
- **Validation at the API boundary:** rejects invalid requests before invoking downstream services.
- **Persist only after successful classification:** avoids saving a normal ticket record when inference fails.
- **Pagination:** prevents ticket history endpoints from returning an unbounded number of records.

## Known scope boundaries

Phase One is a local end-to-end implementation, not a claim of production deployment. Authentication, authorization, rate limiting, production secrets management, monitoring, deployment automation, and deeper model evaluation should be addressed before a public production release.
