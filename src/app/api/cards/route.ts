import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { buildCardData, validateCardInput } from "@/lib/server/cardValidation";
import type { ApiError } from "@/lib/types";

export async function POST(request: Request) {
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

    await firestore.collection("cards").doc(cardData.id).set(cardData);

    const userId = request.headers.get("x-user-id");
    if (userId) {
      await firestore.collection("users").doc(userId).collection("friends").doc(cardData.id).set(cardData);
    }

    return NextResponse.json(cardData, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save card";
    const status = message.startsWith("Invalid") || message.startsWith("Missing") ? 400 : 500;

    return NextResponse.json<ApiError>(
      { error: "Failed to save card", details: message },
      { status }
    );
  }
}
