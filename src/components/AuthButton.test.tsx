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
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: vi.fn(),
    });

    render(<AuthButton />);

    const signInButton = screen.getByText('Login with Google');
    expect(signInButton).toBeInTheDocument();
  });

  it('calls signIn when sign in button is clicked', () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: vi.fn(),
    });

    render(<AuthButton />);

    const signInButton = screen.getByText('Login with Google');
    fireEvent.click(signInButton);

    expect(signIn).toHaveBeenCalledWith('google');
  });

  it('renders user name and sign out button when authenticated', () => {
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: {
          id: 'test-user-id',
          name: 'John Doe',
          email: 'john@example.com',
        },
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: vi.fn(),
    });

    render(<AuthButton />);

    expect(screen.getByText('Logout (John Doe)')).toBeInTheDocument();
  });

  it('calls signOut when sign out button is clicked', () => {
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: {
          id: 'test-user-id',
          name: 'John Doe',
          email: 'john@example.com',
        },
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: vi.fn(),
    });

    render(<AuthButton />);

    const signOutButton = screen.getByText('Logout (John Doe)');
    fireEvent.click(signOutButton);

    expect(signOut).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'loading',
      update: vi.fn(),
    });

    render(<AuthButton />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
