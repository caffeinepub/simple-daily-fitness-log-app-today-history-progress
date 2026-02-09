import { Button } from '@/components/ui/button';

interface WeeklyDayPickerProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function WeeklyDayPicker({ selectedDay, onSelectDay }: WeeklyDayPickerProps) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day, index) => (
        <Button
          key={index}
          variant={selectedDay === index ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelectDay(index)}
          className="flex flex-col gap-1 h-auto py-3"
        >
          <span className="text-xs font-medium">{day}</span>
          <span className="text-lg font-bold">{index + 1}</span>
        </Button>
      ))}
    </div>
  );
}
