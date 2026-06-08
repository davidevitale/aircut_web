import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { sendEmail, sendSms } from "@/lib/notify";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * GET /api/cron/trial-reminders
 * Da eseguire una volta al giorno (Vercel Cron o cron esterno).
 * Trova i profili in trial e invia promemoria di scadenza con il link al
 * pagamento, evitando duplicati grazie al campo `reminders_sent`.
 *
 * Protezione: header "Authorization: Bearer <CRON_SECRET>".
 *
 * Milestone:
 *  - "t-3": mancano 3 giorni alla scadenza
 *  - "t-1": manca 1 giorno
 *  - "expired": trial scaduto
 */

type Milestone = "t-3" | "t-1" | "expired";

function dueMilestone(trialEndsMs: number, nowMs: number): Milestone | null {
  const dayMs = 24 * 60 * 60 * 1000;
  const diff = trialEndsMs - nowMs;
  if (diff <= 0) return "expired";
  if (diff <= dayMs) return "t-1";
  if (diff <= 3 * dayMs) return "t-3";
  return null;
}

function toMs(v: any): number | null {
  if (!v) return null;
  if (typeof v?.toDate === "function") return v.toDate().getTime();
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.getTime();
}

function messageFor(milestone: Milestone, payUrl: string) {
  if (milestone === "expired") {
    return {
      subject: "Il tuo mese gratis su aircut è scaduto",
      line: "Il tuo mese gratis è finito. Riattiva aircut per non perdere i tuoi clienti.",
    };
  }
  if (milestone === "t-1") {
    return {
      subject: "Domani scade il tuo mese gratis su aircut",
      line: "Manca 1 giorno alla fine del tuo mese gratis. Continua senza interruzioni.",
    };
  }
  return {
    subject: "Tra 3 giorni scade il tuo mese gratis su aircut",
    line: "Mancano 3 giorni alla fine del tuo mese gratis. Attiva l'abbonamento quando vuoi.",
  };
}

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const authz = req.headers.get("authorization") || "";
  const token = authz.startsWith("Bearer ") ? authz.slice(7) : null;
  if (!secret || token !== secret) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  const db = adminDb();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const payUrl = `${siteUrl}/pagamento`;
  const now = Date.now();

  let processed = 0;
  let sent = 0;
  const failures: string[] = [];

  try {
    const snap = await db
      .collection("profiles")
      .where("subscription_status", "==", "trialing")
      .get();

    for (const doc of snap.docs) {
      processed++;
      const p = doc.data();
      const endMs = toMs(p.trial_ends_at);
      if (endMs == null) continue;

      const milestone = dueMilestone(endMs, now);
      if (!milestone) continue;

      const already: string[] = Array.isArray(p.reminders_sent)
        ? p.reminders_sent
        : [];
      if (already.includes(milestone)) continue;

      const { subject, line } = messageFor(milestone, payUrl);

      let result;
      if (p.contact_method === "phone" && p.phone) {
        result = await sendSms({
          to: p.phone,
          body: `${line} Paga qui: ${payUrl}`,
        });
      } else if (p.email) {
        result = await sendEmail({
          to: p.email,
          subject,
          text: `${line}\n\nAttiva l'abbonamento: ${payUrl}`,
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
              <h2 style="margin:0 0 12px">${subject}</h2>
              <p style="color:#444;line-height:1.5">${line}</p>
              <p style="margin:24px 0">
                <a href="${payUrl}"
                   style="background:#111;color:#fff;text-decoration:none;
                          padding:12px 22px;border-radius:999px;display:inline-block">
                  Attiva l'abbonamento
                </a>
              </p>
              <p style="color:#888;font-size:13px">${payUrl}</p>
            </div>`,
        });
      } else {
        continue; // nessun canale disponibile
      }

      if (result.ok) {
        sent++;
        await doc.ref.update({
          reminders_sent: FieldValue.arrayUnion(milestone),
          last_reminder_at: FieldValue.serverTimestamp(),
        });
      } else if (!result.skipped) {
        failures.push(`${doc.id}:${result.error ?? "unknown"}`);
      }
    }

    return NextResponse.json({
      ok: true,
      processed,
      sent,
      failures: failures.slice(0, 20),
    });
  } catch (e: any) {
    console.error("trial-reminders error", e);
    return NextResponse.json({ error: "Errore cron." }, { status: 500 });
  }
}
