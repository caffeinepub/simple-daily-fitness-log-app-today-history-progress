import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useUpdateProfile } from '../hooks/queries/useUserGoals';
import { useGetCallerUserProfile } from '../hooks/queries/useCurrentUserProfile';

interface GoalSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GoalSetupDialog({ open, onOpenChange }: GoalSetupDialogProps) {
  const { data: profile } = useGetCallerUserProfile();
  const updateProfile = useUpdateProfile();

  const [startWeight, setStartWeight] = useState('80');
  const [targetWeight, setTargetWeight] = useState('67');
  const [frequency, setFrequency] = useState('6');
  const [duration, setDuration] = useState('2');

  useEffect(() => {
    if (profile) {
      setStartWeight(profile.startWeight.toString());
      setTargetWeight(profile.targetWeight.toString());
      setFrequency(profile.weeklyWorkoutFrequency.toString());
      setDuration(profile.dailyDurationHours.toString());
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateProfile.mutateAsync({
      name: profile?.name || 'User',
      weight: parseFloat(startWeight),
      targetWeight: parseFloat(targetWeight),
      frequency: BigInt(parseInt(frequency)),
      duration: parseFloat(duration),
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Your Goals</DialogTitle>
          <DialogDescription>
            Customize your weight loss journey parameters.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startWeight">Start Weight (kg)</Label>
              <Input
                id="startWeight"
                type="number"
                step="0.1"
                value={startWeight}
                onChange={(e) => setStartWeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetWeight">Target Weight (kg)</Label>
              <Input
                id="targetWeight"
                type="number"
                step="0.1"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frequency">Workout Days/Week</Label>
              <Input
                id="frequency"
                type="number"
                min="1"
                max="7"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (hours/day)</Label>
              <Input
                id="duration"
                type="number"
                step="0.5"
                min="0.5"
                max="4"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? 'Saving...' : 'Save Goals'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
