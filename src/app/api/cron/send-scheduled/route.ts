import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { buildEmailTemplate } from "@/lib/server/emailTemplate";
import { APP_CONFIG } from "@/lib/constants/app";
import { isScheduledDeliveryDue } from "@/lib/utils/scheduling";

const resendApiKey = process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || APP_CONFIG.DEFAULT_EMAIL_FROM;
const cronSecret = process.env.CRON_SECRET;
const resend = new Resend(resendApiKey);

export async function GET(request: Request) {
  if (cronSecret) {
    const providedSecret = request.headers.get("x-cron-secret") || new URL(request.url).searchParams.get("secret");
    if (providedSecret !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!resendApiKey) {
    return NextResponse.json({ error: "Email service is not configured" }, { status: 503 });
  }

  const firestore = getAdminFirestore();
  if (!firestore) {
    return NextResponse.json({ error: "Card service is not configured" }, { status: 503 });
  }

  const nowIso = new Date().toISOString();
  const cardsSnapshot = await firestore.collection("cards").get();
  const dueCards = cardsSnapshot.docs.filter((cardDoc) => {
    const card = cardDoc.data() as { sendAt?: string; emailSentAt?: string };
    return (
      typeof card.sendAt === "string" &&
      card.sendAt.length > 0 &&
      !card.emailSentAt &&
      isScheduledDeliveryDue(card.sendAt, new Date(nowIso))
    );
  });

  const processed: Array<{ id: string; status: string }> = [];

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
