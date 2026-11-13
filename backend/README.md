# Voziba Backend - Learning Workspace

Welcome to your hands-on backend learning workspace! All business APIs and models have been wiped so you can design, build, and understand every layer of the architecture from scratch at your own pace.

---

## 🛠 What's Kept Intact

1. **Basic Project Structure**:
   - Next.js 15+ App Router configured with TypeScript, ESLint, and Jest.
   - MongoDB database connection with cached connection handling: [`lib/db.ts`](lib/db.ts).
   - Authentication helpers (JWT signing & verification): [`lib/jwt.ts`](lib/jwt.ts).

2. **Complete Reference Dataset**:
   - Located in [`data/initialData.ts`](data/initialData.ts).
   - Contains clean TypeScript data for:
     - `categoriesData` (10 craft categories)
     - `usersData` (consumers and artisanal business owners)
     - `worksData` (artisanal craft listings)
     - `bookingsData` (custom client orders)

3. **Interactive Swagger Documentation**:
   - Access Swagger UI in your browser at: `http://localhost:3000/docs`
   - OpenAPI specification endpoint at: `/api/docs/spec`
   - Specification blueprint defined in: [`lib/swaggerSpec.ts`](lib/swaggerSpec.ts)
   - Use Swagger as your specification blueprint to guide each route's request body and response shapes!

---

## 🚀 Running the Server

Start the development server:
```bash
npm --prefix backend run dev
# or from inside the backend directory:
cd backend && npm run dev
```

- **Root API Status**: [http://localhost:3000/](http://localhost:3000/)
- **Interactive Swagger UI**: [http://localhost:3000/docs](http://localhost:3000/docs)
- **OpenAPI Spec**: [http://localhost:3000/api/docs/spec](http://localhost:3000/api/docs/spec)

---

## 🗺 Recommended Step-by-Step Learning Path

### Step 1: Health Check Endpoint
- **Goal**: Verify your MongoDB connection works end-to-end.
- **File to create**: `app/api/health/route.ts`
- **Concept**: Connect to MongoDB with `connectDB()` and return a JSON status response (`{ status: 'ok', database: 'Connected' }`).

### Step 2: First Model & Read Endpoint (Categories)
- **Goal**: Create your first Mongoose schema and GET route.
- **Files to create**:
  - `models/Category.ts`: Define schema with `name`, `slug`, `icon`, `description`.
  - `app/api/categories/route.ts`: Export `GET()` to query categories from MongoDB.

### Step 3: User Model & Authentication
- **Goal**: Understand password hashing and JWT token issuance.
- **Files to create**:
  - `models/User.ts`: Schema with `name`, `email`, `password`, `role` (`consumer` | `business_owner`).
  - `app/api/auth/signup/route.ts`: Validate body, hash password with `bcryptjs`, create user.
  - `app/api/auth/login/route.ts`: Verify password, issue JWT using `signAccessToken()`.

### Step 4: Handiworks Listings (CRUD)
- **Goal**: Handle relational creator IDs, search keywords, and category filters.
- **Files to create**:
  - `models/Work.ts`: Schema with `title`, `creatorName`, `creatorId`, `category`, `price`, `img`.
  - `app/api/works/route.ts`: Export `GET()` (with query filter support) and `POST()` (creating a listing).

### Step 5: Bookings & Orders
- **Goal**: Manage client orders and status transitions (`Pending` -> `In Progress` -> `Completed`).
- **Files to create**:
  - `models/Booking.ts`
  - `app/api/bookings/route.ts`: `GET()` filtered by customer email or creator, and `POST()` to place bookings.

### Step 6: Database Seeding
- **Goal**: Populate MongoDB with sample data.
- **File to create**: `app/api/seed/route.ts`
- **Concept**: Import `categoriesData`, `usersData`, `worksData`, and `bookingsData` from [`data/initialData.ts`](data/initialData.ts) and batch insert with Mongoose.
