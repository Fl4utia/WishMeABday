import { buildLocalBirthdayMessage } from '../messageGenerator';

describe('buildLocalBirthdayMessage', () => {
  it('creates a warm fallback message without an API key', () => {
    const message = buildLocalBirthdayMessage('');

    expect(message).toContain('Happy Birthday');
    expect(message.length).toBeGreaterThan(20);
  });

  it('uses the supplied description when available', () => {
    const message = buildLocalBirthdayMessage('loves hiking and great coffee');

    expect(message).toContain('hiking');
    expect(message).toContain('coffee');
  });
});
