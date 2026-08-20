import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/admin";

export async function GET(
  _request: Request,
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

  try {
    const cardDoc = await firestore.collection("cards").doc(id).get();

    if (!cardDoc.exists) {
      return NextResponse.json(
        { error: "Card not found" },
        { status: 404 }
      );
    }

    const cardData = cardDoc.data() as Record<string, unknown>;

    return NextResponse.json({
      id: cardDoc.id,
      ...cardData,
    });
  } catch (error) {
    console.error("Failed to fetch card from admin Firestore:", error);
    return NextResponse.json(
      { error: "Failed to fetch card" },
      { status: 500 }
    );
  }
}
