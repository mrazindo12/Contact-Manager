import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-semibold text-foreground/80 mb-2">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={`
              w-full ${icon ? 'pl-10' : 'px-4'} py-2.5 text-sm rounded-xl border
              bg-card text-foreground placeholder:text-muted-foreground/50
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
              disabled:bg-secondary/50 disabled:cursor-not-allowed
              transition-all duration-200
              ${error ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : 'border-border'}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-semibold text-foreground/80 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={`
            w-full px-4 py-2.5 text-sm rounded-xl border
            bg-card text-foreground placeholder:text-muted-foreground/50
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            disabled:bg-secondary/50 disabled:cursor-not-allowed
            resize-none transition-all duration-200
            ${error ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : 'border-border'}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, options, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-semibold text-foreground/80 mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={`
            w-full px-4 py-2.5 text-sm rounded-xl border
            bg-card text-foreground
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            disabled:bg-secondary/50 disabled:cursor-not-allowed
            transition-all duration-200 appearance-none
            ${error ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : 'border-border'}
            ${className}
          `}
          {...props}
        >
          <option value="">All</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
