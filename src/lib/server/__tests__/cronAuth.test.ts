import { isAuthorizedCronRequest } from '../cronAuth';

function createRequest(url: string, headers: Record<string, string> = {}) {
  return {
    url,
    headers: {
      get(name: string) {
        return headers[name.toLowerCase()] ?? null;
      },
    },
  } as unknown as Request;
}

describe('cron auth', () => {
  const originalCronSecret = process.env.CRON_SECRET;
  const originalVercelCronSecret = process.env.VERCEL_CRON_SECRET;

  afterEach(() => {
    process.env.CRON_SECRET = originalCronSecret;
    process.env.VERCEL_CRON_SECRET = originalVercelCronSecret;
    delete process.env.NEXT_PUBLIC_CRON_SECRET;
  });

  it('accepts the secret from the query string', () => {
    process.env.CRON_SECRET = 'abc123';

    const request = createRequest('https://example.com/api/cron/send-scheduled?secret=abc123');

    expect(isAuthorizedCronRequest(request)).toBe(true);
  });

  it('accepts Vercel cron headers', () => {
    process.env.VERCEL_CRON_SECRET = 'vercel-secret';

    const request = createRequest('https://example.com/api/cron/send-scheduled', {
      'x-vercel-cron-secret': 'vercel-secret',
    });

    expect(isAuthorizedCronRequest(request)).toBe(true);
  });

  it('rejects mismatched secrets', () => {
    process.env.CRON_SECRET = 'abc123';

    const request = createRequest('https://example.com/api/cron/send-scheduled?secret=wrong');

    expect(isAuthorizedCronRequest(request)).toBe(false);
  });
});
