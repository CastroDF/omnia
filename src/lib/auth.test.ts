import { describe, it, expect, vi } from 'vitest';
import { getSession } from './auth';

// Mock next-auth
vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}));

// Mock authOptions
vi.mock('./authOptions', () => ({
  authOptions: {
    providers: [],
    callbacks: {},
  },
}));

describe('Auth utilities', () => {
  it('should export getSession function', () => {
    expect(getSession).toBeDefined();
    expect(typeof getSession).toBe('function');
  });

  it('should call getServerSession with authOptions', async () => {
    const { getServerSession } = await import('next-auth/next');
    const { authOptions } = await import('./authOptions');

    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'test-id', email: 'test@example.com' },
      expires: '2024-12-31',
    });

    const session = await getSession();

    expect(getServerSession).toHaveBeenCalledWith(authOptions);
    expect(session).toEqual({
      user: { id: 'test-id', email: 'test@example.com' },
      expires: '2024-12-31',
    });
  });

  it('should return null when no session exists', async () => {
    const { getServerSession } = await import('next-auth/next');

    vi.mocked(getServerSession).mockResolvedValue(null);

    const session = await getSession();

    expect(session).toBeNull();
  });
});
