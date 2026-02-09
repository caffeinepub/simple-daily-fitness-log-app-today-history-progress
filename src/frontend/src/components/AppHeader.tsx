import { Scale } from 'lucide-react';
import AuthButton from './AuthButton';
import ThemeToggle from './ThemeToggle';
import { useGetCallerUserProfile } from '../hooks/queries/useCurrentUserProfile';

export default function AppHeader() {
  const { data: profile } = useGetCallerUserProfile();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Scale className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-none">FitTrack</h1>
            {profile && (
              <p className="text-xs text-muted-foreground">{profile.name}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
