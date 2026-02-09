import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useIntervalTimer } from '../hooks/useIntervalTimer';

interface Exercise {
  name: string;
  sets?: number;
  reps?: string;
  duration?: string;
  restSeconds?: number;
}

interface ExerciseCardProps {
  exercise: Exercise;
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  const [showTimer, setShowTimer] = useState(false);
  const restDuration = exercise.restSeconds || 60;
  const { isRunning, timeRemaining, progress, start, pause, reset } = useIntervalTimer(restDuration);

  const handleStartTimer = () => {
    setShowTimer(true);
    start();
  };

  return (
    <div className="space-y-3">
      <div>
        <h4 className="font-semibold">{exercise.name}</h4>
        <div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground">
          {exercise.sets && <span>Sets: {exercise.sets}</span>}
          {exercise.reps && <span>Reps: {exercise.reps}</span>}
          {exercise.duration && <span>Duration: {exercise.duration}</span>}
          {exercise.restSeconds && <span>Rest: {exercise.restSeconds}s</span>}
        </div>
      </div>

      {exercise.restSeconds && (
        <div className="space-y-2">
          {showTimer && (
            <>
              <Progress value={progress} className="h-2" />
              <div className="text-center text-2xl font-bold tabular-nums">
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </div>
            </>
          )}
          <div className="flex gap-2">
            {!isRunning ? (
              <Button onClick={handleStartTimer} size="sm" className="flex-1">
                <Play className="h-4 w-4 mr-1" />
                Start Rest Timer
              </Button>
            ) : (
              <Button onClick={pause} size="sm" variant="secondary" className="flex-1">
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </Button>
            )}
            {showTimer && (
              <Button onClick={() => { reset(); setShowTimer(false); }} size="sm" variant="outline">
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
