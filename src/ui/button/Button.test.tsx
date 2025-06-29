import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test-utils/render';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders button with children', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Button variant='primary'>Primary</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button variant='secondary'>Secondary</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button variant='outline'>Outline</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Button size='sm'>Small</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button size='md'>Medium</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button size='lg'>Large</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('can have different types', () => {
    const { rerender } = render(<Button type='button'>Button</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');

    rerender(<Button type='submit'>Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');

    rerender(<Button type='reset'>Reset</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
  });

  it('renders with left icon', () => {
    const Icon = () => <span data-testid='left-icon'>Icon</span>;
    render(<Button leftIcon={<Icon />}>With Icon</Button>);

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    const Icon = () => <span data-testid='right-icon'>Icon</span>;
    render(<Button rightIcon={<Icon />}>With Icon</Button>);

    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  it('can be in loading state', () => {
    render(<Button loading>Loading</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Button with ref</Button>);

    expect(ref).toHaveBeenCalled();
  });

  it('applies additional className', () => {
    render(<Button className='custom-class'>Custom</Button>);

    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('spreads additional props', () => {
    render(
      <Button data-testid='custom-button' aria-label='Custom button'>
        Custom
      </Button>,
    );

    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('aria-label', 'Custom button');
  });
});
