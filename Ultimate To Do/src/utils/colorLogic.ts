export const getColorClass = (
  status: 'red' | 'yellow' | 'light_green' | 'deep_green'
): string => {
  switch (status) {
    case 'red':
      return 'bg-tracker-red';
    case 'yellow':
      return 'bg-tracker-yellow';
    case 'light_green':
      return 'bg-tracker-light-green';
    case 'deep_green':
      return 'bg-tracker-deep-green';
    default:
      return 'bg-gray-300';
  }
};

export const calculateDayStatus = (
  tasksCompleted: number,
  tasksTotal: number
): 'red' | 'yellow' | 'light_green' | 'deep_green' => {
  if (tasksTotal === 0) return 'red';
  
  const ratio = tasksCompleted / tasksTotal;
  
  if (ratio === 0) return 'red';
  if (ratio < 0.5) return 'yellow';
  if (ratio < 1) return 'light_green';
  return 'deep_green';
};
