import moment from 'moment';

export const calculateInstallmentAmount = (remainingFees, numberOfInstallments) => {
  const baseAmount = remainingFees / numberOfInstallments;
  const roundedAmount = Math.round(baseAmount * 100) / 100; // Round to 2 decimal places
  const lastInstallment = remainingFees - (roundedAmount * (numberOfInstallments - 1));
  return { baseAmount: roundedAmount, lastInstallment };
};

export const calculateNextExpirationDate = (currentDate, monthsToAdd = 1) => {
  const nextDate = moment(currentDate).add(monthsToAdd, 'months');
  // If the day doesn't exist in next month (e.g., Jan 31 -> Feb), use last day of month
  if (nextDate.date() !== moment(currentDate).date()) {
    nextDate.endOf('month');
  }
  return nextDate.toDate();
};

export const calculateMissedMonths = (dueDate) => {
  const now = moment();
  const due = moment(dueDate);
  
  if (now.isBefore(due)) return 0;
  
  const monthsDiff = now.diff(due, 'months');
  const daysInCurrentMonth = now.daysInMonth();
  const daysFromDueDate = now.date() - due.date();
  
  // If we're more than halfway through the current month, count it
  const partialMonth = daysFromDueDate > daysInCurrentMonth / 2 ? 1 : 0;
  
  return monthsDiff + partialMonth;
};

export const calculateLateFee = (dueDate, amount) => {
  const missedMonths = calculateMissedMonths(dueDate);
  if (missedMonths <= 0) return 0;
  
  // Calculate 5% late fee per month
  const lateFeePercentage = 0.05;
  return Math.round(amount * lateFeePercentage * missedMonths * 100) / 100;
}; 