/**
 * Helper to format a single date into short readable format e.g. "Oct 12, 2026"
 */
const formatDateShort = (dateInput) => {
  const d = new Date(dateInput);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Helper to format date range string e.g. "Oct 12, 2026 to Oct 20, 2026"
 */
const formatDateRange = (startDateInput, endDateInput) => {
  if (!startDateInput || !endDateInput) return '';
  return `${formatDateShort(startDateInput)} to ${formatDateShort(endDateInput)}`;
};

/**
 * Helper to format date into weekday & date e.g. "Monday, Oct 12, 2026"
 */
const formatDateWithWeekday = (dateInput) => {
  const d = new Date(dateInput);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Helper to format date as YYYY-MM-DD string
 */
const formatISODateOnly = (dateInput) => {
  const d = new Date(dateInput);
  return d.toISOString().split('T')[0];
};

/**
 * Helper to calculate total inclusive days between start and end date
 */
const calculateTotalDays = (startDateInput, endDateInput) => {
  const start = new Date(startDateInput);
  const end = new Date(endDateInput);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
};

/**
 * Helper to generate contiguous array of day objects from startDate to endDate
 */
const generateContiguousDays = (startDateInput, endDateInput) => {
  const start = new Date(startDateInput);
  const end = new Date(endDateInput);

  const days = [];
  let currentDate = new Date(start);
  let dayNumber = 1;

  while (currentDate <= end) {
    days.push({
      dayNumber,
      date: formatISODateOnly(currentDate),
      formattedDate: formatDateWithWeekday(currentDate),
      rawDate: new Date(currentDate),
    });

    currentDate.setDate(currentDate.getDate() + 1);
    dayNumber++;
  }

  // Fallback if loop didn't execute for any edge case
  if (days.length === 0) {
    days.push({
      dayNumber: 1,
      date: formatISODateOnly(start),
      formattedDate: formatDateWithWeekday(start),
      rawDate: new Date(start),
    });
  }

  return days;
};

module.exports = {
  formatDateShort,
  formatDateRange,
  formatDateWithWeekday,
  formatISODateOnly,
  calculateTotalDays,
  generateContiguousDays,
};
