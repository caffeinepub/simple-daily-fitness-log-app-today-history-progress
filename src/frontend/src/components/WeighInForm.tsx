import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAddWeightEntry } from '../hooks/queries/useWeightEntries';

interface WeighInFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WeighInForm({ open, onOpenChange }: WeighInFormProps) {
  const [weight, setWeight] = useState('');
  const addEntry = useAddWeightEntry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;

    await addEntry.mutateAsync(parseFloat(weight));
    setWeight('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Weight Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="Enter your weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" disabled={!weight || addEntry.isPending}>
            {addEntry.isPending ? 'Adding...' : 'Add Entry'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
