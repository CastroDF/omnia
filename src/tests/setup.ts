/* eslint-disable @typescript-eslint/no-unused-vars */
import '@testing-library/jest-dom/vitest';
import { JSDOM } from 'jsdom';
import ResizeObserver from 'resize-observer-polyfill';
import { vi } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';

const { window } = new JSDOM();

// ResizeObserver mock
vi.stubGlobal('ResizeObserver', ResizeObserver);
window['ResizeObserver'] = ResizeObserver;

// IntersectionObserver mock
const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}));
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
window['IntersectionObserver'] = IntersectionObserverMock;

// Scroll Methods mock
window.Element.prototype.scrollTo = () => {};
window.Element.prototype.scrollIntoView = () => {};

// requestAnimationFrame mock
window.requestAnimationFrame = (cb: FrameRequestCallback) =>
  setTimeout(cb, 1000 / 60);

// URL object mock
window.URL.createObjectURL = () => 'https://i.pravatar.cc/300';
window.URL.revokeObjectURL = () => {};

// navigator mock
Object.defineProperty(window, 'navigator', {
  value: {
    clipboard: {
      writeText: vi.fn(),
    },
  },
});

// Override globalThis
Object.assign(global, { window, document: window.document });

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/test-path',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next-auth
const mockSignIn = vi.fn();
const mockSignOut = vi.fn();
const mockUseSession = vi.fn(() => ({
  data: {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
    },
  },
  status: 'authenticated',
}));

vi.mock('next-auth/react', () => ({
  useSession: mockUseSession,
  signIn: mockSignIn,
  signOut: mockSignOut,
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock next-auth middleware
vi.mock('next-auth/middleware', () => {
  const mockWithAuth = vi.fn((_middleware: unknown, _options?: unknown) => {
    return vi.fn((_req: unknown) => {
      return new Response('OK', { status: 200 });
    });
  });

  return {
    default: mockWithAuth,
    withAuth: mockWithAuth,
  };
});

// Mock mongoose
const mockObjectId = vi.fn().mockImplementation(() => 'test-object-id');

// Create the Types object first
const mockTypes = {
  ObjectId: mockObjectId,
};

const mockMongooseFind = vi.fn().mockReturnValue({
  sort: vi.fn().mockReturnValue({
    toArray: vi.fn().mockResolvedValue([]),
  }),
});

const mockModel = vi.fn().mockImplementation(() => ({
  find: mockMongooseFind,
  findOne: vi.fn().mockResolvedValue(null),
  save: vi.fn().mockResolvedValue({}),
  create: vi.fn().mockResolvedValue({}),
}));

// Create MockSchema class with proper Types
const MockSchema = class MockSchema {
  static Types = mockTypes;
  constructor(_schema: unknown, _options?: unknown) {
    // Constructor implementation
  }
};

// Add Types to the MockSchema prototype as well
MockSchema.Types = mockTypes;

const mockMongoose = {
  Schema: MockSchema,
  model: mockModel,
  models: {},
  connect: vi.fn().mockResolvedValue({}),
  connection: {
    readyState: 1,
  },
  Types: mockTypes,
};

vi.mock('mongoose', () => ({
  default: mockMongoose,
  Schema: MockSchema,
  model: mockModel,
  models: {},
  connect: vi.fn().mockResolvedValue({}),
  Types: mockTypes,
}));

// Mock MongoDB
const mockMongoToArray = vi.fn().mockResolvedValue([]);
const mockMongoSort = vi.fn().mockReturnValue({ toArray: mockMongoToArray });
const mockMongoFind = vi.fn().mockReturnValue({ sort: mockMongoSort });
const mockMongoFindOne = vi.fn().mockResolvedValue(null);
const mockMongoInsertOne = vi.fn().mockResolvedValue({ insertedId: 'test-id' });
const mockMongoUpdateOne = vi.fn().mockResolvedValue({ modifiedCount: 1 });
const mockMongoDeleteOne = vi.fn().mockResolvedValue({ deletedCount: 1 });

const mockMongoCollection = vi.fn(() => ({
  find: mockMongoFind,
  findOne: mockMongoFindOne,
  insertOne: mockMongoInsertOne,
  updateOne: mockMongoUpdateOne,
  deleteOne: mockMongoDeleteOne,
}));

const mockMongoDb = vi.fn(() => ({
  collection: mockMongoCollection,
}));

const mockMongoClient = {
  db: mockMongoDb,
};

vi.mock('@/lib/mongodb', () => ({
  default: Promise.resolve(mockMongoClient),
}));

// Mock AWS S3
const mockS3Send = vi.fn(() => Promise.resolve({}));
const mockS3Client = vi.fn().mockImplementation(() => ({
  send: mockS3Send,
}));

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: mockS3Client,
  PutObjectCommand: vi.fn().mockImplementation(params => ({ params })),
  DeleteObjectCommand: vi.fn().mockImplementation(params => ({ params })),
}));

// Mock slugify
vi.mock('slugify', () => ({
  default: vi.fn((str: string, _options?: unknown) => {
    return str
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }),
}));

// Mock react-icons
vi.mock('react-icons/fi', () => ({
  FiUpload: () => 'FiUpload',
  FiSmartphone: () => 'FiSmartphone',
  FiTablet: () => 'FiTablet',
  FiCheckCircle: () => 'FiCheckCircle',
  FiBox: () => 'FiBox',
  FiArrowLeft: () => 'FiArrowLeft',
  FiArrowRight: () => 'FiArrowRight',
  FiInfo: () => 'FiInfo',
  FiAlertCircle: () => 'FiAlertCircle',
}));

// Mock File API
global.File = class File {
  name: string;
  type: string;
  size: number;
  lastModified: number;

  constructor(
    fileBits: BlobPart[],
    fileName: string,
    options?: FilePropertyBag,
  ) {
    this.name = fileName;
    this.type = options?.type || '';
    this.size = fileBits.reduce((acc, part) => {
      if (typeof part === 'string') return acc + part.length;
      if (part instanceof ArrayBuffer) return acc + part.byteLength;
      return acc;
    }, 0);
    this.lastModified = options?.lastModified || Date.now();
  }

  arrayBuffer(): Promise<ArrayBuffer> {
    return Promise.resolve(new ArrayBuffer(this.size));
  }

  text(): Promise<string> {
    return Promise.resolve('');
  }

  stream(): ReadableStream<Uint8Array> {
    return new ReadableStream();
  }

  slice(): Blob {
    return new Blob();
  }
} as unknown as typeof File;

// Mock FormData with proper multipart support
global.FormData = class FormData {
  private data: Map<string, unknown> = new Map();
  private _boundary: string = '----formdata-test-boundary';

  append(name: string, value: unknown, _filename?: string): void {
    if (value instanceof File) {
      this.data.set(name, value);
    } else {
      this.data.set(name, String(value));
    }
  }

  get(name: string): unknown {
    return this.data.get(name) || null;
  }

  getAll(name: string): unknown[] {
    const value = this.data.get(name);
    return value ? [value] : [];
  }

  has(name: string): boolean {
    return this.data.has(name);
  }

  delete(name: string): void {
    this.data.delete(name);
  }

  set(name: string, value: unknown): void {
    this.data.set(name, value);
  }

  keys(): IterableIterator<string> {
    return this.data.keys();
  }

  values(): IterableIterator<unknown> {
    return this.data.values();
  }

  forEach(callback: (value: unknown, key: string) => void): void {
    this.data.forEach(callback);
  }

  entries(): IterableIterator<[string, unknown]> {
    return this.data.entries();
  }

  [Symbol.iterator](): IterableIterator<[string, unknown]> {
    return this.data.entries();
  }

  toString(): string {
    return '[object FormData]';
  }
} as unknown as typeof FormData;

// Mock Request for Next.js API routes
global.Request = class Request {
  url: string;
  method: string;
  headers: Map<string, string>;
  body: unknown;

  constructor(input: string | Request, init?: RequestInit) {
    this.url = typeof input === 'string' ? input : input.url;
    this.method = init?.method || 'GET';
    this.headers = new Map();
    this.body = init?.body || null;

    if (init?.headers) {
      Object.entries(init.headers as Record<string, string>).forEach(
        ([key, value]) => {
          this.headers.set(key, value);
        },
      );
    }
  }

  async formData(): Promise<FormData> {
    return new FormData();
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    return new ArrayBuffer(0);
  }

  async json(): Promise<unknown> {
    return {};
  }

  async blob(): Promise<Blob> {
    return new Blob();
  }

  async text(): Promise<string> {
    return '';
  }

  clone(): Request {
    return new Request(this.url, {
      method: this.method,
      headers: Object.fromEntries(this.headers),
      body: this.body as BodyInit,
    });
  }
} as unknown as typeof Request;

// Mock fetch for API tests
global.fetch = vi.fn();

// Environment variables
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-google-client-secret';
process.env.MONGODB_USERNAME = 'test-username';
process.env.MONGODB_PASSWORD = 'test-password';
process.env.AWS_REGION = 'us-east-1';
process.env.AWS_ACCESS_KEY_ID = 'test-access-key';
process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-key';
process.env.S3_BUCKET_NAME = 'test-bucket';
process.env.NEXTAUTH_URL = 'http://localhost:3000';

// Mock formidable for API testing with proper FormData support
vi.mock('formidable', () => ({
  default: vi.fn().mockImplementation((_options?: Record<string, unknown>) => ({
    parse: vi.fn(
      (
        req: unknown,
        callback: (
          err: Error | null,
          fields: Record<string, unknown>,
          files: Record<string, unknown>,
        ) => void,
      ) => {
        // Simulate proper form parsing with fields and files
        const fields: Record<string, unknown> = {};
        const files: Record<string, unknown> = {};

        // Simulate parsing body content if available
        if ((req as { body?: unknown }).body) {
          try {
            // Mock basic field extraction
            fields.name = 'Test Model';
            fields.description = 'Test description';

            // Mock file extraction
            files.usdzFile = {
              originalFilename: 'test.usdz',
              mimetype: 'model/vnd.usdz+zip',
              size: 1000,
              filepath: '/tmp/test.usdz',
            };
            files.glbFile = {
              originalFilename: 'test.glb',
              mimetype: 'model/gltf-binary',
              size: 1000,
              filepath: '/tmp/test.glb',
            };

            // Call callback with success
            callback(null, fields, files);
          } catch (error) {
            callback(error as Error, {}, {});
          }
        } else {
          callback(null, fields, files);
        }
      },
    ),
  })),
}));

// Mock slugify
vi.mock('slugify', () => ({
  default: vi.fn((str: string, _options?: Record<string, unknown>) => {
    return str
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }),
}));
