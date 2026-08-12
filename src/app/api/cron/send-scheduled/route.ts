import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { buildEmailTemplate } from "@/lib/server/emailTemplate";
import { APP_CONFIG } from "@/lib/constants/app";
import { isAuthorizedCronRequest } from "@/lib/server/cronAuth";

const resendApiKey = process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || APP_CONFIG.DEFAULT_EMAIL_FROM;
const resend = new Resend(resendApiKey);

export async function GET(request: Request) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!resendApiKey) {
    return NextResponse.json({ error: "Email service is not configured" }, { status: 503 });
  }

  const firestore = getAdminFirestore();
  if (!firestore) {
    return NextResponse.json({ error: "Card service is not configured" }, { status: 503 });
  }

  const nowIso = new Date().toISOString();
  // Query only cards that are due (sendAt <= now) and haven't been sent yet.
  // Limit the batch size to keep the function runtime short.
  const dueQuery = firestore
    .collection("cards")
    .where("sendAt", "<=", nowIso)
    .where("emailSentAt", "==", null)
    .limit(10);

  const cardsSnapshot = await dueQuery.get();
  const dueCards = cardsSnapshot.docs;

  const processed: Array<{ id: string; status: string }> = [];

  // Process sequentially (small batch) to avoid exhausting function time or hitting
  // external API concurrency limits. For a small project a limit of 10 is fine.
  for (const cardDoc of dueCards) {
    const card = cardDoc.data() as {
      name?: string;
      email?: string;
      link?: string;
      sendAt?: string;
      emailSentAt?: string;
      ownerUserId?: string;
    };

    if (card.emailSentAt || !card.email || !card.link || !card.name) {
      continue;
    }

    try {
      const result = await resend.emails.send({
        from: fromEmail,
        to: [card.email],
        subject: `We heard it's your birthday, ${card.name}!`,
        html: buildEmailTemplate(card.name, card.link),
      });

      if (result.error) {
        await cardDoc.ref.update({
          emailSendError: result.error.message,
          emailSendAttemptedAt: nowIso,
        });
        processed.push({ id: cardDoc.id, status: "failed" });
        continue;
      }

      await cardDoc.ref.update({
        emailSentAt: nowIso,
        emailSendId: result.data?.id ?? null,
        emailSendError: null,
        emailSendAttemptedAt: nowIso,
      });

      if (card.ownerUserId) {
        try {
          await firestore
            .collection("users")
            .doc(card.ownerUserId)
            .collection("friends")
            .doc(cardDoc.id)
            .set(
              {
                emailSentAt: nowIso,
                emailSendId: result.data?.id ?? null,
                emailSendError: null,
                emailSendAttemptedAt: nowIso,
              },
              { merge: true }
            );
        } catch (userUpdateError) {
          console.warn("Unable to update user card status:", userUpdateError);
        }
      }

      processed.push({ id: cardDoc.id, status: "sent" });
    } catch (error) {
      await cardDoc.ref.update({
        emailSendError: error instanceof Error ? error.message : "Unknown error",
        emailSendAttemptedAt: nowIso,
      });
      processed.push({ id: cardDoc.id, status: "failed" });
    }
  }

  return NextResponse.json({
    processed: processed.length,
    details: processed,
  });
}
