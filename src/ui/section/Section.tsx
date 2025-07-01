import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionProps {
  children: React.ReactNode;
  bg?: string;
  py?: string;
  px?: string;
  maxW?: string;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  bg = 'bg-transparent',
  py = 'py-20',
  px,
  maxW = 'max-w-7xl',
  className,
  ...props
}) => {
  return (
    <div className={cn(bg, py, px, className)} {...props}>
      <div className={cn('container mx-auto px-4', maxW)}>{children}</div>
    </div>
  );
};

// English-only comments as per user rules.
