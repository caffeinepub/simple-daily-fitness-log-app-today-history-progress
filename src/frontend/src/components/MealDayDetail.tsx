import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Meal } from '../data/mealPlan';

interface MealDayDetailProps {
  meals: Meal[];
}

export default function MealDayDetail({ meals }: MealDayDetailProps) {
  return (
    <div className="space-y-4">
      <img
        src="/assets/generated/illus-meal.dim_1200x800.png"
        alt="Meal planning illustration"
        className="w-full rounded-lg"
      />
      
      {meals.map((meal, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{meal.type}</CardTitle>
              <Badge variant={meal.isVeg ? 'secondary' : 'outline'}>
                {meal.isVeg ? 'Veg' : 'Non-Veg'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2">{meal.name}</h4>
              <p className="text-sm text-muted-foreground">{meal.description}</p>
            </div>
            <Separator />
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <p className="text-muted-foreground">Calories</p>
                <p className="font-semibold">{meal.calories}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Protein</p>
                <p className="font-semibold">{meal.protein}g</p>
              </div>
              <div>
                <p className="text-muted-foreground">Carbs</p>
                <p className="font-semibold">{meal.carbs}g</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
