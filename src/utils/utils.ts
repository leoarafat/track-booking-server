const currentDate = new Date();

// Format the date as MM/DD/YYYY
export const formattedDate = currentDate.toLocaleDateString('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
