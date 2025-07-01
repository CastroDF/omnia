import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      leftIcon,
      rightIcon,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      className,
      ...props
    },
    ref,
  ) => {
    // Get custom styling for dark theme dashboard
    const getButtonStyles = () => {
      const baseStyles =
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

      const sizeStyles = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      };

      const variantStyles = {
        primary:
          'bg-teal-600 text-white hover:bg-teal-500 active:bg-teal-700 focus:ring-teal-300',
        secondary:
          'bg-gray-700 text-gray-100 hover:bg-gray-600 active:bg-gray-800 focus:ring-gray-300',
        outline:
          'bg-transparent text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white hover:border-gray-500 active:bg-gray-800 focus:ring-gray-300',
        ghost:
          'bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white active:bg-gray-800 focus:ring-gray-300',
      };

      return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`;
    };

    return (
      <button
        ref={ref}
        className={cn(getButtonStyles(), className)}
        disabled={disabled || loading}
        {...props}
      >
        {leftIcon && !loading && leftIcon}
        {loading ? 'Loading' : children}
        {rightIcon && !loading && rightIcon}
      </button>
    );
  },
);

Button.displayName = 'Button';
