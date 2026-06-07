import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/webhooks/stripe  (spec §6.3, su Firestore)
 * Verifica firma server-side. Aggiorna profiles/{uid}.subscription_status
 * e i campi Stripe. Risolve l'uid da metadata.uid oppure dallo
 * stripe_customer_id salvato sul profilo.
 */
async function findUid(opts: {
  uid?: string | null;
  customerId?: string | null;
}): Promise<string | null> {
  if (opts.uid) return opts.uid;
  if (opts.customerId) {
    const q = await adminDb()
      .collection("profiles")
      .where("stripe_customer_id", "==", opts.customerId)
      .limit(1)
      .get();
    if (!q.empty) return q.docs[0].id;
  }
  return null;
}

async function update(uid: string, data: Record<string, any>) {
  await adminDb().collection("profiles").doc(uid).set(data, { merge: true });
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "Firma mancante." }, { status: 400 });
  }

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    console.error("Webhook signature failed", e);
    return NextResponse.json({ error: "Firma non valida." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const uid = await findUid({
          uid: (s.metadata?.uid as string) || s.client_reference_id,
          customerId: typeof s.customer === "string" ? s.customer : null,
        });
        if (uid) {
          await update(uid, {
            subscription_status: "active",
            stripe_customer_id:
              typeof s.customer === "string" ? s.customer : null,
            stripe_subscription_id:
              typeof s.subscription === "string" ? s.subscription : null,
          });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const statusMap: Record<string, string> = {
          active: "active",
          trialing: "trialing",
          past_due: "past_due",
          unpaid: "past_due",
          canceled: "canceled",
          incomplete_expired: "expired",
        };
        const uid = await findUid({
          uid: (sub.metadata?.uid as string) || null,
          customerId: typeof sub.customer === "string" ? sub.customer : null,
        });
        if (uid) {
          await update(uid, {
            subscription_status: statusMap[sub.status] ?? "expired",
            stripe_subscription_id: sub.id,
            stripe_customer_id:
              typeof sub.customer === "string" ? sub.customer : null,
            current_period_end: new Date(sub.current_period_end * 1000),
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const inv = event.data.object as Stripe.Invoice;
        const uid = await findUid({
          customerId: typeof inv.customer === "string" ? inv.customer : null,
        });
        if (uid) await update(uid, { subscription_status: "past_due" });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const uid = await findUid({
          uid: (sub.metadata?.uid as string) || null,
          customerId: typeof sub.customer === "string" ? sub.customer : null,
        });
        if (uid) await update(uid, { subscription_status: "canceled" });
        break;
      }

      default:
        break;
    }
  } catch (e) {
    console.error("Webhook handler error", e);
    return NextResponse.json({ error: "Errore handler." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
