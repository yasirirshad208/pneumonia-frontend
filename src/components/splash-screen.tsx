import { HeartPulse } from 'lucide-react';

export default function SplashScreenComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/20 via-background to-background text-foreground p-4 overflow-hidden">
      <div className="relative mb-10">
        {/* Main Icon */}
        <HeartPulse className="w-36 h-36 sm:w-44 md:w-52 lg:w-60 sm:h-44 md:h-52 lg:h-60 text-primary opacity-0 animate-pulseGrowAndSettle" />
        
        {/* Ripple Effects */}
        <div 
          className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ripple opacity-0" 
          style={{ animationDelay: '0s' }}
        />
        <div 
          className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ripple opacity-0" 
          style={{ animationDelay: '0.4s' }} // Slightly adjusted delay for staggering
        />
         <div 
          className="absolute inset-0 rounded-full border-2 border-primary/10 animate-ripple opacity-0" 
          style={{ animationDelay: '0.8s' }} // Slightly adjusted delay for staggering
        />
      </div>
      <h1 
        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-center text-primary opacity-0 animate-fadeInUp" 
        style={{ animationDelay: '0.7s' }} 
      >
        PneumoCheck
      </h1>
      <p 
        className="text-lg sm:text-xl md:text-2xl text-muted-foreground text-center opacity-0 animate-fadeInUp" 
        style={{ animationDelay: '1s' }} 
      >
        AI-Powered Pneumonia Detection
      </p>
    </div>
  );
}
