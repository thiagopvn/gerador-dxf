import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export function Card({ 
  children, 
  className = '',
  interactive = false,
  onClick
}: CardProps) {
  const baseClasses = 'bg-card border border-border rounded-lg p-6 shadow-lg transition-all duration-200';
  const interactiveClasses = interactive ? 'cursor-pointer hover:border-primary hover:scale-105 transform' : '';

  return (
    <div 
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardContent({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string 
}) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string 
}) {
  return (
    <div className={`px-6 py-4 border-b border-border ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string 
}) {
  return (
    <h3 className={`text-lg font-semibold text-text-primary ${className}`}>
      {children}
    </h3>
  );
}

