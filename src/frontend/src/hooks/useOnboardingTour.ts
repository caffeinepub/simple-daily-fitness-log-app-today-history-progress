import { useState, useEffect } from 'react';

const ONBOARDING_DISMISSED_KEY = 'fittrack-onboarding-dismissed';

export function useOnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(ONBOARDING_DISMISSED_KEY);
    if (!dismissed) {
      setIsOpen(true);
    }
    setIsInitialized(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(ONBOARDING_DISMISSED_KEY, 'true');
    setIsOpen(false);
  };

  const close = () => {
    setIsOpen(false);
  };

  const reset = () => {
    localStorage.removeItem(ONBOARDING_DISMISSED_KEY);
    setIsOpen(true);
  };

  return {
    isOpen,
    isInitialized,
    dismiss,
    close,
    reset,
  };
}
