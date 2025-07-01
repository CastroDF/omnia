import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface HeroProps {
  title: string;
  subtitle: string;
  badge?: string;
  primaryCta?: {
    text: string;
    onClick: () => void;
  };
  secondaryCta?: {
    text: string;
    onClick: () => void;
  };
  stats?: string;
  bgGradient?: string;
  color?: string;
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  badge,
  primaryCta,
  secondaryCta,
  stats,
  bgGradient = 'bg-gradient-to-br from-blue-600 to-purple-700',
  color = 'text-white',
  className,
  ...props
}) => {
  return (
    <div className={cn('py-20', bgGradient, color, className)} {...props}>
      <div className='container max-w-7xl mx-auto px-4'>
        <div className='flex flex-col items-center text-center space-y-8'>
          {badge && (
            <span className='inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white'>
              {badge}
            </span>
          )}

          <div className='space-y-4 max-w-4xl'>
            <h1 className='text-4xl md:text-6xl font-bold leading-tight'>
              {title}
            </h1>

            <p
              className={cn(
                'text-xl max-w-3xl',
                color === 'text-white' ? 'text-blue-100' : 'text-gray-600',
              )}
            >
              {subtitle}
            </p>
          </div>

          {(primaryCta || secondaryCta) && (
            <div className='flex flex-wrap justify-center gap-4'>
              {primaryCta && (
                <Button
                  size='lg'
                  className='bg-yellow-500 hover:bg-yellow-400 text-black font-bold'
                  onClick={primaryCta.onClick}
                >
                  {primaryCta.text}
                </Button>
              )}

              {secondaryCta && (
                <Button
                  size='lg'
                  variant='outline'
                  className={cn(
                    'border-2 font-semibold',
                    color === 'text-white'
                      ? 'border-white text-white hover:bg-white/20'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100',
                  )}
                  onClick={secondaryCta.onClick}
                >
                  {secondaryCta.text}
                </Button>
              )}
            </div>
          )}

          {stats && (
            <p
              className={cn(
                'text-sm',
                color === 'text-white' ? 'text-blue-200' : 'text-gray-500',
              )}
            >
              {stats}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
