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
import ErrorBoundary from './components/ErrorBoundary';

type Tab = 'home' | 'workout' | 'diet' | 'progress';

const queryClient = new QueryClient();

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ErrorBoundary>
        <ProfileSetupDialog />
        <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
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
