/**
 * Logica di accesso condivisa (spec §6.2).
 * Identica a quella che l'app mobile applica leggendo il documento
 * profiles/{uid} in Firestore.
 *
 *   accesso_consentito =
 *      (status = 'active')
 *   OR (status = 'trialing' AND trial_ends_at > now())
 */
export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "expired";

type TimestampLike = { toDate: () => Date };

function toDate(v: string | number | Date | TimestampLike | null): Date | null {
  if (!v) return null;
  if (v instanceof Date) return v;
  if (typeof v === "object" && "toDate" in v) return v.toDate();
  return new Date(v as string | number);
}

export function isAccessAllowed(params: {
  status: SubscriptionStatus;
  trialEndsAt: string | number | Date | TimestampLike | null;
}): boolean {
  const { status, trialEndsAt } = params;
  if (status === "active") return true;
  if (status === "trialing") {
    const end = toDate(trialEndsAt);
    return !!end && end.getTime() > Date.now();
  }
  return false;
}
