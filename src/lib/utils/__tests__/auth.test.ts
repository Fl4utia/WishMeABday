/**
 * Unit tests for authentication utilities
 */
import { signInWithGoogle, signOut, isUserAuthenticated } from '../auth';
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';

// Mock Firebase auth
jest.mock('firebase/auth');
jest.mock('@/app/db/firebase/config', () => ({
  auth: {},
}));

describe('Authentication Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  describe('signInWithGoogle', () => {
    it('should sign in successfully and return user', async () => {
      const mockUser = { uid: '123', email: 'test@example.com' };
      (signInWithPopup as jest.Mock).mockResolvedValue({
        user: mockUser,
      });

      const result = await signInWithGoogle();

      expect(result).toEqual(mockUser);
      expect(sessionStorage.getItem('user')).toBe('true');
    });

    it('should throw error on sign-in failure', async () => {
      (signInWithPopup as jest.Mock).mockRejectedValue(new Error('Sign-in failed'));

      await expect(signInWithGoogle()).rejects.toThrow('An error occurred during Google login');
    });

    it('should return null if no user in result', async () => {
      (signInWithPopup as jest.Mock).mockResolvedValue({ user: null });

      const result = await signInWithGoogle();

      expect(result).toBeNull();
    });
  });

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      sessionStorage.setItem('user', 'true');
      (firebaseSignOut as jest.Mock).mockResolvedValue(undefined);

      await signOut();

      expect(firebaseSignOut).toHaveBeenCalled();
      expect(sessionStorage.getItem('user')).toBeNull();
    });

    it('should throw error on sign-out failure', async () => {
      (firebaseSignOut as jest.Mock).mockRejectedValue(new Error('Sign-out failed'));

      await expect(signOut()).rejects.toThrow('An error occurred during sign-out');
    });
  });

  describe('isUserAuthenticated', () => {
    it('should return true when user is authenticated', () => {
      sessionStorage.setItem('user', 'true');

      expect(isUserAuthenticated()).toBe(true);
    });

    it('should return false when user is not authenticated', () => {
      expect(isUserAuthenticated()).toBe(false);
    });
  });
});
