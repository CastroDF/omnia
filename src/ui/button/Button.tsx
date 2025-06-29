import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
  HStack,
} from '@chakra-ui/react';
import React from 'react';

export interface ButtonProps extends Omit<ChakraButtonProps, 'variant'> {
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      leftIcon,
      rightIcon,
      variant = 'primary',
      size = 'md',
      ...props
    },
    ref,
  ) => {
    // Get custom styling for dark theme dashboard
    const getButtonStyles = () => {
      switch (variant) {
        case 'primary':
          return {
            bg: 'teal.600',
            color: 'white',
            _hover: { bg: 'teal.500' },
            _active: { bg: 'teal.700' },
            _focus: { boxShadow: '0 0 0 3px rgba(56, 178, 172, 0.3)' },
          };
        case 'secondary':
          return {
            bg: 'gray.700',
            color: 'gray.100',
            _hover: { bg: 'gray.600' },
            _active: { bg: 'gray.800' },
            _focus: { boxShadow: '0 0 0 3px rgba(107, 114, 128, 0.3)' },
          };
        case 'outline':
          return {
            bg: 'transparent',
            color: 'gray.300',
            border: '1px solid',
            borderColor: 'gray.600',
            _hover: { bg: 'gray.700', color: 'white', borderColor: 'gray.500' },
            _active: { bg: 'gray.800' },
            _focus: { boxShadow: '0 0 0 3px rgba(107, 114, 128, 0.3)' },
          };
        case 'ghost':
          return {
            bg: 'transparent',
            color: 'gray.300',
            _hover: { bg: 'gray.700', color: 'white' },
            _active: { bg: 'gray.800' },
            _focus: { boxShadow: '0 0 0 3px rgba(107, 114, 128, 0.3)' },
          };
        default:
          return {
            bg: 'teal.600',
            color: 'white',
            _hover: { bg: 'teal.500' },
            _active: { bg: 'teal.700' },
            _focus: { boxShadow: '0 0 0 3px rgba(56, 178, 172, 0.3)' },
          };
      }
    };

    return (
      <ChakraButton
        ref={ref}
        size={size}
        borderRadius='lg'
        fontWeight='semibold'
        transition='all 0.2s'
        {...getButtonStyles()}
        {...props}
      >
        <HStack gap={2}>
          {leftIcon && leftIcon}
          {children}
          {rightIcon && rightIcon}
        </HStack>
      </ChakraButton>
    );
  },
);

Button.displayName = 'Button';
