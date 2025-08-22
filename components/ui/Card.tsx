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

