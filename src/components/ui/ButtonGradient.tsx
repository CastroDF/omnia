import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonGradientProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ButtonGradient = ({
  children,
  size = 'md',
  className = '',
  ...props
}: ButtonGradientProps) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`bg-gradient-to-r from-[#00E0FF] to-[#A9FFB0] text-black rounded-xl font-semibold shadow-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105 active:scale-95 ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonGradient;
