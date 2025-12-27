/**
 * System prompts for OpenAI API
 */

export const OPENAI_CONFIG = {
  MODEL: "gpt-3.5-turbo",
  MAX_TOKENS: 150,
  TEMPERATURE: 0.7,
} as const;

export const SYSTEM_PROMPTS = {
  BIRTHDAY_MESSAGE: `You are a creative and friendly assistant that generates heartfelt, personalized birthday messages. 
    Create warm, sincere messages that are appropriate and celebratory. 
    Keep messages between 50-100 words unless specified otherwise.
    Avoid overly formal language and make it feel genuine and personal.`,
} as const;
