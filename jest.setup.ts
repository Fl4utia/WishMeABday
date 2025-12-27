import '@testing-library/jest-dom';

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
process.env.NEXT_PUBLIC_RESEND_API_KEY = 'test-key';
