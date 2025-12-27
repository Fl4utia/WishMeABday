/**
 * General application configuration constants
 */

export const APP_CONFIG = {
  NAME: "Birthday Cards App",
  DESCRIPTION: "Create and send personalized birthday cards",
  DEFAULT_EMAIL_FROM: "Happy birthday <onboarding@resend.dev>",
} as const;

export const CONFETTI_CONFIG = {
  DURATION: 1000, // ms
  PARTICLE_COUNT: 5,
  ANGLE_1: 60,
  ANGLE_2: 120,
  SPREAD: 55,
} as const;

export const CARD_TYPES = {
  CARD_1: 1,
  CARD_2: 2,
  CARD_3: 3,
} as const;
