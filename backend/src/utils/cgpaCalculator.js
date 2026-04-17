export const calculateCgpa = (semesterSummaries = []) => {
  const totals = semesterSummaries.reduce(
    (accumulator, semester) => {
      accumulator.totalCredits += Number(semester.totalCredits || 0);
      accumulator.totalCreditPoints += Number(semester.totalCreditPoints || 0);
      return accumulator;
    },
    { totalCredits: 0, totalCreditPoints: 0 }
  );

  if (!totals.totalCredits) {
    return 0;
  }

  return Number((totals.totalCreditPoints / totals.totalCredits).toFixed(2));
};
