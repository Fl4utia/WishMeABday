import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/admin";

export async function DELETE(_request: Request, context: any) {
  const firestore = getAdminFirestore();
  const { friendId } = context.params as { friendId: string };

  if (!firestore) {
    return NextResponse.json(
      { error: "Card service is not configured" },
      { status: 503 }
    );
  }

  const userId = _request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Missing user id" }, { status: 401 });
  }

  try {
    const cardDocRef = firestore.collection("cards").doc(friendId);
    const userFriendDocRef = firestore
      .collection("users")
      .doc(userId)
      .collection("friends")
      .doc(friendId);

    const [cardSnapshot, userFriendSnapshot] = await Promise.all([
      cardDocRef.get(),
      userFriendDocRef.get(),
    ]);

    if (cardSnapshot.exists) {
      const cardData = cardSnapshot.data() as { ownerUserId?: string } | undefined;
      if (cardData?.ownerUserId && cardData.ownerUserId !== userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    if (!cardSnapshot.exists && !userFriendSnapshot.exists) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    await Promise.all([cardDocRef.delete(), userFriendDocRef.delete()]);

    return NextResponse.json({ success: true, id: friendId }, { status: 200 });
  } catch (error) {
    console.error("Failed to cancel card delivery:", error);
    return NextResponse.json({ error: "Failed to cancel card" }, { status: 500 });
  }
}
