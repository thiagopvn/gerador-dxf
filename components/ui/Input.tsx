import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={`w-full h-12 px-4 bg-card border border-border rounded-md text-foreground placeholder-muted focus:border-primary focus:outline-none transition-colors ${className || ''}`}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, children, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
            {props.required && <span className="ml-1 text-primary">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`input-field w-full appearance-none cursor-pointer bg-[url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a0a0a0' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")] bg-[position:right_0.75rem_center] bg-[length:1.25rem] bg-no-repeat ${error ? 'border-error focus:border-error focus:ring-error/20' : ''} ${className || ''}`}
          {...props}
        >
          {children}
        </select>
        {helperText && !error && (
          <p className="mt-1 text-xs text-muted">{helperText}</p>
        )}
        {error && (
          <p className="mt-1 text-xs text-error">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
            {props.required && <span className="ml-1 text-primary">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`input-field w-full min-h-[100px] resize-y ${error ? 'border-error focus:border-error focus:ring-error/20' : ''} ${className || ''}`}
          {...props}
        />
        {helperText && !error && (
          <p className="mt-1 text-xs text-muted">{helperText}</p>
        )}
        {error && (
          <p className="mt-1 text-xs text-error">{error}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';