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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Save, RotateCcw } from 'lucide-react';
import type { Meal } from '../data/mealPlan';
import { useSaveDietForDate, useResetDietForDate } from '../hooks/useDietOverrides';
import { toast } from 'sonner';

interface DietEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string;
  initialMeals: Meal[];
}

export default function DietEditDialog({
  open,
  onOpenChange,
  date,
  initialMeals,
}: DietEditDialogProps) {
  const [meals, setMeals] = useState<Meal[]>(initialMeals);
  const saveDiet = useSaveDietForDate();
  const resetDiet = useResetDietForDate();

  const handleSave = async () => {
    try {
      await saveDiet.mutateAsync({ date, meals });
      toast.success('Diet plan saved successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save diet plan');
    }
  };

  const handleReset = async () => {
    try {
      await resetDiet.mutateAsync(date);
      toast.success('Diet plan reset to default');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to reset diet plan');
    }
  };

  const updateMeal = (index: number, updates: Partial<Meal>) => {
    setMeals(meals.map((meal, i) => (i === index ? { ...meal, ...updates } : meal)));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Diet Plan</DialogTitle>
          <DialogDescription>
            Customize your meals for this date. Changes will be saved for this specific day only.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {meals.map((meal, index) => (
              <div key={index} className="space-y-4 border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{meal.type}</h3>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`veg-${index}`} className="text-sm">
                      Vegetarian
                    </Label>
                    <Switch
                      id={`veg-${index}`}
                      checked={meal.isVeg}
                      onCheckedChange={(checked) => updateMeal(index, { isVeg: checked })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`name-${index}`}>Meal Name</Label>
                  <Input
                    id={`name-${index}`}
                    value={meal.name}
                    onChange={(e) => updateMeal(index, { name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`desc-${index}`}>Description</Label>
                  <Textarea
                    id={`desc-${index}`}
                    value={meal.description}
                    onChange={(e) => updateMeal(index, { description: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor={`cal-${index}`} className="text-xs">
                      Calories
                    </Label>
                    <Input
                      id={`cal-${index}`}
                      type="number"
                      value={meal.calories}
                      onChange={(e) =>
                        updateMeal(index, { calories: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`protein-${index}`} className="text-xs">
                      Protein (g)
                    </Label>
                    <Input
                      id={`protein-${index}`}
                      type="number"
                      value={meal.protein}
                      onChange={(e) =>
                        updateMeal(index, { protein: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`carbs-${index}`} className="text-xs">
                      Carbs (g)
                    </Label>
                    <Input
                      id={`carbs-${index}`}
                      type="number"
                      value={meal.carbs}
                      onChange={(e) => updateMeal(index, { carbs: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset to Default
          </Button>
          <Button onClick={handleSave} disabled={saveDiet.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {saveDiet.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
