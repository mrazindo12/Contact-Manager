import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'premium';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ring-offset-background active:scale-95';
    
    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)]',
      secondary: 'bg-secondary text-secondary-foreground border border-border hover:bg-accent hover:text-accent-foreground',
      danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      ghost: 'text-muted-foreground hover:text-foreground hover:bg-accent',
      premium: 'premium-gradient text-white shadow-[0_4px_14px_0_rgba(168,85,247,0.39)] hover:opacity-90',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-7 py-3 text-base',
    };
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
