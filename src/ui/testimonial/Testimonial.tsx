import React from 'react';
import { FiStar } from 'react-icons/fi';
import { cn } from '@/lib/utils';

export interface TestimonialProps {
  text: string;
  author: string;
  role: string;
  rating?: number;
  company?: string;
  className?: string;
}

export const Testimonial: React.FC<TestimonialProps> = ({
  text,
  author,
  role,
  rating = 5,
  company,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      <div className='flex items-center'>
        {[...Array(rating)].map((_, i) => (
          <FiStar key={i} className='text-yellow-400' />
        ))}
      </div>

      <p className='text-sm text-gray-600'>&ldquo;{text}&rdquo;</p>

      <div className='space-y-1'>
        <p className='font-bold text-gray-900'>{author}</p>
        <p className='text-sm text-gray-500'>
          {role}
          {company && ` - ${company}`}
        </p>
      </div>
    </div>
  );
};

// English-only comments as per user rules.
