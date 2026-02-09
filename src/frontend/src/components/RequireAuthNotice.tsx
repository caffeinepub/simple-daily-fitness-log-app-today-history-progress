import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function RequireAuthNotice() {
  const { identity } = useInternetIdentity();

  if (identity) return null;

  return (
    <Alert className="mb-4">
      <Info className="h-4 w-4" />
      <AlertDescription>
        Sign in to save your progress and sync across devices.
      </AlertDescription>
    </Alert>
  );
}
