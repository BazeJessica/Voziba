# Voziba Workspace

Voziba is an artisanal handiwork marketplace platform. The project is cleanly separated into two distinct sub-systems with full Docker containerization support and GitHub Actions CI pipelines:

```
Voziba Workspace
├── .github/workflows/ci.yml  # GitHub Actions CI pipeline (Linting, Testing, Building, Docker validation)
├── docker-compose.yml        # Docker Compose configuration for full-stack orchestration
├── frontend/                 # Angular frontend application (UI, components, styles, routes, Nginx)
└── backend/                  # Next.js API server & MongoDB database integration
```

---

## 🚀 Dummy Seed Data & Latency Benchmark APIs

The backend provides built-in endpoints for seeding rich dummy data and testing application response latency:

### 1. Seed Relational Dummy Dataset
- **URL**: `GET /api/seed` or `POST /api/seed`
- **Description**: Populates MongoDB with relational ObjectIDs across Categories, Users (Consumers & Business Owners), Handiwork listings, and Active Bookings.
- **Curl Command**:
  ```bash
  curl -X GET http://localhost:3001/api/seed
  ```

### 2. Latency & Performance Benchmark Diagnostic
- **URL**: `GET /api/benchmark`
- **Description**: Measures MongoDB connection ping time (`dbPingMs`), query execution latency (`worksQueryMs`, `categoriesQueryMs`, `bookingsQueryMs`), total server processing time (`totalServerLatencyMs`), and memory usage.
- **Curl Command**:
  ```bash
  curl -X GET http://localhost:3001/api/benchmark
  ```

---

## 🤖 GitHub Actions CI Pipeline

The project includes an automated GitHub Actions CI workflow (`.github/workflows/ci.yml`) triggered on pushes and pull requests to `main`, `master`, and `develop` branches:

1. **`backend-ci`**: Installs dependencies, runs ESLint checks, runs Jest unit tests, and builds Next.js.
2. **`frontend-ci`**: Installs dependencies, runs ESLint checks, and builds the Angular application.
3. **`docker-ci`**: Validates `docker-compose.yml` configuration and tests Docker image builds for frontend and backend.

---

## 🐳 Running with Docker (Recommended)

To spin up the entire Voziba platform (MongoDB + Next.js API + Angular Web App) using Docker Compose:

```bash
# Build and start all services in the background
docker compose up -d --build

# View logs from all running containers
docker compose logs -f

# Stop all container services
docker compose down
```

### Services & Exposed Ports:
- **Frontend App (Angular + Nginx)**: [http://localhost:4200](http://localhost:4200)
- **Backend API (Next.js)**: [http://localhost:3001](http://localhost:3001)
- **Database (MongoDB)**: `localhost:27017`

---

## 🎨 Frontend (Angular App)

Located in `frontend/`:

- **Framework**: Angular v21 (NgModule architecture)
- **Styling**: Vanilla SCSS, CSS Variables, Angular Material
- **Features**: Role-based Consumer Profile vs Business Owner Dashboard, Handiwork listings, Booking modals, Admin Portal.

### Development & Lint Commands:
```bash
cd frontend
npm start        # Start local dev server (http://localhost:4200/)
npm run lint     # Run ESLint checks across TypeScript components
npm run build    # Build production bundle
```

---

## ⚙️ Backend (Next.js & MongoDB API)

Located in `backend/`:

- **Framework**: Next.js (App Router)
- **Database**: MongoDB (Mongoose driver)
- **Features**: User authentication APIs, Handiwork listings API, Custom order bookings API, Craft categories API, Latency benchmark API, Swagger API docs.

### Development & Lint Commands:
```bash
cd backend
npm run dev      # Start local dev server (http://localhost:3001/)
npm run lint     # Run ESLint checks across API routes and models
npm test         # Run Jest tests
npm run build    # Build Next.js app
```
