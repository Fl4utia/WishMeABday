/**
 * Centralized exports for library utilities, hooks, and constants
 * Import from '@/lib' instead of individual files
 */

// Constants
export * from './constants/app';
export * from './constants/prompts';
export * from './constants/routes';
export * from './constants/slides';

// Hooks
export { useAuth } from './hooks/useAuth';
export { useProtectedRoute } from './hooks/useProtectedRoute';

// Utils
export * from './utils/auth';
export * from './utils/confetti';

// Types
export * from './types';
