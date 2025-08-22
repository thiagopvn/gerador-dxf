import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
}

export default function PageWrapper({ 
  children, 
  className = '',
  maxWidth = '7xl'
}: PageWrapperProps) {
  const maxWidthClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full'
  };

  return (
    <main className={`min-h-screen w-full bg-bg-primary flex flex-col ${className}`}>
      <div className={`w-full ${maxWidthClasses[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 flex-1 flex flex-col`}>
        {children}
      </div>
    </main>
  );
}