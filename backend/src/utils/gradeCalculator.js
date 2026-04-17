import { GRADE_SCALE } from "../constants/grades.js";

export const calculatePercentage = (obtainedMarks, maxMarks = 100) => {
  if (!maxMarks) {
    return 0;
  }

  return Number(((obtainedMarks / maxMarks) * 100).toFixed(2));
};

export const getGradeFromPercentage = (percentage) => {
  return GRADE_SCALE.find((item) => percentage >= item.min) || GRADE_SCALE.at(-1);
};

export const calculateGradeMetrics = ({
  internalMarks = 0,
  externalMarks = 0,
  practicalMarks = 0,
  maxMarks = 100
}) => {
  const totalMarks = Number(internalMarks) + Number(externalMarks) + Number(practicalMarks);
  const percentage = calculatePercentage(totalMarks, maxMarks);
  const { grade, gradePoint } = getGradeFromPercentage(percentage);

  return {
    totalMarks,
    percentage,
    grade,
    gradePoint,
    status: percentage >= 40 ? "PASS" : "FAIL"
  };
};
