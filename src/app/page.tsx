
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to /predict as soon as this page component mounts.
    // The global splash screen (from RootLayout) will cover this transition.
    router.push('/predict');
  }, [router]); // router is a stable dependency from Next.js navigation hooks

  // This page is only for redirection, so it doesn't need to render anything itself.
  // The global splash screen will be visible.
  return null;
}
