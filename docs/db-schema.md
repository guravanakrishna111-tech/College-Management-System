# Database Schema Notes

## Collections

### `departments`

- `name`
- `code`
- `hodName`
- `establishedYear`

Indexes:

- `code` unique

### `faculty`

- `employeeId`
- `name`
- `email`
- `departmentId`
- `designation`

Indexes:

- `employeeId` unique
- `email` unique
- `departmentId`

### `courses`

- `code`
- `name`
- `departmentId`
- `year`
- `semester`
- `credits`
- `facultyId`

Indexes:

- `code` unique
- compound index on `departmentId + year + semester`

### `users`

- `name`
- `email`
- `password`
- `role`
- `studentProfile`

Indexes:

- `email` unique
- sparse unique index on `studentProfile`

### `students`

- `userId`
- `studentId`
- `rollNumber`
- `name`
- `email`
- `departmentId`
- `year`
- `semester`
- `section`
- `batchYear`

Indexes:

- `studentId` unique
- `rollNumber` unique
- `email` unique
- compound index on `departmentId + year + semester + section`

### `timetables`

- `courseId`
- `facultyId`
- `departmentId`
- `year`
- `semester`
- `section`
- `dayOfWeek`
- `period`
- `startTime`
- `endTime`
- `room`

Indexes:

- compound unique index on `departmentId + year + semester + section + dayOfWeek + period`
- `facultyId + dayOfWeek + startTime + endTime`
- `room + dayOfWeek + startTime + endTime`

### `exams`

- `examId`
- `courseId`
- `departmentId`
- `facultyId`
- `year`
- `semester`
- `section`
- `examType`
- `academicYear`
- `date`
- `startTime`
- `endTime`
- `room`

Indexes:

- `examId` unique
- `courseId`
- `date + room + startTime + endTime`

### `events`

- `title`
- `description`
- `eventType`
- `startDate`
- `endDate`
- `venue`
- `audience`
- `departmentId`
- `createdBy`

Indexes:

- `startDate + endDate + eventType`

### `results`

One document per `student-course-exam` combination.

- `studentId`
- `courseId`
- `examId`
- `departmentId`
- `academicYear`
- `semester`
- `examType`
- `marks.internal`
- `marks.external`
- `marks.practical`
- `totalMarks`
- `maxMarks`
- `credits`
- `percentage`
- `grade`
- `gradePoint`
- `status`

Indexes:

- `studentId`
- `courseId`
- `examId`
- compound unique index on `studentId + courseId + examId`
- compound index on `departmentId + semester`

## Scaling Decisions

- References are used for students, departments, faculty, courses, and exams to avoid deep nesting.
- Result rows are normalized to support fast aggregation for topper lists, GPA reports, and exports.
- Aggregation pipelines power rankings, class averages, subject statistics, and department comparisons.
- Search and pagination happen at the query layer to keep result sets manageable for large colleges.
