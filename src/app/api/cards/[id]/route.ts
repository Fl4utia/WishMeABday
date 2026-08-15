import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/admin";

function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function GET(
  request: Request,
  context: any
) {
  const firestore = getAdminFirestore();
  const { id } = context.params as { id: string };

  if (!firestore) {
    return NextResponse.json(
      { error: "Card service is not configured" },
      { status: 503 }
    );
  }

  if (!id || typeof id !== "string" || !isValidUuid(id)) {
    return NextResponse.json({ error: "Invalid card id" }, { status: 400 });
  }

  try {
    const cardDoc = await firestore.collection("cards").doc(id).get();

    if (!cardDoc.exists) {
      return NextResponse.json(
        { error: "Card not found" },
        { status: 404 }
      );
    }

    const cardData = cardDoc.data() as { ownerUserId?: string } & Record<string, unknown>;

    // Enforce ownership: if card has an ownerUserId, only that user may read it.
    const ownerId = cardData.ownerUserId;
    if (ownerId && ownerId.trim().length > 0) {
      const userId = request.headers.get("x-user-id");
      if (!userId) {
        return NextResponse.json({ error: "Missing user id" }, { status: 401 });
      }
      if (userId !== ownerId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // Return sanitized public fields only
    const { ownerUserId: _o, emailSendError, emailSendAttemptedAt, ...publicData } = cardData;

    return NextResponse.json({
      id: cardDoc.id,
      ...publicData,
    });
  } catch (error) {
    console.error("Failed to fetch card from admin Firestore:", error);
    return NextResponse.json(
      { error: "Failed to fetch card" },
      { status: 500 }
    );
  }
}
