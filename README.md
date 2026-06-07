# College Academic and Examination Management System

A full-stack college management web application for handling academic operations such as timetables, exams, events, student results, performance analytics, and role-based dashboards.

## Live Demo

- Frontend: https://college-management-system-lovat-eight.vercel.app/login
- Backend API: https://college-management-system-6rhr.onrender.com/api

## Demo Credentials

```text
Admin
Email: admin@college.edu
Password: Admin@123
```

```text
Student
Email: student1@college.edu
Password: Student@123
```

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Recharts
- Backend: Node.js, Express.js
- Database: MongoDB Atlas / MongoDB local
- ODM: Mongoose
- Authentication: JWT with role-based access control
- Deployment: Vercel for frontend, Render for backend

## Features

- Secure login and registration with JWT authentication.
- Separate `ADMIN` and `STUDENT` dashboards.
- Protected routes based on user role.
- Admin dashboard for academic overview and analytics.
- Student dashboard for personal academic information.
- Timetable management for classes and exams.
- Conflict detection for room, faculty, and class schedule clashes.
- Academic calendar with events, holidays, and academic milestones.
- Result management with marks entry, bulk upload support, and rankings.
- Student result view with SGPA, CGPA, percentage, grade, and status.
- Analytics for toppers, best classes, subject performance, and department comparison.
- Search, filters, pagination, and CSV export support for result workflows.
- Seed script for generating demo departments, faculty, courses, students, timetables, exams, events, and results.

## Main Screens

Admin:

- `/admin` - Admin overview dashboard
- `/admin/timetable` - Manage class timetables and exam schedules
- `/admin/results` - Manage results, rankings, and result exports
- `/admin/events` - Manage academic calendar events

Student:

- `/student` - Student overview dashboard
- `/student/timetable` - View timetable
- `/student/results` - View results and grade summary
- `/student/calendar` - View academic calendar

Public:

- `/login` - Login page
- `/register` - Registration page

## Project Structure

```text
backend/
  src/
    config/
    constants/
    controllers/
    data/
    middleware/
    models/
    routes/
    scripts/
    services/
    utils/
    validations/

frontend/
  src/
    components/
    context/
    hooks/
    pages/
    routes/
    services/
    utils/

docs/
```

## Local Setup

### Backend

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college_management_system
JWT_SECRET=replace-with-a-strong-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_REGISTRATION_CODE=college-admin-2026
```

Run the backend:

```bash
cd backend
npm install
npm run seed
npm run start
```

### Frontend

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173/login
```

## Deployment Notes

Frontend production API URL is configured in:

```text
frontend/.env.production
```

Current production value:

```env
VITE_API_URL=https://college-management-system-6rhr.onrender.com/api
```

Vercel uses `frontend/vercel.json` to support React Router direct links such as `/login`, `/admin`, and `/student`.

Render backend environment variables should include:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/college_management_system?retryWrites=true&w=majority
JWT_SECRET=<strong-secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://college-management-system-lovat-eight.vercel.app
ADMIN_REGISTRATION_CODE=college-admin-2026
```

## Important API Areas

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `GET /api/meta/bootstrap`
- `GET /api/students`
- `GET /api/timetables`
- `GET /api/exams`
- `GET /api/events`
- `POST /api/results/bulk`
- `GET /api/results/me`
- `GET /api/results/rankings`
- `GET /api/analytics/overview`

More API details are available in [docs/api-docs.md](docs/api-docs.md).

## Sample Data

The seed script creates:

- Departments
- Faculty members
- Courses
- Admin and student accounts
- Student profiles
- Timetable entries
- Exam schedules
- Calendar events
- Result rows for analytics and rankings

Seed file:

```text
backend/src/scripts/seed.js
```
