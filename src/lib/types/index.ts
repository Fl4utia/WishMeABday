/**
 * Type definitions for the application
 */

export interface BirthdayCardData {
  firstName: string;
  lastName?: string;
  message: string;
  cardType: number;
  recipientEmail?: string;
}

export interface OpenAIRequest {
  prompt: string;
  provider?: "local" | "openai" | "claude";
  apiKey?: string;
}

export interface OpenAIResponse {
  message: string;
  remainingRequests?: number;
  resetAt?: string;
  aiAvailable?: boolean;
}

export interface SendEmailRequest {
  firstName: string;
  link: string;
  recipientEmail?: string;
}

export interface SendEmailResponse {
  message: string;
  id?: string;
}

export interface ApiError {
  error: string;
  details?: string;
}
