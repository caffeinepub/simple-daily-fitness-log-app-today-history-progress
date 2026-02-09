import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, Save, RotateCcw } from 'lucide-react';
import type { WorkoutDay, WorkoutSection, Exercise } from '../data/workoutPlan';
import { useSaveWorkoutForDate, useResetWorkoutForDate } from '../hooks/queries/useWorkoutForDate';
import { toast } from 'sonner';

interface WorkoutEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string;
  initialWorkout: WorkoutDay;
}

export default function WorkoutEditDialog({
  open,
  onOpenChange,
  date,
  initialWorkout,
}: WorkoutEditDialogProps) {
  const [workout, setWorkout] = useState<WorkoutDay>(initialWorkout);
  const saveWorkout = useSaveWorkoutForDate();
  const resetWorkout = useResetWorkoutForDate();

  const handleSave = async () => {
    try {
      await saveWorkout.mutateAsync({ date, workout });
      toast.success('Workout saved successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save workout');
    }
  };

  const handleReset = async () => {
    try {
      await resetWorkout.mutateAsync(date);
      toast.success('Workout reset to default');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to reset workout');
    }
  };

  const addSection = () => {
    setWorkout({
      ...workout,
      sections: [...workout.sections, { name: 'New Section', exercises: [] }],
    });
  };

  const removeSection = (sectionIndex: number) => {
    setWorkout({
      ...workout,
      sections: workout.sections.filter((_, i) => i !== sectionIndex),
    });
  };

  const updateSection = (sectionIndex: number, updates: Partial<WorkoutSection>) => {
    setWorkout({
      ...workout,
      sections: workout.sections.map((section, i) =>
        i === sectionIndex ? { ...section, ...updates } : section
      ),
    });
  };

  const addExercise = (sectionIndex: number) => {
    const newExercise: Exercise = {
      name: 'New Exercise',
      sets: 3,
      reps: '10',
      restSeconds: 60,
    };
    updateSection(sectionIndex, {
      exercises: [...workout.sections[sectionIndex].exercises, newExercise],
    });
  };

  const removeExercise = (sectionIndex: number, exerciseIndex: number) => {
    updateSection(sectionIndex, {
      exercises: workout.sections[sectionIndex].exercises.filter((_, i) => i !== exerciseIndex),
    });
  };

  const updateExercise = (
    sectionIndex: number,
    exerciseIndex: number,
    updates: Partial<Exercise>
  ) => {
    updateSection(sectionIndex, {
      exercises: workout.sections[sectionIndex].exercises.map((ex, i) =>
        i === exerciseIndex ? { ...ex, ...updates } : ex
      ),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Workout</DialogTitle>
          <DialogDescription>
            Customize your workout for this date. Changes will be saved for this specific day only.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="workout-name">Workout Name</Label>
              <Input
                id="workout-name"
                value={workout.name}
                onChange={(e) => setWorkout({ ...workout, name: e.target.value })}
              />
            </div>

            <Separator />

            {workout.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-4 border rounded-lg p-4">
                <div className="flex items-center justify-between gap-2">
                  <Input
                    value={section.name}
                    onChange={(e) => updateSection(sectionIndex, { name: e.target.value })}
                    className="font-semibold"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSection(sectionIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {section.exercises.map((exercise, exerciseIndex) => (
                  <div key={exerciseIndex} className="space-y-2 pl-4 border-l-2">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Exercise name"
                        value={exercise.name}
                        onChange={(e) =>
                          updateExercise(sectionIndex, exerciseIndex, { name: e.target.value })
                        }
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExercise(sectionIndex, exerciseIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs">Sets</Label>
                        <Input
                          type="number"
                          value={exercise.sets || ''}
                          onChange={(e) =>
                            updateExercise(sectionIndex, exerciseIndex, {
                              sets: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Reps</Label>
                        <Input
                          value={exercise.reps || ''}
                          onChange={(e) =>
                            updateExercise(sectionIndex, exerciseIndex, { reps: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Rest (sec)</Label>
                        <Input
                          type="number"
                          value={exercise.restSeconds || ''}
                          onChange={(e) =>
                            updateExercise(sectionIndex, exerciseIndex, {
                              restSeconds: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addExercise(sectionIndex)}
                  className="w-full gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Exercise
                </Button>
              </div>
            ))}

            <Button variant="outline" onClick={addSection} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add Section
            </Button>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset to Default
          </Button>
          <Button onClick={handleSave} disabled={saveWorkout.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {saveWorkout.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
