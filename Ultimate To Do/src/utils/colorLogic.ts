export const getColorClass = (
  status: 'red' | 'yellow' | 'light_green' | 'deep_green' | 'white',
  isFuture: boolean,
): string => {
  if (isFuture) return 'bg-gray-300';
  switch (status) {
    case 'white':
      return 'bg-gray-300';
    case 'red':
      return 'bg-red-400';
    case 'yellow':
      return 'bg-yellow-400';
    case 'light_green':
      return 'bg-green-300';
    case 'deep_green':
      return 'bg-green-600';
    default:
      return 'bg-gray-300';
  }
};

export const calculateDayStatus = (
  tasksCompleted: number,
  isFuture: boolean,
  tasksTotal: number
): 'red' | 'yellow' | 'light_green' | 'deep_green' | 'white'=> {
  if (tasksTotal === 0) return 'red';
  
  const ratio = tasksCompleted / tasksTotal;
  if (isFuture) return 'white';
  if (ratio === 0) return 'red';
  if (ratio < 0.5) return 'yellow';
  if (ratio < 1) return 'light_green';
  return 'deep_green';
};
