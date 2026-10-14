# Campus AI Assistant

Hands-on full-stack workshop app with three roles:

- **Admin** configures departments, users, courses, and enrollments
- **Faculty** uploads course files into a RAG ingest pipeline
- **Student** chats against materials for courses they are enrolled in

## Stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, TypeScript
- Database: MySQL + Sequelize migrations

## Setup

1. Create a MySQL database named `campus_ai`.
2. Copy `Backend/.env.example` to `Backend/.env` and set `DB_*` plus `OPENAI_API_KEY`.
3. Install and migrate:

```bash
cd Backend
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev
```

```bash
cd Frontend
npm install
npm run dev
```

Open http://localhost:5173

## Demo accounts

Password for all seeded users: `Workshop123!`

- admin@campus.edu
- faculty@campus.edu
- student@campus.edu

Student chat requires a faculty-uploaded file that has finished ingesting (`ready`) and a server-side `OPENAI_API_KEY`.
