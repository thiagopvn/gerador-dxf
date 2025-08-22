'use client';

import React from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
  helperText?: string;
}

export function FormField({ 
  label, 
  error, 
  required = false, 
  className = '',
  children,
  helperText
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-text-secondary">
        {label}
        {required && <span className="ml-1 text-accent-red">*</span>}
      </label>
      {children}
      {helperText && !error && (
        <p className="text-xs text-text-secondary mt-1">{helperText}</p>
      )}
      {error && (
        <p className="text-xs text-accent-red mt-1">{error}</p>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full px-4 py-3 bg-bg-primary border ${
        error ? 'border-accent-red' : 'border-border-secondary'
      } rounded-lg text-text-primary placeholder-text-secondary 
      focus:outline-none focus:ring-2 focus:ring-accent-red focus:border-transparent
      transition-all duration-200 ${className}`}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export function Select({ error, className = '', children, ...props }: SelectProps) {
  return (
    <select
      className={`w-full px-4 py-3 bg-bg-primary border ${
        error ? 'border-accent-red' : 'border-border-secondary'
      } rounded-lg text-text-primary 
      focus:outline-none focus:ring-2 focus:ring-accent-red focus:border-transparent
      transition-all duration-200 appearance-none cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function TextArea({ error, className = '', ...props }: TextAreaProps) {
  return (
    <textarea
      className={`w-full px-4 py-3 bg-bg-primary border ${
        error ? 'border-accent-red' : 'border-border-secondary'
      } rounded-lg text-text-primary placeholder-text-secondary 
      focus:outline-none focus:ring-2 focus:ring-accent-red focus:border-transparent
      transition-all duration-200 resize-y min-h-[100px] ${className}`}
      {...props}
    />
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '', 
  children,
  disabled,
  ...props 
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-accent-red hover:bg-accent-hover text-white',
    secondary: 'bg-bg-primary hover:bg-bg-secondary text-text-primary border border-border-secondary',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'bg-transparent hover:bg-bg-secondary text-text-primary'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`
        ${variantClasses[variant]} 
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        font-medium rounded-lg transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2 focus:ring-offset-bg-primary
        flex items-center justify-center gap-2
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}