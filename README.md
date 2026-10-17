# FleetHub UI & Application

## Project Structure

```
vivid-spark-ui/
├── frontend/                 # Complete React + Vite + TanStack Start frontend application
│   ├── src/                  # React pages, components, routes, styles, and data models
│   ├── public/               # Public assets and favicon
│   ├── Dockerfile            # Container configuration for frontend
│   ├── .dockerignore         # Docker ignore rules
│   └── package.json          # Frontend dependencies and scripts
│
├── backend/                  # Node.js + Express backend service with Prisma ORM
│   ├── src/                  # API routes, controllers, services, middleware
│   ├── prisma/               # Prisma schema and generated client
│   ├── database/             # Source of truth SQL schema & seed scripts (schema.sql, seed.sql)
│   ├── Dockerfile            # Container configuration with OpenSSL
│   ├── .dockerignore         # Docker ignore rules
│   └── package.json          # Backend dependencies
│
├── docker-compose.yml        # Multi-container orchestrator (frontend, backend, db)
├── AGENTS.md                 # Lovable git protection rule
└── README.md                 # Project documentation
```

## Docker Setup

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Quick Start (Teammate / Fresh Clone)
To build and start all FleetHub services (Frontend, Express Backend, PostgreSQL DB) in one command:

```bash
docker compose up --build
```

### Useful Docker Commands:
- **Start containers in background**: `docker compose up -d`
- **Stop containers**: `docker compose stop`
- **Start stopped containers**: `docker compose start`
- **View container status**: `docker compose ps`
- **View container logs**: `docker compose logs -f`
- **Rebuild images without cache**: `docker compose build --no-cache`

### Service Endpoints & Port Mapping:
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000) (Health endpoint: `http://localhost:5000/api/health`)
- **PostgreSQL Database**: `localhost:5433` (mapped to internal container port `5432`)

### Infrastructure Notes:
- **Backend → PostgreSQL**: Connects internally using `DATABASE_URL="postgresql://postgres:postgres@db:5432/fleethub"`.
- **Host → PostgreSQL**: Accessible locally on host machine via `localhost:5433`.
- **Database Initialization & Persistence**: `./backend/database/schema.sql` and `./backend/database/seed.sql` initialize the PostgreSQL data volume on fresh startup. Normal container restarts (`docker compose stop` / `docker compose start`) preserve existing database records without re-running seed scripts.

---

## Local Development (Without Docker)

To run the application components locally outside of Docker:

### Backend:
```bash
cd backend
npm install
npm start
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```

### Available Frontend Scripts (run inside `frontend/`):
- `npm run dev`: Starts Vite development server
- `npm run build`: Compiles production build
- `npm run preview`: Previews compiled production build
- `npm run lint`: Runs ESLint checks
- `npm run format`: Formats codebase with Prettier
