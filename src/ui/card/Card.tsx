import React from 'react';
import { cn } from '@/lib/utils';

// Card.Root: Main container
const CardRoot = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-md border border-gray-200',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Card.Body: Main content
const CardBody = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  );
};

// Card.Header: Card header
const CardHeader = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('px-6 py-4 border-b border-gray-100', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const Card = {
  Root: CardRoot,
  Body: CardBody,
  Header: CardHeader,
};

// English-only comments as per user rules.
