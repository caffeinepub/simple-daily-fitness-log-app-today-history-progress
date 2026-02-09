import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle } from 'lucide-react';
import { useGetWorkoutCompletionForDate, useToggleWorkoutCompletionForDate } from '../hooks/queries/useWorkoutCompletion';
import { useSetWorkoutSkippedForDate } from '../hooks/queries/useWorkoutSkip';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface CompletionToggleProps {
  date: string; // YYYY-MM-DD
  isSkipped?: boolean;
}

export default function CompletionToggle({ date, isSkipped = false }: CompletionToggleProps) {
  const { identity } = useInternetIdentity();
  const { data: isCompleted = false } = useGetWorkoutCompletionForDate(date);
  const toggleCompletion = useToggleWorkoutCompletionForDate();
  const setSkipped = useSetWorkoutSkippedForDate();

  const handleToggle = async () => {
    if (!identity) return;
    
    // If currently skipped, unskip when marking complete
    if (isSkipped) {
      await setSkipped.mutateAsync({ date, skipped: false });
    }
    
    await toggleCompletion.mutateAsync(date);
  };

  const isPending = toggleCompletion.isPending || setSkipped.isPending;

  return (
    <Button
      onClick={handleToggle}
      disabled={!identity || isPending || isSkipped}
      variant={isCompleted ? 'default' : 'outline'}
      size="sm"
      className="gap-2"
    >
      {isCompleted ? (
        <>
          <CheckCircle2 className="h-4 w-4" />
          Completed
        </>
      ) : (
        <>
          <Circle className="h-4 w-4" />
          Mark Complete
        </>
      )}
    </Button>
  );
}
