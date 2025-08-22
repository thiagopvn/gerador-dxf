import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

export function Button({ children, variant = 'primary', loading, className, ...props }: ButtonProps) {
  const primaryClasses = "bg-primary hover:bg-primary-hover text-white";
  const secondaryClasses = "bg-transparent border border-border hover:bg-border text-muted hover:text-white";
  
  return (
    <button
      className={`w-full h-12 px-6 flex items-center justify-center rounded-md font-semibold transition-all duration-200 disabled:opacity-50 ${variant === 'primary' ? primaryClasses : secondaryClasses} ${className || ''}`}
      disabled={loading}
      {...props}
    >
      {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : children}
    </button>
  );
}