# College Academic and Examination Management System

Full-stack application for centralized college timetable, exam, calendar, result, and analytics management.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- ODM: Mongoose

## Key Features

- JWT authentication with role-based access for `ADMIN` and `STUDENT`
- Class timetable and exam scheduling with conflict detection
- Academic calendar for events, holidays, and academic milestones
- Result upload, SGPA/CGPA calculation, percentage calculation, and rank lists
- Analytics for toppers, best classes, subject performance, and department comparison
- Search, filter, pagination, and CSV export for result management
- Seed script with demo data for fast local testing

## Project Structure

```text
backend/
  src/
    config/ controllers/ middleware/ models/ routes/ services/ utils/ validations/
frontend/
  src/
    components/ context/ hooks/ pages/ routes/ services/ utils/
docs/
```

## Local Setup

### Backend

1. Open `backend/.env` and update values if needed.
2. Install dependencies:
   `npm install`
3. Seed demo data:
   `npm run seed`
4. Start the API:
   `npm run dev`

### Frontend

1. Open `frontend/.env` and confirm `VITE_API_URL=http://localhost:5000/api`
2. Install dependencies:
   `npm install`
3. Start the frontend:
   `npm run dev`

## Demo Credentials

- Admin: `admin@college.edu` / `Admin@123`
- Student: `student1@college.edu` / `Student@123`

## Important API Areas

- `POST /api/auth/login`
- `GET /api/meta/bootstrap`
- `GET /api/timetables`
- `GET /api/exams`
- `GET /api/events`
- `POST /api/results/bulk`
- `GET /api/results/me`
- `GET /api/analytics/overview`

More detail is available in `docs/api-docs.md`.

## Sample Data

The seed script creates:

- Departments
- Faculty
- Courses
- Admin and student accounts
- Timetable entries
- Exam schedules
- Calendar events
- Result rows for analytics

Seed file: `backend/src/scripts/seed.js`
