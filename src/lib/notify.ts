import "server-only";

/**
 * Invio notifiche (email via Resend, SMS via Twilio).
 * Le chiavi sono opzionali: se mancano, l'invio viene saltato senza errori
 * (utile in sviluppo). In produzione, configurare le env.
 *
 * Resend:  RESEND_API_KEY, RESEND_FROM (es. "aircut <noreply@aircut.app>")
 * Twilio:  TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM (numero mittente)
 */

export type NotifyResult = { ok: boolean; skipped?: boolean; error?: string };

/** Invia una email tramite l'API HTTP di Resend. */
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<NotifyResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!key || !from) return { ok: false, skipped: true, error: "resend-not-configured" };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, error: `resend ${res.status}: ${body.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? "resend-fetch-failed" };
  }
}

/** Invia un SMS tramite l'API HTTP di Twilio. */
export async function sendSms(params: {
  to: string;
  body: string;
}): Promise<NotifyResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;
  if (!sid || !token || !from)
    return { ok: false, skipped: true, error: "twilio-not-configured" };

  try {
    const auth = Buffer.from(`${sid}:${token}`).toString("base64");
    const form = new URLSearchParams({ To: params.to, From: from, Body: params.body });
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: form.toString(),
      }
    );
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, error: `twilio ${res.status}: ${body.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? "twilio-fetch-failed" };
  }
}
