"use client";

import { useState, useEffect, type ReactNode } from 'react';
import SplashScreenComponent from '@/components/splash-screen';

interface GlobalSplashWrapperProps {
  children: ReactNode;
}

export default function GlobalSplashWrapper({ children }: GlobalSplashWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect runs once on component mount (e.g., page load/reload)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Show splash for 3 seconds

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []); // Empty dependency array ensures it runs only once on mount

  if (isLoading) {
    return <SplashScreenComponent />;
  }

  return <>{children}</>;
}
