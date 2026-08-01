import {
  formatScheduledDelivery,
  isScheduledDeliveryDue,
  normalizeScheduledDelivery,
  parseScheduledDelivery,
} from '../scheduling';

describe('scheduling helpers', () => {
  it('parses datetime-local values as local time', () => {
    const parsed = parseScheduledDelivery('2026-08-02T11:00');

    expect(parsed).not.toBeNull();
    expect(parsed?.getFullYear()).toBe(2026);
    expect(parsed?.getMonth()).toBe(7);
    expect(parsed?.getDate()).toBe(2);
    expect(parsed?.getHours()).toBe(11);
    expect(parsed?.getMinutes()).toBe(0);
  });

  it('treats date-only values as the first minute of the day', () => {
    const parsed = parseScheduledDelivery('2026-08-02');

    expect(parsed).not.toBeNull();
    expect(parsed?.getFullYear()).toBe(2026);
    expect(parsed?.getMonth()).toBe(7);
    expect(parsed?.getDate()).toBe(2);
    expect(parsed?.getHours()).toBe(0);
    expect(parsed?.getMinutes()).toBe(1);
  });

  it('detects due delivery correctly without waiting', () => {
    const scheduled = '2026-08-02T11:00';

    expect(isScheduledDeliveryDue(scheduled, new Date(2026, 7, 2, 10, 59))).toBe(false);
    expect(isScheduledDeliveryDue(scheduled, new Date(2026, 7, 2, 11, 0))).toBe(true);
    expect(isScheduledDeliveryDue(scheduled, new Date(2026, 7, 2, 11, 1))).toBe(true);
  });

  it('uses the first minute of the day for date-only schedules', () => {
    expect(isScheduledDeliveryDue('2026-08-02', new Date(2026, 7, 2, 0, 0))).toBe(false);
    expect(isScheduledDeliveryDue('2026-08-02', new Date(2026, 7, 2, 0, 1))).toBe(true);
  });

  it('normalizes scheduled delivery into an ISO timestamp', () => {
    const normalized = normalizeScheduledDelivery('2026-08-02T11:00');

    expect(normalized).toMatch(/Z$/);
    expect(new Date(normalized).getFullYear()).toBe(2026);
  });

  it('formats scheduled delivery for display', () => {
    expect(formatScheduledDelivery('2026-08-02T11:00')).toContain('2026');
    expect(formatScheduledDelivery(undefined)).toBe('Not scheduled');
  });
});
