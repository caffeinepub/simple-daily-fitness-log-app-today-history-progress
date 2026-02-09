import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppShell from './components/AppShell';
import HomeScreen from './screens/HomeScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import DietScreen from './screens/DietScreen';
import ProgressScreen from './screens/ProgressScreen';
import ProfileSetupDialog from './components/ProfileSetupDialog';
import OnboardingTourDialog from './components/OnboardingTourDialog';
import ErrorBoundary from './components/ErrorBoundary';
import { useOnboardingTour } from './hooks/useOnboardingTour';

type Tab = 'home' | 'workout' | 'diet' | 'progress';

const queryClient = new QueryClient();

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const { isOpen, dismiss, close, reset } = useOnboardingTour();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ErrorBoundary>
        <ProfileSetupDialog />
        <OnboardingTourDialog open={isOpen} onDismiss={dismiss} onClose={close} />
        <AppShell activeTab={activeTab} onTabChange={setActiveTab} onShowTour={reset}>
          {activeTab === 'home' && <HomeScreen />}
          {activeTab === 'workout' && <WorkoutScreen />}
          {activeTab === 'diet' && <DietScreen />}
          {activeTab === 'progress' && <ProgressScreen />}
        </AppShell>
        <Toaster />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
