import '@testing-library/jest-dom';

if (typeof global.fetch !== 'function') {
  global.fetch = jest.fn(async () => ({
    ok: true,
    json: async () => ({}),
  }) as unknown as Response) as unknown as typeof fetch;
}

if (typeof global.Response === 'undefined') {
  class MockResponse {
    body: unknown;
    ok: boolean;

    constructor(body: unknown, init?: { ok?: boolean }) {
      this.body = body;
      this.ok = init?.ok ?? true;
    }

    async json() {
      return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
    }
  }

  global.Response = MockResponse as typeof Response;
}

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Mock Firebase
jest.mock('./src/app/db/firebase/config', () => ({
  auth: {},
  db: {},
  app: {},
}));

// Mock environment variables
process.env.NEXT_PUBLIC_OPENAI_KEY = 'test-key';
process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-key';
process.env.RESEND_API_KEY = 'test-key';
