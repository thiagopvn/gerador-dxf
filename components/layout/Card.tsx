import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ 
  children, 
  className = '',
  padding = 'md',
  hover = false,
  onClick
}: CardProps) {
  const paddingClasses = {
    'none': '',
    'sm': 'p-4',
    'md': 'p-6',
    'lg': 'p-8',
    'xl': 'p-10'
  };

  const hoverClasses = hover 
    ? 'hover:border-accent-red hover:shadow-lg hover:shadow-accent-red/20 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]' 
    : '';

  return (
    <div 
      className={`bg-bg-secondary border border-border-secondary rounded-lg ${paddingClasses[padding]} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}