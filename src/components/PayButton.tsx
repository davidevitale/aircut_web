"use client";

import { useState } from "react";
import { getFirebaseAuth } from "@/lib/firebase/client";

export function PayButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setLoading(true);
    setError(null);
    try {
      const user = getFirebaseAuth().currentUser;
      if (!user) {
        setError("Accedi prima di attivare l'abbonamento.");
        setLoading(false);
        return;
      }
      const token = await user.getIdToken();

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) {
        setError(
          res.status === 401
            ? "Accedi prima di attivare l'abbonamento."
            : data?.error ?? "Impossibile avviare il pagamento."
        );
        setLoading(false);
        return;
      }
      window.location.href = data.url; // redirect a Stripe Checkout
    } catch {
      setError("Connessione non riuscita. Riprova.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={start}
        className="btn-primary"
        disabled={loading}
        style={{ width: "100%", fontSize: 16 }}
      >
        {loading ? "Reindirizzamento..." : "Attiva abbonamento"}
      </button>
      {error && (
        <p className="field-error" role="alert" style={{ textAlign: "center", marginTop: 12 }}>
          {error}
        </p>
      )}
    </div>
  );
}
