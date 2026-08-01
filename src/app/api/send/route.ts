import { Resend } from "resend";
import { NextResponse } from "next/server";
import { APP_CONFIG } from "@/lib/constants/app";
import type { SendEmailRequest, SendEmailResponse, ApiError } from "@/lib/types";

const resendApiKey = process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY;
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
    const toEmail = recipientEmail || "ximenasaibot@gmail.com";

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

/**
 * Builds the HTML template for the birthday email
 */
function buildEmailTemplate(firstName: string, link: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Happy Birthday!</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
          color: #ff6b6b;
          text-align: center;
          font-size: 32px;
        }
        p {
          color: #333333;
          font-size: 16px;
          line-height: 1.6;
          text-align: center;
        }
        .button {
          display: inline-block;
          margin: 20px auto;
          padding: 15px 30px;
          background-color: #ff6b6b;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          text-align: center;
        }
        .button-container {
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎉 Happy Birthday, ${firstName}! 🎉</h1>
        <p>We hope you have a fantastic day filled with joy, laughter, and wonderful memories!</p>
        <p>Here's a special birthday card just for you:</p>
        <div class="button-container">
          <a href="${link}" class="button">View Your Birthday Card</a>
        </div>
        <p>Wishing you all the best on your special day!</p>
      </div>
    </body>
    </html>
  `;
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
