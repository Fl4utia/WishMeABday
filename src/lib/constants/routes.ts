/**
 * Application route constants
 */

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  CARDS: "/cards",
  DASHBOARD: "/dashboard",
  BIRTHDAY_1: "/birthday1",
  BIRTHDAY_2: "/birthday2",
  BIRTHDAY_3: "/birthday3",
  AUTH: "/db/auth",
} as const;

export const API_ROUTES = {
  OPENAI: "/api/openai",
  SEND_EMAIL: "/api/send",
} as const;
