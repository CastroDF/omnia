import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MongoClient } from 'mongodb';

// Mock MongoDB client
vi.mock('mongodb', () => ({
  MongoClient: vi.fn().mockImplementation(() => ({
    connect: vi.fn().mockResolvedValue('connected'),
  })),
}));

describe('MongoDB Connection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    // Reset global variables
    delete (global as any)._mongoClientPromise;
    // Set up basic environment variables for most tests
    vi.stubEnv(
      'MONGODB_URI',
      'mongodb+srv://testuser:testpass@omnia-cluster.dnwcklu.mongodb.net/?retryWrites=true&w=majority&appName=omnia-cluster',
    );
  });

  it('should throw error when environment variables are missing', async () => {
    // Clear the environment variables for this specific test
    vi.stubEnv('MONGODB_URI', '');

    await expect(async () => {
      // Import the module which should throw immediately
      await import('./mongodb');
    }).rejects.toThrow('Invalid/Missing environment variable: "MONGODB_URI"');
  });

  it('should create MongoDB connection URI correctly', async () => {
    const { default: clientPromise } = await import('./mongodb');

    expect(MongoClient).toHaveBeenCalledWith(
      'mongodb+srv://testuser:testpass@omnia-cluster.dnwcklu.mongodb.net/?retryWrites=true&w=majority&appName=omnia-cluster',
      {},
    );

    expect(clientPromise).toBeDefined();
  });

  it('should cache client in development environment', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    const { default: clientPromise1 } = await import('./mongodb');

    // Reset modules to force re-import but keep the global cache
    vi.resetModules();

    const { default: clientPromise2 } = await import('./mongodb');

    // In development, the client promise should be cached globally
    expect((global as any)._mongoClientPromise).toBeDefined();

    // Both should use the same cached promise
    expect(clientPromise1).toBe(clientPromise2);
  });

  it('should create new client in production environment', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const { default: clientPromise } = await import('./mongodb');

    expect(clientPromise).toBeDefined();
    expect(MongoClient).toHaveBeenCalled();

    // In production, no global caching should occur
    expect((global as any)._mongoClientPromise).toBeUndefined();
  });

  it('should handle connection properly', async () => {
    const mockConnect = vi.fn().mockResolvedValue('connected');
    (MongoClient as any).mockImplementation(() => ({
      connect: mockConnect,
    }));

    const { default: clientPromise } = await import('./mongodb');
    const result = await clientPromise;

    expect(result).toBe('connected');
    expect(mockConnect).toHaveBeenCalled();
  });
});
