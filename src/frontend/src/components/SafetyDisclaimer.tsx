import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface SafetyDisclaimerProps {
  type: 'workout' | 'diet';
}

export default function SafetyDisclaimer({ type }: SafetyDisclaimerProps) {
  const content = {
    workout: {
      title: 'Workout Safety',
      description: 'Always warm up properly, maintain good form, and listen to your body. Rest when needed and progress gradually. Consult a healthcare professional before starting any new exercise program.',
    },
    diet: {
      title: 'Nutrition Guidance',
      description: 'This meal plan is a general guide. Stay hydrated, eat adequate protein, and avoid extreme restriction. Consult a nutritionist or healthcare provider for personalized dietary advice.',
    },
  };

  return (
    <Alert className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{content[type].title}</AlertTitle>
      <AlertDescription className="text-sm">
        {content[type].description}
      </AlertDescription>
    </Alert>
  );
}
