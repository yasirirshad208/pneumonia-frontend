import { ShieldCheck } from 'lucide-react';

export default function SplashScreenComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 overflow-hidden">
      <ShieldCheck className="w-32 h-32 sm:w-40 md:w-48 lg:w-56 sm:h-40 md:h-48 lg:h-56 mb-8 text-primary animate-pulseLarge" />
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 text-center text-foreground opacity-0 animate-fadeInUp">
        PneumoCheck
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground text-center opacity-0 animate-fadeInUp-delayed-1">
        AI-Powered Pneumonia Detection
      </p>
    </div>
  );
}
