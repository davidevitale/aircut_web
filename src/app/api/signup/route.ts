import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { normalizeNickname, validateNickname } from "@/lib/nickname";

export const dynamic = "force-dynamic";

/**
 * POST /api/signup  (email OPPURE telefono, + password + nickname)
 * Crea l'utente in Firebase Auth con password, riserva il nickname in modo
 * atomico e crea il documento profiles/{uid} con trial 30 giorni.
 * NESSUNA carta, nessun addebito al signup.
 *
 * Body: { method:'email'|'phone', contact, password, nickname }
 * Risponde con { ok, uid }.
 *
 * Nome, cognome, nome salone e gli altri dati di profilo (via, tipo clientela,
 * foto, ...) vengono compilati dal professionista direttamente nell'app.
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
  const password = String(body?.password ?? "");
  const nicknameRaw = (body?.nickname ?? "").trim();

  // --- Validazioni ---
  const errors: Record<string, string> = {};
  if (method !== "email" && method !== "phone")
    errors.method = "Metodo di contatto non valido.";
  if (method === "email") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact))
      errors.contact = "Inserisci un'email valida.";
  } else if (method === "phone") {
    if (!/^\+?[0-9\s().-]{7,}$/.test(contact))
      errors.contact = "Inserisci un numero di telefono valido.";
  }
  if (password.length < 8) errors.password = "Almeno 8 caratteri.";
  const nickErr = validateNickname(nicknameRaw);
  if (nickErr) errors.nickname = nickErr;

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const auth = adminAuth();
  const db = adminDb();
  const nickKey = normalizeNickname(nicknameRaw);
  const normalizedPhone =
    method === "phone" ? contact.replace(/[\s().-]/g, "") : undefined;

  // --- 1. Il contatto non deve gia esistere (creiamo SEMPRE un account nuovo). ---
  try {
    if (method === "email") await auth.getUserByEmail(contact);
    else await auth.getUserByPhoneNumber(normalizedPhone!);
    return NextResponse.json(
      {
        errors: {
          contact: "Esiste gia un account con questo contatto. Accedi dall'app.",
        },
      },
      { status: 409 }
    );
  } catch {
    // ok: il contatto e libero, proseguiamo.
  }

  // --- 2. Crea utente + prenotazione atomica del nickname + profilo. ---
  let uid: string | null = null;
  try {
    const created = await auth.createUser({
      ...(method === "email"
        ? { email: contact }
        : { phoneNumber: normalizedPhone }),
      password,
    });
    uid = created.uid;

    const now = new Date();
    const trialEnds = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const nickRef = db.collection("nicknames").doc(nickKey);
    const profileRef = db.collection("profiles").doc(uid);

    await db.runTransaction(async (tx) => {
      const nickSnap = await tx.get(nickRef);
      if (nickSnap.exists) {
        const e: any = new Error("nickname-taken");
        e.code = "nickname-taken";
        throw e;
      }
      tx.set(nickRef, {
        uid,
        nickname: nicknameRaw,
        created_at: FieldValue.serverTimestamp(),
      });
      tx.set(profileRef, {
        nickname: nicknameRaw,
        nickname_key: nickKey,
        contact_method: method,
        email: method === "email" ? contact : null,
        phone: method === "phone" ? normalizedPhone : null,
        // Dati anagrafici/profilo compilati nell'app.
        first_name: null,
        last_name: null,
        salon_name: null,
        trial_started_at: now,
        trial_ends_at: trialEnds,
        subscription_status: "trialing",
        // Stato dei promemoria di scadenza trial (vedi /api/cron/trial-reminders).
        reminders_sent: [],
        stripe_customer_id: null,
        stripe_subscription_id: null,
        current_period_end: null,
        created_at: FieldValue.serverTimestamp(),
      });
    });

    return NextResponse.json({ ok: true, uid });
  } catch (e: any) {
    // Rollback: se il nickname era gia preso, elimina l'utente appena creato.
    if (uid) {
      try {
        await auth.deleteUser(uid);
      } catch (delErr) {
        console.error("signup rollback deleteUser failed", delErr);
      }
    }
    if (e?.code === "nickname-taken") {
      return NextResponse.json(
        { errors: { nickname: "Nickname gia preso. Scegline un altro." } },
        { status: 409 }
      );
    }
    console.error("signup fatal", e);
    return NextResponse.json({ error: "Errore inatteso. Riprova." }, { status: 500 });
  }
}
