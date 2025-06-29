import { Box, Container, BoxProps } from '@chakra-ui/react';
import React from 'react';

export interface SectionProps extends BoxProps {
  children: React.ReactNode;
  bg?: string;
  py?: number | string;
  px?: number | string;
  maxW?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  bg = 'transparent',
  py = 20,
  px,
  maxW = '7xl',
  ...props
}) => {
  return (
    <Box bg={bg} py={py} px={px} {...props}>
      <Container maxW={maxW}>{children}</Container>
    </Box>
  );
};

// English-only comments as per user rules.
