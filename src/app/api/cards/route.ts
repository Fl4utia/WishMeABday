import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { buildCardData, validateCardInput } from "@/lib/server/cardValidation";
import { checkRateLimit } from "@/lib/server/rateLimiter";
import type { ApiError } from "@/lib/types";

export async function POST(request: Request) {
  // Rate limit card creation: max 30 per hour per client
  const rl = checkRateLimit(request, 30, 60 * 60 * 1000);
  if (rl) return rl;

  const firestore = getAdminFirestore();

  if (!firestore) {
    return NextResponse.json<ApiError>(
      { error: "Card service is not configured" },
      { status: 503 }
    );
  }

  try {
    const payload = validateCardInput(await request.json());
    const origin = new URL(request.url).origin;
    const cardData = buildCardData(payload, origin);
    const userId = request.headers.get("x-user-id");
    const persistedCardData = userId ? { ...cardData, ownerUserId: userId } : cardData;

    // Remove any undefined properties before writing to Firestore so the write doesn't fail.
    const cleaned: Record<string, unknown> = Object.fromEntries(
      Object.entries(persistedCardData).filter(([_, v]) => v !== undefined)
    );

    await firestore.collection("cards").doc(cardData.id).set(cleaned);

    if (userId) {
      // For the user's friend subcollection, we also write the cleaned object (merge to avoid replacing)
      await firestore
        .collection("users")
        .doc(userId)
        .collection("friends")
        .doc(cardData.id)
        .set(cleaned, { merge: true });
    }

    return NextResponse.json(cleaned, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save card";
    const status = message.startsWith("Invalid") || message.startsWith("Missing") ? 400 : 500;

    return NextResponse.json<ApiError>(
      { error: "Failed to save card", details: message },
      { status }
    );
  }
}
