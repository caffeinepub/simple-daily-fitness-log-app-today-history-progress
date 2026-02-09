import { Button } from '@/components/ui/button';
import { CalendarX, Calendar } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface SkipDayToggleProps {
  date: string;
  isSkipped: boolean;
  onToggle: () => void;
  isPending: boolean;
  type: 'workout' | 'diet';
}

export default function SkipDayToggle({ date, isSkipped, onToggle, isPending, type }: SkipDayToggleProps) {
  const { identity } = useInternetIdentity();

  const handleClick = () => {
    if (!identity) return;
    onToggle();
  };

  return (
    <Button
      onClick={handleClick}
      disabled={!identity || isPending}
      variant={isSkipped ? 'destructive' : 'outline'}
      size="sm"
      className="gap-2"
      title={!identity ? `Sign in to skip ${type} days` : isSkipped ? `Unskip this day` : `Skip this day`}
    >
      {isSkipped ? (
        <>
          <CalendarX className="h-4 w-4" />
          Skipped
        </>
      ) : (
        <>
          <Calendar className="h-4 w-4" />
          Skip Day
        </>
      )}
    </Button>
  );
}
