import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/admin";

export async function GET(request: Request) {
  const firestore = getAdminFirestore();

  if (!firestore) {
    return NextResponse.json({ error: "Card service is not configured" }, { status: 503 });
  }

  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Missing user id" }, { status: 401 });
  }

  try {
    const friendsSnapshot = await firestore
      .collection("users")
      .doc(userId)
      .collection("friends")
      .get();

    const friends = friendsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(friends, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch current user's friends:", error);
    return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 });
  }
}
