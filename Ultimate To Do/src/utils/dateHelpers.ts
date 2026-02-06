import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns';

export const formatDate = (date: string): string => {
  try {
    const parsedDate = parseISO(date);
    
    if (isToday(parsedDate)) {
      return 'Today';
    }
    
    if (isTomorrow(parsedDate)) {
      return 'Tomorrow';
    }
    
    return format(parsedDate, 'MMM dd, yyyy');
  } catch {
    return date;
  }
};

export const isOverdue = (date: string): boolean => {
  try {
    const parsedDate = parseISO(date);
    return isPast(parsedDate) && !isToday(parsedDate);
  } catch {
    return false;
  }
};

export const formatDateTime = (datetime: string): string => {
  try {
    return format(parseISO(datetime), 'MMM dd, yyyy hh:mm a');
  } catch {
    return datetime;
  }
};

export const formatTime = (datetime: string): string => {
  try {
    return format(parseISO(datetime), 'hh:mm a');
  } catch {
    return datetime;
  }
};
