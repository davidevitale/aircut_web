/**
 * Utilità condivise per il nickname univoco del professionista.
 * Il nickname è l'identità pubblica (es. @marco.tagli) ed è univoco nel DB.
 */

/** Lunghezza consentita. */
export const NICK_MIN = 3;
export const NICK_MAX = 24;

/**
 * Normalizza un nickname per il confronto di univocità:
 * minuscolo, senza spazi ai bordi. La chiave salvata in `nicknames/{key}`
 * usa questa forma normalizzata, così "Marco" e "marco" non coesistono.
 */
export function normalizeNickname(raw: string): string {
  return (raw ?? "").trim().toLowerCase();
}

/**
 * Valida il formato del nickname. Ammessi: lettere, numeri, punto e underscore.
 * Non può iniziare/finire con punto, né avere punti doppi.
 * Ritorna un messaggio d'errore (in italiano) oppure null se valido.
 */
export function validateNickname(raw: string): string | null {
  const v = (raw ?? "").trim();
  if (!v) return "Inserisci un nickname.";
  if (v.length < NICK_MIN) return `Almeno ${NICK_MIN} caratteri.`;
  if (v.length > NICK_MAX) return `Massimo ${NICK_MAX} caratteri.`;
  if (!/^[a-zA-Z0-9._]+$/.test(v))
    return "Solo lettere, numeri, punto e underscore.";
  if (/^[._]|[._]$/.test(v)) return "Non può iniziare o finire con . o _";
  if (/\.\./.test(v)) return "Niente punti consecutivi.";
  return null;
}
