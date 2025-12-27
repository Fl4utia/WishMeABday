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
}

export interface OpenAIResponse {
  message: string;
}

export interface SendEmailRequest {
  firstName: string;
  link: string;
  recipientEmail?: string;
}

export interface SendEmailResponse {
  message: string;
}

export interface ApiError {
  error: string;
  details?: string;
}
