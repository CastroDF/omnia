import { Box } from '@chakra-ui/react';
import React from 'react';

// Card.Root: Main container
function CardRoot({ children, ...props }: React.ComponentProps<typeof Box>) {
  return (
    <Box
      bg='white'
      borderRadius='xl'
      boxShadow='md'
      borderWidth={props.borderWidth || 1}
      borderColor={props.borderColor || 'gray.200'}
      {...props}
    >
      {children}
    </Box>
  );
}

// Card.Body: Main content
function CardBody({ children, ...props }: React.ComponentProps<typeof Box>) {
  return (
    <Box p={props.p || 6} {...props}>
      {children}
    </Box>
  );
}

// Card.Header: Card header
function CardHeader({ children, ...props }: React.ComponentProps<typeof Box>) {
  return (
    <Box
      px={props.px || 6}
      py={props.py || 4}
      borderBottom='1px'
      borderColor='gray.100'
      {...props}
    >
      {children}
    </Box>
  );
}

export const Card = {
  Root: CardRoot,
  Body: CardBody,
  Header: CardHeader,
};

// English-only comments as per user rules.
