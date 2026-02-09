import { useMemo } from 'react';
import { formatDateToYYYYMMDD, addDays } from '../utils/date';

interface WorkoutProgressChartProps {
  completions: Array<[string, boolean]>;
  startDate: string;
  endDate: string;
}

export default function WorkoutProgressChart({ completions, startDate, endDate }: WorkoutProgressChartProps) {
  const chartData = useMemo(() => {
    // Create a map of date -> completion status
    const completionMap = new Map(completions);
    
    // Generate all dates in the range
    const dates: Array<{ date: string; completed: boolean }> = [];
    let currentDate = startDate;
    
    while (currentDate <= endDate) {
      dates.push({
        date: currentDate,
        completed: completionMap.get(currentDate) || false,
      });
      currentDate = addDays(currentDate, 1);
    }
    
    return dates;
  }, [completions, startDate, endDate]);

  if (chartData.length === 0) return null;

  const cellSize = 100 / chartData.length;
  const completedCount = chartData.filter(d => d.completed).length;
  const completionRate = Math.round((completedCount / chartData.length) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Last 30 days</span>
        <span className="font-medium">
          {completedCount}/{chartData.length} completed ({completionRate}%)
        </span>
      </div>
      
      <svg viewBox="0 0 100 20" className="w-full" style={{ height: '80px' }}>
        {chartData.map((day, index) => {
          const x = index * cellSize;
          const isCompleted = day.completed;
          
          return (
            <g key={day.date}>
              <rect
                x={x}
                y="0"
                width={cellSize * 0.9}
                height="20"
                rx="1"
                fill={isCompleted ? 'oklch(var(--primary))' : 'oklch(var(--muted))'}
                className="transition-colors"
              />
            </g>
          );
        })}
      </svg>
      
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'oklch(var(--primary))' }} />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'oklch(var(--muted))' }} />
          <span>Not completed</span>
        </div>
      </div>
    </div>
  );
}
