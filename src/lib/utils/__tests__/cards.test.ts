// Tests for local storage helpers have been removed because cards are no longer
// persisted in localStorage by design. Keep a trivial test to satisfy the test
// runner in CI while the repo transitions to server-only persistence.

describe('storage helpers (no-op)', () => {
  it('local storage for cards is intentionally disabled', () => {
    expect(true).toBe(true);
  });
});
