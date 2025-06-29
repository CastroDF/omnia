import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test-utils/render';
import AuthButton from './AuthButton';

// Mock next-auth/react properly
vi.mock('next-auth/react', () => {
  const mockSignIn = vi.fn();
  const mockSignOut = vi.fn();
  const mockUseSession = vi.fn();

  return {
    useSession: mockUseSession,
    signIn: mockSignIn,
    signOut: mockSignOut,
  };
});

// Get the mocked functions
const { useSession, signIn, signOut } = await import('next-auth/react');

describe('AuthButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sign in button when not authenticated', () => {
    (useSession as any).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AuthButton />);

    const signInButton = screen.getByText('Login with Google');
    expect(signInButton).toBeInTheDocument();
  });

  it('calls signIn when sign in button is clicked', () => {
    (useSession as any).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<AuthButton />);

    const signInButton = screen.getByText('Login with Google');
    fireEvent.click(signInButton);

    expect(signIn).toHaveBeenCalledWith('google');
  });

  it('renders user name and sign out button when authenticated', () => {
    (useSession as any).mockReturnValue({
      data: {
        user: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      },
      status: 'authenticated',
    });

    render(<AuthButton />);

    expect(screen.getByText('Logout (John Doe)')).toBeInTheDocument();
  });

  it('calls signOut when sign out button is clicked', () => {
    (useSession as any).mockReturnValue({
      data: {
        user: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      },
      status: 'authenticated',
    });

    render(<AuthButton />);

    const signOutButton = screen.getByText('Logout (John Doe)');
    fireEvent.click(signOutButton);

    expect(signOut).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    (useSession as any).mockReturnValue({
      data: null,
      status: 'loading',
    });

    render(<AuthButton />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
