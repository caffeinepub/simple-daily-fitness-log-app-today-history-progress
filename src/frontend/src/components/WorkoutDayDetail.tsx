import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalendarX } from 'lucide-react';
import ExerciseCard from './ExerciseCard';
import CompletionToggle from './CompletionToggle';
import SkipDayToggle from './SkipDayToggle';
import { useGetWorkoutSkippedForDate, useToggleWorkoutSkippedForDate } from '../hooks/queries/useWorkoutSkip';
import type { WorkoutDay } from '../data/workoutPlan';

interface WorkoutDayDetailProps {
  date: string; // YYYY-MM-DD
  workout: WorkoutDay;
}

export default function WorkoutDayDetail({ date, workout }: WorkoutDayDetailProps) {
  const { data: isSkipped = false } = useGetWorkoutSkippedForDate(date);
  const toggleSkipped = useToggleWorkoutSkippedForDate();

  const handleToggleSkip = async () => {
    await toggleSkipped.mutateAsync(date);
  };

  if (workout.isRestDay) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rest Day</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <img
            src="/assets/generated/illus-warmup.dim_1200x800.png"
            alt="Rest day illustration"
            className="w-full rounded-lg opacity-60"
          />
          <p className="text-center text-muted-foreground">
            Take this day to recover and let your muscles rebuild. Stay hydrated and get good sleep!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className={isSkipped ? 'text-muted-foreground' : ''}>
            {workout.name}
            {isSkipped && <span className="ml-2 text-sm font-normal">(Skipped)</span>}
          </CardTitle>
          <div className="flex gap-2">
            <SkipDayToggle
              date={date}
              isSkipped={isSkipped}
              onToggle={handleToggleSkip}
              isPending={toggleSkipped.isPending}
              type="workout"
            />
            <CompletionToggle date={date} isSkipped={isSkipped} />
          </div>
        </CardHeader>
      </Card>

      {isSkipped && (
        <Alert variant="default" className="border-destructive/50 bg-destructive/10">
          <CalendarX className="h-4 w-4" />
          <AlertDescription>
            This workout day is marked as skipped. You can unskip it to resume your normal plan.
          </AlertDescription>
        </Alert>
      )}

      {!isSkipped && workout.sections.map((section, sectionIndex) => (
        <Card key={sectionIndex}>
          <CardHeader>
            <CardTitle className="text-lg">{section.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {section.exercises.map((exercise, exerciseIndex) => (
              <div key={exerciseIndex}>
                {exerciseIndex > 0 && <Separator className="my-4" />}
                <ExerciseCard exercise={exercise} />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
