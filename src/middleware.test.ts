import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';

// Mock next-auth/middleware properly
const mockWithAuth = vi.fn((middleware: any, options?: any) => {
  return vi.fn((req: any) => {
    return new Response('OK', { status: 200 });
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

    // Call the middleware
    const response = middlewareModule.default(req, {} as any);

    expect(response).toBeDefined();
    expect(mockWithAuth).toHaveBeenCalled();
  });

  it('should export config for protected routes', async () => {
    const middlewareModule = await import('./middleware');

    // Check if config is exported (for protected routes matching)
    expect(middlewareModule.config).toBeDefined();
  });
});
