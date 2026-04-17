# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### `POST /auth/register`

Creates an admin or student account.

Student payload:

```json
{
  "name": "Ananya Sharma",
  "email": "student@college.edu",
  "password": "Student@123",
  "role": "STUDENT",
  "studentProfile": {
    "studentId": "STU-CSE-2024-010",
    "rollNumber": "23CSE010",
    "departmentId": "CSE",
    "year": 2,
    "semester": 4,
    "section": "A",
    "batchYear": 2023
  }
}
```

Admin payload:

```json
{
  "name": "Admin User",
  "email": "admin2@college.edu",
  "password": "Admin@123",
  "role": "ADMIN",
  "adminCode": "college-admin-2026"
}
```

### `POST /auth/login`

```json
{
  "email": "admin@college.edu",
  "password": "Admin@123"
}
```

### `GET /auth/me`

Returns the authenticated user profile.

## Metadata

### `GET /meta/bootstrap`

Returns departments, students, faculty, and courses for dashboard dropdowns.

## Students

### `GET /students`

Admin-only. Supports:

- `page`
- `limit`
- `search`
- `departmentId`
- `year`
- `semester`
- `section`

### `GET /students/me`

Student-only profile endpoint.

## Timetables

### `GET /timetables`

Filters:

- `departmentId`
- `year`
- `semester`
- `section`
- `dayOfWeek`

### `POST /timetables`

Admin-only. Creates class schedule entries and checks:

- room conflicts
- faculty conflicts
- class section overlap

### `PUT /timetables/:id`

Admin-only update.

### `DELETE /timetables/:id`

Admin-only delete.

## Exams

### `GET /exams`

Filters:

- `departmentId`
- `year`
- `semester`
- `section`
- `examType`
- `academicYear`

### `POST /exams`

Admin-only. Conflict checks include room, faculty, and student overlap.

## Events

### `GET /events`

Filters:

- `month=YYYY-MM-01`
- `eventType`
- `departmentId`
- `audience`

### `POST /events`

Admin-only calendar creation endpoint.

## Results

### `GET /results`

Admin sees paginated result rows. Students are automatically restricted to their own rows.

Filters:

- `page`
- `limit`
- `search`
- `semester`
- `examType`
- `studentId`
- `departmentId`

### `GET /results/me`

Student result sheet with:

- semester summaries
- subject rows
- SGPA
- CGPA
- overall percentage

### `GET /results/student/:studentId`

Admin/student result sheet endpoint. Students can only read their own record.

### `POST /results`

Admin-only upsert endpoint for one result row.

### `POST /results/bulk`

Admin-only bulk upload endpoint.

```json
{
  "results": [
    {
      "studentId": "665f0...",
      "courseId": "665f1...",
      "examId": "665f2...",
      "academicYear": "2025-2026",
      "semester": 4,
      "marks": {
        "internal": 18,
        "external": 56,
        "practical": 0
      }
    }
  ]
}
```

### `GET /results/rankings`

Supports:

- `departmentId`
- `year`
- `semester`
- `limit`

### `GET /results/export/csv`

Admin-only authenticated CSV export.

## Analytics

### `GET /analytics/overview`

Returns KPI cards for dashboard summary.

### `GET /analytics/top-students`

Aggregation-backed topper list.

### `GET /analytics/best-classes`

Average marks grouped by class.

### `GET /analytics/subject-performance`

Subject average marks and pass rate.

### `GET /analytics/department-comparison`

Department-wise performance comparison.
