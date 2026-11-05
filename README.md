# JobTrack AI: Job Tracker & AI Interview Assistant

A full-stack MERN app to track job applications, practise AI-generated mock interviews for each role, and plan your prep on a kanban task board.

## Features

- **Authentication**: register / login with bcrypt-hashed passwords and JWT stored in an HTTP-only cookie
- **Application tracker**: add jobs with a description, update status (Applied, Interviewing, Offered, Rejected), delete, and see summary counts
- **AI mock interviews**: Gemini generates role-specific questions from the job description, then gives feedback on your answers
- **Task tracker**: drag-and-drop kanban board (backlog to completed) with LeetCode-specific fields

## Tech stack

| Layer | Tech |
| --- | --- |
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, @hello-pangea/dnd |
| Backend | Node.js, Express, JWT, bcryptjs |
| Database | MongoDB with Mongoose, **MongoDB Atlas** |
| AI | Google Gemini API |

## Project structure

```
index.js          Express entry point
server/           routes, models, auth middleware, AI service
frontend/         Next.js app (src/app)
```

## Run locally

Requires Node 20+ and a MongoDB database (Atlas works).

```bash
# 1. Backend (project root)
cp .env.example .env        # fill in MONGODB_URI, JWT_SECRET, GEMINI_API_KEY
npm install
node .                      # http://localhost:8000

# 2. Frontend
cd frontend
npm install
npm run dev                 # http://localhost:3000
```

## API overview

| Method | Route | Description |
| --- | --- | --- |
| POST | `/register`, `/login`, `/logout` | Auth |
| GET | `/user/me` | Current user |
| GET / POST | `/jobs` | List / create applications |
| PUT / DELETE | `/jobs/:id` | Update / delete an application |
| GET / POST | `/jobs/:id/interview-prep` | Saved / newly generated questions |
| POST | `/jobs/:id/interview-feedback` | AI feedback on an answer |
| GET / POST / PUT / DELETE | `/tasks` | Kanban tasks |
| PATCH | `/tasks/reorder` | Save drag-and-drop order |

## Deployment

- **Backend** (Render, Railway, etc.): deploy the repo root, start command `node .`, set `MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `NODE_ENV=production`, `CLIENT_URL=<your frontend URL>`.
- **Frontend** (Vercel): set the root directory to `frontend` and add `NEXT_PUBLIC_API_URL=/api` and `BACKEND_URL=<your backend URL>`. Requests to `/api/*` are proxied to the backend so the auth cookie works in all browsers.
