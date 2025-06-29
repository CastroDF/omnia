import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test-utils/render';
import { Card } from './Card';

describe('Card Component', () => {
  it('renders Card.Root with children', () => {
    render(
      <Card.Root data-testid='card-root'>
        <div>Card content</div>
      </Card.Root>,
    );

    expect(screen.getByTestId('card-root')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders Card.Body with children', () => {
    render(
      <Card.Body data-testid='card-body'>
        <p>Body content</p>
      </Card.Body>,
    );

    expect(screen.getByTestId('card-body')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('renders complete card structure', () => {
    render(
      <Card.Root data-testid='card'>
        <Card.Body>
          <h2>Card Title</h2>
          <p>Card description text</p>
        </Card.Body>
      </Card.Root>,
    );

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card description text')).toBeInTheDocument();
  });

  it('applies additional props to Card.Root', () => {
    render(
      <Card.Root className='custom-card' data-testid='card'>
        Content
      </Card.Root>,
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('custom-card');
    expect(card).toHaveTextContent('Content');
  });

  it('applies additional props to Card.Body', () => {
    render(
      <Card.Body className='custom-body' data-testid='body'>
        Body content
      </Card.Body>,
    );

    const body = screen.getByTestId('body');
    expect(body).toHaveClass('custom-body');
    expect(body).toHaveTextContent('Body content');
  });

  it('handles nested content correctly', () => {
    render(
      <Card.Root>
        <Card.Body>
          <div>
            <span data-testid='nested-content'>Nested content</span>
            <button>Action</button>
          </div>
        </Card.Body>
      </Card.Root>,
    );

    expect(screen.getByTestId('nested-content')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
});
