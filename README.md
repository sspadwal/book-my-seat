<<<<<<< HEAD
# book-my-seat
=======
# 🎬 Cinema Seat Booking System

A full-stack cinema seat booking web application built with **React + Vite** on the frontend and **Node.js + Express + PostgreSQL** on the backend. Users can register, verify their email, log in, and book available seats in real time.

---

## 📁 Project Structure

```
Hackathon/
├── client/          # React + Vite frontend
└── server/          # Node.js + Express backend
```

---

## ✨ Features

- 🔐 **User Authentication** — Register, login, logout with JWT (access + refresh tokens)
- 📧 **Email Verification** — Account activation via Mailtrap email sandbox
- 🔑 **Password Reset** — Forgot password / reset password via email link
- 🪑 **Seat Management** — View all available and booked seats in a visual grid
- 📅 **Real-time Booking** — Book a seat instantly; the grid updates to reflect new status
- 🧑‍💼 **Protected Routes** — Seat browsing and booking require authentication
- 🎨 **Dark Mode UI** — Clean, minimalist black-and-white themed interface
- 🍞 **Toast Notifications** — Success and error feedback on every action

---

## 🛠️ Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 19, Vite, Vanilla CSS                     |
| Backend    | Node.js, Express 5                              |
| Database   | PostgreSQL                                      |
| Auth       | JWT (Access + Refresh tokens), bcrypt           |
| Email      | Nodemailer + Mailtrap SMTP sandbox              |
| Validation | Joi                                             |
| Security   | Helmet, CORS, cookie-parser                     |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) running locally
- A [Mailtrap](https://mailtrap.io/) account (free) for email sandbox

---

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Hackathon
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

#### Configure Environment Variables

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
NODE_ENV=development

# PostgreSQL connection string
POSTGRE_URI=postgresql://<user>:<password>@localhost:5432/<database>

# JWT Secrets
JWT_ACCESS_SECRET=your_access_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRES_IN=7d

# App base URL
BASE_URL=http://localhost:5000

# Mailtrap SMTP credentials
MAILTRAP_API_KEY=your_mailtrap_api_key
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
```

#### Set Up the Database

Run the following SQL scripts in your PostgreSQL client to create the required schema and tables:

**Users table** (`server/src/modules/auth/auth.model.sql`):
```sql
CREATE TABLE myapp.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'customer'
        CHECK (role IN ('customer', 'seller', 'admin')),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token TEXT,
    refresh_token TEXT,
    reset_password_token TEXT,
    reset_password_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Seats table** (from `server/index.mjs`):
```sql
CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    isbooked INT DEFAULT 0
);

-- Seed 20 seats
INSERT INTO seats (isbooked)
SELECT 0 FROM generate_series(1, 20);
```

**Bookings table** (`server/src/modules/booking/booking.model.sql`):
```sql
CREATE TABLE myapp.bookings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES myapp.users(id) ON DELETE CASCADE,
    seat_id INT NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Start the Server

```bash
npm start
```

Server runs on **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

Client runs on **http://localhost:5173**

> The Vite dev server proxies `/api` requests to the backend automatically.

---

## 📡 API Reference

### Auth Endpoints — `/api/auth`

| Method | Endpoint                  | Auth Required | Description                        |
|--------|---------------------------|---------------|------------------------------------|
| GET    | `/`                       | ❌            | Health check / greeting            |
| POST   | `/register`               | ❌            | Register a new user                |
| POST   | `/login`                  | ❌            | Login and receive tokens           |
| POST   | `/refresh`                | ❌            | Refresh access token               |
| GET    | `/me`                     | ✅            | Get current authenticated user     |
| POST   | `/logout`                 | ✅            | Logout and invalidate token        |
| GET    | `/verify-user/:id`        | ❌            | Verify email via link              |
| POST   | `/forgot-password`        | ❌            | Send password reset email          |
| POST   | `/reset-password/:id`     | ❌            | Reset password using token         |

### Booking Endpoints — `/api/bookings`

| Method | Endpoint       | Auth Required | Description                        |
|--------|----------------|---------------|------------------------------------|
| GET    | `/seats`       | ✅            | Fetch all seats and their status   |
| POST   | `/:id`         | ✅            | Book a seat by seat ID             |

---

## 🧩 Frontend Components

```
client/src/
├── App.jsx                    # Root component — auth gate + dashboard
├── api.js                     # Centralized API fetch wrapper
├── hooks/
│   ├── useAuth.js             # Authentication state & handlers
│   └── useSeats.js            # Seat fetching & booking logic
└── components/
    ├── AuthBox.jsx            # Login / Register form
    ├── DashboardHeader.jsx    # Top bar with user info & logout
    ├── SeatGrid.jsx           # Grid layout of all seats
    ├── SeatCard.jsx           # Individual seat card (available/booked)
    └── Toast.jsx              # Notification toast (success/error)
```

---

## 🗂️ Backend Architecture

```
server/src/
├── app.js                     # Express app setup (CORS, middleware, routes)
├── common/
│   ├── config/                # Database connection config
│   ├── dto/                   # Shared data transfer objects
│   ├── middleware/
│   │   ├── validate.middleware.js   # Joi request validation
│   │   └── error.middleware.js      # Global error handler
│   └── utils/                 # Shared utility helpers
└── modules/
    ├── auth/
    │   ├── auth.routes.js     # Auth route definitions
    │   ├── auth.controller.js # Auth request handlers
    │   ├── auth.service.js    # Business logic (register, login, etc.)
    │   ├── auth.middleware.js # JWT authentication guard
    │   ├── auth.model.sql     # SQL schema for users table
    │   └── dto/               # Auth DTOs (RegisterDto, LoginDto, etc.)
    └── booking/
        ├── booking.routes.js      # Booking route definitions
        ├── booking.controller.js  # Booking request handlers
        ├── booking.service.js     # Seat fetch & booking logic
        ├── booking.middleware.js  # Booking-specific middleware
        ├── booking.model.sql      # SQL schema for bookings table
        └── dto/                   # Booking DTOs
```

---

## 🔒 Authentication Flow

```
Register → Email Verification Link → Login → Access Token (15m) + Refresh Token (7d)
         ↓
    Protected routes use Bearer token in Authorization header
         ↓
    On expiry → POST /api/auth/refresh to get new access token
```

---

## 🌱 Environment Variables Reference

| Variable                | Description                              |
|-------------------------|------------------------------------------|
| `PORT`                  | Port the server runs on (default: 5000)  |
| `NODE_ENV`              | `development` or `production`            |
| `POSTGRE_URI`           | PostgreSQL connection URI                |
| `JWT_ACCESS_SECRET`     | Secret key for signing access tokens     |
| `JWT_ACCESS_EXPIRES_IN` | Access token expiry (e.g., `15m`)        |
| `JWT_REFRESH_SECRET`    | Secret key for signing refresh tokens    |
| `JWT_REFRESH_EXPIRES_IN`| Refresh token expiry (e.g., `7d`)       |
| `BASE_URL`              | Server base URL for email links          |
| `MAILTRAP_API_KEY`      | Mailtrap API key                         |
| `SMTP_HOST`             | SMTP host (Mailtrap sandbox)             |
| `SMTP_PORT`             | SMTP port                                |
| `SMTP_USER`             | SMTP username                            |
| `SMTP_PASS`             | SMTP password                            |

---

## 📜 Available Scripts

### Server

| Command       | Description              |
|---------------|--------------------------|
| `npm start`   | Start the Express server |

### Client

| Command          | Description                          |
|------------------|--------------------------------------|
| `npm run dev`    | Start Vite dev server (hot reload)   |
| `npm run build`  | Build for production                 |
| `npm run preview`| Preview the production build locally |
| `npm run lint`   | Run ESLint                           |

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.
>>>>>>> 5be5a57 (Initial commit)
