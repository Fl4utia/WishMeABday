import { NextResponse } from "next/server";
import { OPENAI_CONFIG, SYSTEM_PROMPTS } from "@/lib/constants/prompts";
import { checkRateLimit } from "@/lib/server/rateLimiter";
import type { OpenAIRequest, OpenAIResponse, ApiError } from "@/lib/types";
import { consumeQuotaRequest, getQuotaStatus } from "@/lib/server/aiQuota";

const groqApiKey = process.env.GROQ_API_KEY;
const groqModel = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

async function generateWithGroq(prompt: string): Promise<string | null> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${groqApiKey}`,
    },
    body: JSON.stringify({
      model: groqModel,
      max_tokens: OPENAI_CONFIG.MAX_TOKENS,
      temperature: OPENAI_CONFIG.TEMPERATURE,
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.BIRTHDAY_MESSAGE },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Groq API error: ${response.status} ${errorBody}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content ?? null;
}

export async function GET() {
  const quota = getQuotaStatus();

  return NextResponse.json({
    aiAvailable: Boolean(groqApiKey) && quota.aiAvailable,
  });
}

/**
 * POST /api/openai
 * Generates a personalized birthday message using OpenAI
 */
export async function POST(req: Request) {
  try {
    // Basic abuse protection: rate limit AI generation per client
    // Allow max 20 AI generation requests per day per client
    const rl = checkRateLimit(req, 20, 24 * 60 * 60 * 1000);
    if (rl) return rl;

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

    if (!groqApiKey) {
      return NextResponse.json<ApiError>(
        { error: "AI service is not configured", details: "Set GROQ_API_KEY in the server environment." },
        { status: 503 }
      );
    }

    const quotaResult = consumeQuotaRequest();
    if (!quotaResult.allowed) {
      return NextResponse.json(
        {
          error: "Daily AI quota reached",
          details: "AI mode is unavailable for now. Please try again later.",
          aiAvailable: false,
        },
        { status: 429 }
      );
    }

    try {
      const message = await generateWithGroq(prompt);
      if (!message || message.trim().length === 0) {
        return NextResponse.json<ApiError>(
          { error: "AI returned an empty response" },
          { status: 502 }
        );
      }

      return NextResponse.json<OpenAIResponse>({ message });
    } catch (error) {
      const details = error instanceof Error ? error.message : "Unknown provider error";
      const status = details.includes(" 429 ") ? 429 : 502;

      return NextResponse.json<ApiError>(
        {
          error: status === 429 ? "AI mode is unavailable for now. Please try later." : "Groq generation failed",
          details,
        },
        { status }
      );
    }
  } catch (error) {
    console.error("Birthday message generation error:", error);

    return NextResponse.json<ApiError>(
      { error: "Failed to generate birthday message" },
      { status: 500 }
    );
  }
}
