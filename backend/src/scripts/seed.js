import connectDB from "../config/db.js";
import { DEFAULT_DEPARTMENTS } from "../constants/departments.js";
import { ROLES } from "../constants/roles.js";
import { demoCredentials } from "../data/sampleData.js";
import Course from "../models/Course.js";
import Department from "../models/Department.js";
import Event from "../models/Event.js";
import Exam from "../models/Exam.js";
import Faculty from "../models/Faculty.js";
import Result from "../models/Result.js";
import Student from "../models/Student.js";
import Timetable from "../models/Timetable.js";
import User from "../models/User.js";
import { calculateGradeMetrics } from "../utils/gradeCalculator.js";

const resetCollections = async () => {
  await Promise.all([
    User.deleteMany({}),
    Student.deleteMany({}),
    Faculty.deleteMany({}),
    Course.deleteMany({}),
    Department.deleteMany({}),
    Timetable.deleteMany({}),
    Exam.deleteMany({}),
    Event.deleteMany({}),
    Result.deleteMany({})
  ]);
};

const buildResultDocument = (payload) => {
  const metrics = calculateGradeMetrics({
    internalMarks: payload.marks.internal,
    externalMarks: payload.marks.external,
    practicalMarks: payload.marks.practical,
    maxMarks: 100
  });

  return {
    ...payload,
    totalMarks: metrics.totalMarks,
    maxMarks: 100,
    percentage: metrics.percentage,
    grade: metrics.grade,
    gradePoint: metrics.gradePoint,
    status: metrics.status
  };
};

const seed = async () => {
  await connectDB();
  await resetCollections();

  const departments = await Department.insertMany(
    DEFAULT_DEPARTMENTS.map((department, index) => ({
      ...department,
      hodName: `Dr. Department Head ${index + 1}`,
      establishedYear: 2000 + index
    }))
  );

  const cseDepartment = departments.find((department) => department.code === "CSE");
  const eceDepartment = departments.find((department) => department.code === "ECE");

  const faculty = await Faculty.insertMany([
    {
      employeeId: "FAC-CSE-001",
      name: "Dr. Asha Menon",
      email: "asha.menon@college.edu",
      departmentId: cseDepartment._id
    },
    {
      employeeId: "FAC-CSE-002",
      name: "Prof. Ravi Kumar",
      email: "ravi.kumar@college.edu",
      departmentId: cseDepartment._id
    },
    {
      employeeId: "FAC-ECE-001",
      name: "Dr. Nitin Rao",
      email: "nitin.rao@college.edu",
      departmentId: eceDepartment._id
    }
  ]);

  const courses = await Course.insertMany([
    {
      code: "CSE401",
      name: "Database Management Systems",
      departmentId: cseDepartment._id,
      year: 2,
      semester: 4,
      credits: 4,
      facultyId: faculty[0]._id
    },
    {
      code: "CSE402",
      name: "Operating Systems",
      departmentId: cseDepartment._id,
      year: 2,
      semester: 4,
      credits: 4,
      facultyId: faculty[1]._id
    },
    {
      code: "ECE401",
      name: "Digital Signal Processing",
      departmentId: eceDepartment._id,
      year: 2,
      semester: 4,
      credits: 4,
      facultyId: faculty[2]._id
    }
  ]);

  const admin = await User.create({
    name: "System Administrator",
    email: demoCredentials.admin.email,
    password: demoCredentials.admin.password,
    role: ROLES.ADMIN
  });

  const studentUser = await User.create({
    name: "Ananya Sharma",
    email: demoCredentials.student.email,
    password: demoCredentials.student.password,
    role: ROLES.STUDENT
  });

  const studentFirstNames = [
    "Aarav",
    "Anika",
    "Dev",
    "Isha",
    "Kabir",
    "Riya",
    "Soham",
    "Tara",
    "Nikhil",
    "Maya",
    "Vikram",
    "Sanya",
    "Aman",
    "Diya",
    "Neha",
    "Rohan",
    "Priya",
    "Kavya",
    "Samarth",
    "Lina"
  ];

  const studentLastNames = [
    "Sharma",
    "Patel",
    "Kumar",
    "Rao",
    "Verma",
    "Singh",
    "Nair",
    "Mehta",
    "Joshi",
    "Bhat",
    "Chopra",
    "Iyer",
    "Garg",
    "Gupta",
    "Sen"
  ];

  const sectionOptions = ["A", "B", "C"];

  const studentEntries = [
    {
      userId: studentUser._id,
      studentId: "STU-CSE-2024-001",
      rollNumber: "23CSE001",
      name: "Ananya Sharma",
      email: demoCredentials.student.email,
      departmentId: cseDepartment._id,
      year: 2,
      semester: 4,
      section: "A",
      batchYear: 2023
    },
    {
      studentId: "STU-CSE-2024-002",
      rollNumber: "23CSE002",
      name: "Rahul Verma",
      email: "student2@college.edu",
      departmentId: cseDepartment._id,
      year: 2,
      semester: 4,
      section: "A",
      batchYear: 2023
    },
    {
      studentId: "STU-ECE-2024-001",
      rollNumber: "23ECE001",
      name: "Meera Das",
      email: "student3@college.edu",
      departmentId: eceDepartment._id,
      year: 2,
      semester: 4,
      section: "A",
      batchYear: 2023
    }
  ];

  const extraStudents = Array.from({ length: 47 }, (_, index) => {
    const department = departments[index % departments.length];
    const year = 1 + Math.floor(index / departments.length) % 4;
    const semester = year * 2 - 1 + (index % 2);
    const section = sectionOptions[index % sectionOptions.length];
    const batchYear = 2025 - (year - 1);
    const firstName = studentFirstNames[index % studentFirstNames.length];
    const lastName = studentLastNames[(index + 3) % studentLastNames.length];
    const studentNumber = String(index + 4).padStart(3, "0");

    return {
      studentId: `STU-${department.code}-${batchYear}-${studentNumber}`,
      rollNumber: `${String(23 + year).padStart(2, "0")}${department.code}${studentNumber}`,
      name: `${firstName} ${lastName}`,
      email: `student${index + 4}@college.edu`,
      departmentId: department._id,
      year,
      semester,
      section,
      batchYear
    };
  });

  const students = await Student.insertMany([...studentEntries, ...extraStudents]);

  studentUser.studentProfile = students[0]._id;
  await studentUser.save();

  await Timetable.insertMany([
    {
      entryType: "CLASS",
      courseId: courses[0]._id,
      facultyId: faculty[0]._id,
      departmentId: cseDepartment._id,
      year: 2,
      semester: 4,
      section: "A",
      dayOfWeek: "Monday",
      period: 1,
      startTime: "09:00",
      endTime: "09:55",
      room: "A-201"
    },
    {
      entryType: "CLASS",
      courseId: courses[1]._id,
      facultyId: faculty[1]._id,
      departmentId: cseDepartment._id,
      year: 2,
      semester: 4,
      section: "A",
      dayOfWeek: "Monday",
      period: 2,
      startTime: "10:00",
      endTime: "10:55",
      room: "A-201"
    },
    {
      entryType: "CLASS",
      courseId: courses[2]._id,
      facultyId: faculty[2]._id,
      departmentId: eceDepartment._id,
      year: 2,
      semester: 4,
      section: "A",
      dayOfWeek: "Tuesday",
      period: 1,
      startTime: "09:00",
      endTime: "09:55",
      room: "E-104"
    }
  ]);

  const exams = await Exam.insertMany([
    {
      examId: "MID-CSE401-2026",
      courseId: courses[0]._id,
      departmentId: cseDepartment._id,
      facultyId: faculty[0]._id,
      year: 2,
      semester: 4,
      section: "A",
      examType: "MID_SEM",
      academicYear: "2025-2026",
      date: new Date("2026-05-10"),
      startTime: "10:00",
      endTime: "12:00",
      room: "Exam Hall 1"
    },
    {
      examId: "END-CSE402-2026",
      courseId: courses[1]._id,
      departmentId: cseDepartment._id,
      facultyId: faculty[1]._id,
      year: 2,
      semester: 4,
      section: "A",
      examType: "END_SEM",
      academicYear: "2025-2026",
      date: new Date("2026-06-20"),
      startTime: "14:00",
      endTime: "17:00",
      room: "Exam Hall 2"
    },
    {
      examId: "MID-ECE401-2026",
      courseId: courses[2]._id,
      departmentId: eceDepartment._id,
      facultyId: faculty[2]._id,
      year: 2,
      semester: 4,
      section: "A",
      examType: "MID_SEM",
      academicYear: "2025-2026",
      date: new Date("2026-05-11"),
      startTime: "10:00",
      endTime: "12:00",
      room: "Exam Hall 3"
    }
  ]);

  await Event.insertMany([
    {
      title: "Annual Sports Meet",
      description: "Inter-department sports events across the campus",
      eventType: "EVENT",
      startDate: new Date("2026-04-18"),
      endDate: new Date("2026-04-20"),
      venue: "Main Ground",
      colorTag: "#2563eb",
      createdBy: admin._id
    },
    {
      title: "Summer Break",
      description: "Semester-end vacation",
      eventType: "HOLIDAY",
      startDate: new Date("2026-06-25"),
      endDate: new Date("2026-07-05"),
      venue: "Campus",
      colorTag: "#16a34a",
      createdBy: admin._id
    },
    {
      title: "Result Publication",
      description: "Semester result release window",
      eventType: "ACADEMIC",
      startDate: new Date("2026-07-15"),
      endDate: new Date("2026-07-15"),
      venue: "Academic Office",
      colorTag: "#d97706",
      createdBy: admin._id
    }
  ]);

  await Result.insertMany([
    buildResultDocument({
      studentId: students[0]._id,
      courseId: courses[0]._id,
      examId: exams[0]._id,
      departmentId: cseDepartment._id,
      academicYear: "2025-2026",
      semester: 4,
      examType: "MID_SEM",
      marks: { internal: 18, external: 56, practical: 0 },
      credits: 4
    }),
    buildResultDocument({
      studentId: students[0]._id,
      courseId: courses[1]._id,
      examId: exams[1]._id,
      departmentId: cseDepartment._id,
      academicYear: "2025-2026",
      semester: 4,
      examType: "END_SEM",
      marks: { internal: 19, external: 62, practical: 0 },
      credits: 4
    }),
    buildResultDocument({
      studentId: students[1]._id,
      courseId: courses[0]._id,
      examId: exams[0]._id,
      departmentId: cseDepartment._id,
      academicYear: "2025-2026",
      semester: 4,
      examType: "MID_SEM",
      marks: { internal: 17, external: 52, practical: 0 },
      credits: 4
    }),
    buildResultDocument({
      studentId: students[2]._id,
      courseId: courses[2]._id,
      examId: exams[2]._id,
      departmentId: eceDepartment._id,
      academicYear: "2025-2026",
      semester: 4,
      examType: "MID_SEM",
      marks: { internal: 16, external: 58, practical: 0 },
      credits: 4
    })
  ]);

  console.log("Seed completed successfully");
  console.log("Admin login:", demoCredentials.admin);
  console.log("Student login:", demoCredentials.student);
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
