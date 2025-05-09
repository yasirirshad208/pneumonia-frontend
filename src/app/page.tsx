"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreenComponent from '@/components/splash-screen';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/predict');
    }, 3000); // 3 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, [router]);

  return <SplashScreenComponent />;
}
