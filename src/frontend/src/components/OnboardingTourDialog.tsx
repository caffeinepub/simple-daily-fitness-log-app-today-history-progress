import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Home, Dumbbell, UtensilsCrossed, TrendingUp, X } from 'lucide-react';

interface OnboardingTourDialogProps {
  open: boolean;
  onDismiss: () => void;
  onClose: () => void;
}

export default function OnboardingTourDialog({
  open,
  onDismiss,
  onClose,
}: OnboardingTourDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to FitTrack! 💪</DialogTitle>
          <DialogDescription className="text-base">
            Your personal fitness companion for tracking workouts, meals, and progress.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Home className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Home</h3>
              <p className="text-sm text-muted-foreground">
                View your goals, workout stats, and latest weight at a glance.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Workout</h3>
              <p className="text-sm text-muted-foreground">
                Follow your daily workout plan, mark exercises complete, or skip rest days.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <UtensilsCrossed className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Diet</h3>
              <p className="text-sm text-muted-foreground">
                Track your meals, water intake, and protein scoops for each day.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Progress</h3>
              <p className="text-sm text-muted-foreground">
                Log your weight entries and visualize your progress over time.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            <X className="mr-2 h-4 w-4" />
            Show again later
          </Button>
          <Button onClick={onDismiss} className="w-full sm:w-auto">
            Get started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
