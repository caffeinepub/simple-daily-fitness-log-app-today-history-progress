import { useMemo } from 'react';
import type { WeightEntry } from '../backend';

interface WeightChartProps {
  entries: WeightEntry[];
}

export default function WeightChart({ entries }: WeightChartProps) {
  const chartData = useMemo(() => {
    const sorted = [...entries].sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
    return sorted.slice(-10);
  }, [entries]);

  if (chartData.length === 0) return null;

  const maxWeight = Math.max(...chartData.map(e => e.weightKg));
  const minWeight = Math.min(...chartData.map(e => e.weightKg));
  const range = maxWeight - minWeight || 1;
  const padding = range * 0.2;

  const getY = (weight: number) => {
    return ((maxWeight + padding - weight) / (range + 2 * padding)) * 100;
  };

  const points = chartData.map((entry, index) => ({
    x: (index / (chartData.length - 1 || 1)) * 100,
    y: getY(entry.weightKg),
    weight: entry.weightKg,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="space-y-4">
      <svg viewBox="0 0 100 50" className="w-full" style={{ height: '200px' }}>
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="oklch(var(--primary))" stopOpacity="1" />
          </linearGradient>
        </defs>
        
        <path
          d={pathD}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="1.5"
              fill="oklch(var(--primary))"
              className="drop-shadow-sm"
            />
          </g>
        ))}
      </svg>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{chartData[0]?.weightKg} kg</span>
        <span>{chartData[chartData.length - 1]?.weightKg} kg</span>
      </div>
    </div>
  );
}
