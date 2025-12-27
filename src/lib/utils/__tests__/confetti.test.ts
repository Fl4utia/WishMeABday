/**
 * Unit tests for confetti utilities
 */
import { launchConfetti, launchCenterConfetti } from '../confetti';
import confetti from 'canvas-confetti';

// Mock canvas-confetti
jest.mock('canvas-confetti');

describe('Confetti Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('launchConfetti', () => {
    it('should launch confetti from element position', async () => {
      const mockEvent = {
        currentTarget: {
          getBoundingClientRect: () => ({
            left: 100,
            top: 100,
            width: 50,
            height: 50,
          }),
        },
      } as any;

      window.innerWidth = 1000;
      window.innerHeight = 800;

      const promise = launchConfetti(mockEvent, 100);
      
      // Fast-forward time
      jest.advanceTimersByTime(100);
      
      await promise;

      expect(confetti).toHaveBeenCalled();
    });

    it('should use default duration if not provided', async () => {
      const mockEvent = {
        currentTarget: {
          getBoundingClientRect: () => ({
            left: 100,
            top: 100,
            width: 50,
            height: 50,
          }),
        },
      } as any;

      const promise = launchConfetti(mockEvent);
      
      jest.advanceTimersByTime(1000);
      
      await promise;

      expect(confetti).toHaveBeenCalled();
    });
  });

  describe('launchCenterConfetti', () => {
    it('should launch confetti from center', () => {
      launchCenterConfetti(100);
      
      jest.advanceTimersByTime(50);

      expect(confetti).toHaveBeenCalled();
    });
  });
});
