/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

// Mock next-auth/middleware properly
const mockWithAuth = vi.fn((_middleware: unknown, _options?: unknown) => {
  return vi.fn((_req: NextRequest) => {
    return NextResponse.next();
  });
});

vi.mock('next-auth/middleware', () => ({
  default: mockWithAuth,
  withAuth: mockWithAuth,
}));

// Mock authOptions
vi.mock('./lib/authOptions', () => ({
  authOptions: {
    providers: [],
    callbacks: {},
  },
}));

describe('Middleware', () => {
  it('should be properly configured', async () => {
    // Test that middleware can be imported
    try {
      const middleware = await import('./middleware');
      expect(middleware.default).toBeDefined();
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('should handle authentication middleware', async () => {
    const middlewareModule = await import('./middleware');

    // Create a mock request
    const req = new NextRequest('http://localhost:3000/dashboard');

    // Call the middleware (skip type check for testing)
    const response = middlewareModule.default(req as never, {} as never);

    expect(response).toBeDefined();
    expect(mockWithAuth).toHaveBeenCalled();
  });

  it('should export config for protected routes', async () => {
    const middlewareModule = await import('./middleware');

    // Check if config is exported (for protected routes matching)
    expect(middlewareModule.config).toBeDefined();
  });
});
