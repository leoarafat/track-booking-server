export // Helper function to get the start and end dates of a year
const getYearRange = (year: any) => {
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);
  return { startDate, endDate };
};
