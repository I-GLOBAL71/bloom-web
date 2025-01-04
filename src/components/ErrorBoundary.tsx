import React from 'react';

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = React.useState(false);
  
  React.useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error('[ErrorBoundary] Caught error:', error);
      setHasError(true);
    };
    
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <div className="p-4 bg-red-50 text-red-600">
        Error loading component. Please refresh the page.
      </div>
    );
  }

  return <>{children}</>;
};
