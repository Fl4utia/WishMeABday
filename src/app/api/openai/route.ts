import { NextResponse } from "next/server";
import OpenAI from "openai";
import { OPENAI_CONFIG, SYSTEM_PROMPTS } from "@/lib/constants/prompts";
import type { OpenAIRequest, OpenAIResponse, ApiError } from "@/lib/types";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
});

/**
 * POST /api/openai
 * Generates a personalized birthday message using OpenAI
 */
export async function POST(req: Request) {
  try {
    // Validate API key
    if (!process.env.NEXT_PUBLIC_OPENAI_KEY) {
      console.error("OpenAI API key is not configured");
      return NextResponse.json<ApiError>(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    // Parse and validate request body
    let body: OpenAIRequest;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json<ApiError>(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { prompt } = body;

    // Validate prompt
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json<ApiError>(
        { error: "Prompt is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (prompt.length > 500) {
      return NextResponse.json<ApiError>(
        { error: "Prompt must be less than 500 characters" },
        { status: 400 }
      );
    }

    // Generate birthday message
    const completion = await openai.chat.completions.create({
      model: OPENAI_CONFIG.MODEL,
      max_tokens: OPENAI_CONFIG.MAX_TOKENS,
      temperature: OPENAI_CONFIG.TEMPERATURE,
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.BIRTHDAY_MESSAGE },
        { role: "user", content: prompt },
      ],
    });

    const messageContent = completion.choices[0]?.message?.content;

    if (!messageContent) {
      console.error("OpenAI returned empty response");
      return NextResponse.json<ApiError>(
        { error: "Failed to generate message" },
        { status: 500 }
      );
    }

    return NextResponse.json<OpenAIResponse>({ message: messageContent });
  } catch (error) {
    console.error("OpenAI API error:", error);

    // Handle specific OpenAI errors
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json<ApiError>(
        {
          error: "OpenAI API error",
          details: error.message,
        },
        { status: error.status || 500 }
      );
    }

    // Generic error fallback
    return NextResponse.json<ApiError>(
      { error: "Failed to generate birthday message" },
      { status: 500 }
    );
  }
}
