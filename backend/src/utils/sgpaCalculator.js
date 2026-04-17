export const calculateSgpa = (results = []) => {
  const totals = results.reduce(
    (accumulator, result) => {
      accumulator.totalCredits += Number(result.credits || 0);
      accumulator.totalCreditPoints += Number(result.credits || 0) * Number(result.gradePoint || 0);
      return accumulator;
    },
    { totalCredits: 0, totalCreditPoints: 0 }
  );

  if (!totals.totalCredits) {
    return 0;
  }

  return Number((totals.totalCreditPoints / totals.totalCredits).toFixed(2));
};
