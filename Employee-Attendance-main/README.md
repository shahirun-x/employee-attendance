# Employee Attendance Management System

A full-stack web application for managing employee attendance with role-based access for employees and managers.

## Tech Stack

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT Authentication  
**Frontend:** React 18, Redux Toolkit, Tailwind CSS, Vite  

## Project Structure

```
Employee_attendance/
├── backend/
│   ├── config/          # Database connection, constants
│   ├── controllers/     # Request handlers (thin layer)
│   ├── middleware/       # Auth, error handling
│   ├── models/          # Mongoose schemas (User, Attendance, Counter)
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic layer
│   ├── utils/           # Helpers, API response, custom errors
│   ├── validators/      # Request validation
│   ├── seed.js          # Database seeder
│   ├── server.js        # Entry point
│   └── .env.example     # Environment variables template
│
└── frontend/
    └── src/
        ├── components/  # Reusable UI components
        │   ├── attendance/  # CalendarView, TableView
        │   ├── auth/        # ProtectedRoute
        │   ├── layout/      # Sidebar, Header, AppLayout
        │   └── ui/          # Button, Card, Badge, Input, etc.
        ├── pages/       # Route-level page components
        ├── store/       # Redux Toolkit (slices)
        ├── services/    # Axios API client
        └── utils/       # Constants, formatters, validators
```

## Features

### Employee
- Register / Login with JWT authentication
- Mark attendance (Check In / Check Out)
- Dashboard with today's status, monthly stats, recent records
- Attendance history with interactive calendar view and table view
- Click any date on calendar to see detailed check-in/out info
- Monthly summary with status breakdown
- Profile page

### Manager
- Dashboard with team overview (present/absent/late counts)
- Weekly trend chart and department-wise stats
- All attendance records with filters and pagination
- Team calendar view with per-employee monthly breakdown
- Reports page with date range & employee filters
- CSV export of attendance data

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone the repository

```bash
git clone <repo-url>
cd Employee_attendance
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your values:
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/<dbname>
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
OFFICE_START_HOUR=9
LATE_THRESHOLD_MINUTES=15
MIN_FULL_DAY_HOURS=6
MIN_HALF_DAY_HOURS=4
```

### 3. Seed the Database (optional)

```bash
node seed.js
```

This creates:
- 2 employees (nikhil@company.com, altaf@company.com)
- 1 manager (manager@company.com)
- Attendance records for the current month with realistic present/late/half-day distribution
- Password for all users: `password123`

### 4. Start the Backend

```bash
npm run dev
```

Server runs at `http://localhost:5000`

### 5. Frontend Setup

```bash
cd ../frontend
npm install
```

### 6. Start the Frontend

```bash
npm run dev
```

App runs at `http://localhost:3000`

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Backend server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | — |
| `JWT_SECRET` | Secret key for JWT tokens | — |
| `JWT_EXPIRES_IN` | Token expiry duration | 7d |
| `OFFICE_START_HOUR` | Office start hour (24h) | 9 |
| `LATE_THRESHOLD_MINUTES` | Minutes after start to mark late | 15 |
| `MIN_FULL_DAY_HOURS` | Min hours for full-day attendance | 6 |
| `MIN_HALF_DAY_HOURS` | Min hours for half-day attendance | 4 |

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/me` | Get current user profile | Yes |

### Attendance (Employee)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/attendance/checkin` | Check in | Employee |
| POST | `/api/attendance/checkout` | Check out | Employee |
| GET | `/api/attendance/today` | Today's attendance status | Employee |
| GET | `/api/attendance/my-history` | Attendance history (paginated) | Employee |
| GET | `/api/attendance/my-summary` | Monthly summary stats | Employee |

### Attendance (Manager)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/attendance/all` | All attendance records (filtered) | Manager |
| GET | `/api/attendance/employee/:id` | Specific employee's records | Manager |
| GET | `/api/attendance/summary` | Team monthly summary | Manager |
| GET | `/api/attendance/export` | Export attendance as CSV | Manager |
| GET | `/api/attendance/today-status` | Today's team status breakdown | Manager |

### Dashboard
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/dashboard/employee` | Employee dashboard data | Employee |
| GET | `/api/dashboard/manager` | Manager dashboard data | Manager |

### API Response Format

All endpoints return a consistent format:

```json
{
  "success": true,
  "message": "Description of result",
  "data": { }
}
```

## Screenshots

### Employee Dashboard
![Employee Dashboard](screenshots/employee-dashboard.png)

### Attendance History (Calendar View)
![Attendance History](screenshots/attendance-history.png)

### Manager Dashboard
![Manager Dashboard](screenshots/manager-dashboard.png)

### Reports Page
![Reports Page](screenshots/reports-page.png)
