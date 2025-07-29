import React from 'react';
import { BookOpen } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Preparando tu malla curricular..." 
}) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 p-8">
        {/* Animated book icon */}
        <div className="relative">
          <BookOpen className="w-12 h-12 text-primary animate-pulse" />
        </div>
        
        {/* Loading text */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {message}
          </h2>
          <p className="text-sm text-muted-foreground">
            Configurando la experiencia perfecta para ti
          </p>
        </div>
        
        {/* Loading bar animation */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full animate-pulse loading-bar" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
