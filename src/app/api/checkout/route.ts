import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

/**
 * POST /api/checkout  (spec §6.3, su Firebase)
 * Richiede l'ID token Firebase in header: Authorization: Bearer <token>.
 * Crea una Stripe Checkout Session in modalita subscription (€29/mese).
 * Riusa stripe_customer_id da profiles/{uid} se presente.
 */
export async function POST(req: Request) {
  const authz = req.headers.get("authorization") || "";
  const token = authz.startsWith("Bearer ") ? authz.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: "Non autenticato." }, { status: 401 });
  }

  let uid: string;
  let email: string | undefined;
  try {
    const decoded = await adminAuth().verifyIdToken(token);
    uid = decoded.uid;
    email = decoded.email;
  } catch {
    return NextResponse.json({ error: "Sessione non valida." }, { status: 401 });
  }

  const db = adminDb();
  const snap = await db.collection("profiles").doc(uid).get();
  const profile = snap.data() || {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      customer: profile.stripe_customer_id || undefined,
      customer_email: profile.stripe_customer_id
        ? undefined
        : profile.email || email || undefined,
      client_reference_id: uid,
      subscription_data: { metadata: { uid } },
      metadata: { uid },
      success_url: `${siteUrl}/benvenuto?pagamento=ok`,
      cancel_url: `${siteUrl}/pagamento?annullato=1`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("checkout error", e);
    return NextResponse.json(
      { error: "Impossibile avviare il pagamento." },
      { status: 500 }
    );
  }
}
