import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { normalizeNickname, validateNickname } from "@/lib/nickname";

export const dynamic = "force-dynamic";

/**
 * GET /api/check-nickname?value=<nick>
 * Verifica formato + disponibilità del nickname.
 * Risponde { available: boolean, reason?: string }.
 *
 * Nota: è un controllo "ottimistico" per la UX live. L'univocità reale è
 * garantita in modo atomico dalla transaction in /api/signup.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("value") ?? "";

  const formatError = validateNickname(raw);
  if (formatError) {
    return NextResponse.json({ available: false, reason: formatError });
  }

  const key = normalizeNickname(raw);

  try {
    const snap = await adminDb().collection("nicknames").doc(key).get();
    return NextResponse.json({ available: !snap.exists });
  } catch (e) {
    console.error("check-nickname error", e);
    // In caso di errore non blocchiamo l'utente: la verifica finale è al signup.
    return NextResponse.json(
      { available: true, reason: "check-skipped" },
      { status: 200 }
    );
  }
}
