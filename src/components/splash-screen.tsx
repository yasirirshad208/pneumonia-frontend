import { ShieldCheck } from 'lucide-react';

export default function SplashScreenComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <ShieldCheck className="w-24 h-24 sm:w-32 sm:h-32 mb-6 text-primary animate-pulse" />
      <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-center">PneumoCheck</h1>
      <p className="text-lg sm:text-xl text-muted-foreground text-center">AI-Powered Pneumonia Detection</p>
    </div>
  );
}
