import { Resend } from "resend";
import { NextResponse } from "next/server";
import { APP_CONFIG } from "@/lib/constants/app";
import { buildEmailTemplate } from "@/lib/server/emailTemplate";
import type { SendEmailRequest, SendEmailResponse, ApiError } from "@/lib/types";

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || APP_CONFIG.DEFAULT_EMAIL_FROM;

// Initialize Resend client
const resend = new Resend(resendApiKey);

/**
 * POST /api/send
 * Sends a birthday card email to the recipient
 */
export async function POST(req: Request) {
  try {
    // Validate API key
    if (!resendApiKey) {
      console.error("Resend API key is not configured");
      return NextResponse.json<ApiError>(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    }

    // Parse and validate request body
    let body: SendEmailRequest;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json<ApiError>(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { firstName, link, recipientEmail } = body;
    const sanitizedFirstName = sanitizeText(firstName);

    // Validate required fields
    if (!firstName || typeof firstName !== "string" || sanitizedFirstName.length === 0) {
      return NextResponse.json<ApiError>(
        { error: "First name is required" },
        { status: 400 }
      );
    }

    if (sanitizedFirstName.length > 80) {
      return NextResponse.json<ApiError>(
        { error: "First name is too long" },
        { status: 400 }
      );
    }

    if (!link || typeof link !== "string" || !isValidUrl(link)) {
      return NextResponse.json<ApiError>(
        { error: "Valid card link is required" },
        { status: 400 }
      );
    }

    if (link.length > 2048) {
      return NextResponse.json<ApiError>(
        { error: "Valid card link is required" },
        { status: 400 }
      );
    }

    // Use provided email or fallback to default
    const toEmail = recipientEmail || "";

    if (!isValidEmail(toEmail)) {
      return NextResponse.json<ApiError>(
        { error: "Invalid recipient email address" },
        { status: 400 }
      );
    }

    // Build email HTML content
    const htmlContent = buildEmailTemplate(sanitizedFirstName, link);

    // Send email
    const result = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `We heard it's your birthday, ${sanitizedFirstName}!`,
      html: htmlContent,
    });

    if (result.error) {
      return NextResponse.json<ApiError>(
        {
          error: "Failed to send email",
          details: result.error.message,
        },
        { status: 502 }
      );
    }

    console.log("Email sent successfully:", result.data);

    return NextResponse.json<SendEmailResponse>(
      { message: "Email sent successfully", id: result.data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email sending error:", error);

    // Handle Resend-specific errors
    if (error instanceof Error) {
      return NextResponse.json<ApiError>(
        {
          error: "Failed to send email",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiError>(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}

function sanitizeText(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f<>]/g, "").trim();
}

/**
 * Validates email address format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates URL format
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
