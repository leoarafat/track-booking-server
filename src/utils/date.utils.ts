import dayjs from 'dayjs';

export const dateCompare = (oldDate: string, newDate: string) => {
  console.log(oldDate, newDate);
  return dayjs(oldDate).isBefore(dayjs(newDate));
};
export const nextFiveDay = (date: string) => {
  return dayjs(date).add(5, 'day').toDate();
};
export const calculateRemainingDays = (startDate: string, endDate: string) => {
  const start = dayjs(startDate).startOf('day');
  const end = dayjs(endDate).startOf('day');
  const diffInDays = end.diff(start, 'day');
  return diffInDays;
};
export const formatTime = (startTime: string, endTime: string) => {
  return {
    startTime: dayjs(startTime, 'HH:mm').format('hh:mm A'),
    endTime: dayjs(endTime, 'HH:mm').format('hh:mm A'),
  };
};

export const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};
