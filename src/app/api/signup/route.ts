import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

/**
 * POST /api/signup  (spec adattata a Firebase)
 * Crea/recupera l'utente in Firebase Auth, crea il documento profiles/{uid}
 * con trial 30 giorni, poi il client invia il link/OTP via Firebase Auth.
 * NESSUNA carta, nessun addebito.
 *
 * Body: { method: 'email'|'phone', contact, firstName, lastName, salonName }
 * Risponde con { ok, uid, method, contact }.
 */
export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body non valido." }, { status: 400 });
  }

  const method = body?.method;
  const contact = (body?.contact ?? "").trim();
  const firstName = (body?.firstName ?? "").trim();
  const lastName = (body?.lastName ?? "").trim();
  const salonName = (body?.salonName ?? "").trim();

  const errors: Record<string, string> = {};
  if (method !== "email" && method !== "phone")
    errors.method = "Metodo di contatto non valido.";
  if (!firstName) errors.firstName = "Inserisci il nome.";
  if (!lastName) errors.lastName = "Inserisci il cognome.";
  if (!salonName) errors.salonName = "Inserisci il nome del salone.";
  if (method === "email") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact))
      errors.contact = "Inserisci un'email valida.";
  } else if (method === "phone") {
    if (!/^\+?[0-9\s().-]{7,}$/.test(contact))
      errors.contact = "Inserisci un numero di telefono valido.";
  }
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const auth = adminAuth();
  const db = adminDb();
  const normalizedPhone =
    method === "phone" ? contact.replace(/[\s().-]/g, "") : undefined;

  try {
    // 1. Crea/recupera l'utente in Firebase Auth.
    let uid: string;
    try {
      const existing =
        method === "email"
          ? await auth.getUserByEmail(contact)
          : await auth.getUserByPhoneNumber(normalizedPhone!);
      uid = existing.uid;
    } catch {
      const created = await auth.createUser(
        method === "email"
          ? { email: contact, displayName: `${firstName} ${lastName}` }
          : { phoneNumber: normalizedPhone, displayName: `${firstName} ${lastName}` }
      );
      uid = created.uid;
    }

    // 2. Crea/aggiorna il documento profilo + trial 30 giorni.
    const now = new Date();
    const trialEnds = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const ref = db.collection("profiles").doc(uid);
    const snap = await ref.get();

    const base: Record<string, any> = {
      first_name: firstName,
      last_name: lastName,
      salon_name: salonName,
      contact_method: method,
      email: method === "email" ? contact : null,
      phone: method === "phone" ? normalizedPhone : null,
    };

    if (!snap.exists) {
      await ref.set({
        ...base,
        trial_started_at: now,
        trial_ends_at: trialEnds,
        subscription_status: "trialing",
        stripe_customer_id: null,
        stripe_subscription_id: null,
        current_period_end: null,
        created_at: FieldValue.serverTimestamp(),
      });
    } else {
      // Aggiorna solo i dati anagrafici, lascia intatti trial e billing.
      await ref.set(base, { merge: true });
    }

    return NextResponse.json({ ok: true, uid, method, contact });
  } catch (e) {
    console.error("signup fatal", e);
    return NextResponse.json({ error: "Errore inatteso." }, { status: 500 });
  }
}
