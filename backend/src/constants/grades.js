export const GRADE_SCALE = [
  { min: 90, grade: "O", gradePoint: 10 },
  { min: 80, grade: "A+", gradePoint: 9 },
  { min: 70, grade: "A", gradePoint: 8 },
  { min: 60, grade: "B+", gradePoint: 7 },
  { min: 50, grade: "B", gradePoint: 6 },
  { min: 45, grade: "C", gradePoint: 5 },
  { min: 40, grade: "P", gradePoint: 4 },
  { min: 0, grade: "F", gradePoint: 0 }
];

export const GRADE_VALUES = GRADE_SCALE.map((item) => item.grade);
