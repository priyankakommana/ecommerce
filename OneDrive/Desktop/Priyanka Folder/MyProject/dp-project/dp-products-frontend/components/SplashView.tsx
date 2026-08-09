import { useEffect } from 'react';

// Explicitly declare SplashProps interface layout
export interface SplashProps {
  onTimeout: () => void;
}

export default function SplashView({ onTimeout }: SplashProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onTimeout();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onTimeout]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-slate-900 text-white animate-pulse">
      <div className="text-center p-6 space-y-4">
        <h1 className="text-4xl md:text-6xl font-black tracking-widest drop-shadow-md">
          WELCOME TO DP PRODUCTS
        </h1>
        <div className="w-20 h-1 bg-amber-400 mx-auto rounded-full"></div>
        <p className="text-lg md:text-xl font-medium tracking-wide text-indigo-200 italic">
          Everything you want, right here
        </p>
      </div>
    </div>
  );
}
