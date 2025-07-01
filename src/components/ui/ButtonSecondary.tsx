import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonSecondaryProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'outline' | 'ghost' | 'subtle';
  disabled?: boolean;
}

const ButtonSecondary = ({
  children,
  size = 'md',
  variant = 'subtle',
  className = '',
  disabled = false,
  ...props
}: ButtonSecondaryProps) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    outline: disabled
      ? 'bg-transparent border-2 border-white/10 text-white/50 cursor-not-allowed'
      : 'bg-transparent border-2 border-white/20 text-white hover:border-white/40 hover:bg-white/5',
    ghost: disabled
      ? 'bg-transparent text-white/50 cursor-not-allowed'
      : 'bg-transparent text-white/80 hover:text-white hover:bg-white/10',
    subtle: disabled
      ? 'bg-white/5 text-white/50 border border-white/10 cursor-not-allowed'
      : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30',
  };

  const hoverClasses = disabled
    ? ''
    : 'transform hover:scale-105 active:scale-95';

  return (
    <button
      className={`rounded-xl font-semibold transition-all duration-200 ${hoverClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonSecondary;
