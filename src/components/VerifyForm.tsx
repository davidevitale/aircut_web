"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  type ConfirmationResult,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";

/**
 * Verifica passwordless con Firebase Auth.
 * - email: completa il sign-in dal magic link (signInWithEmailLink).
 * - phone: conferma il codice OTP (confirmationResult.confirm).
 * Al successo -> /benvenuto.
 */
export function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const method = (params.get("method") as "email" | "phone") || "email";
  const contact = params.get("contact") || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [needEmail, setNeedEmail] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  // Email: se l'URL e un sign-in link, completa subito l'accesso.
  useEffect(() => {
    const auth = getFirebaseAuth();
    if (auth.currentUser) {
      router.replace("/benvenuto");
      return;
    }
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const stored = window.localStorage.getItem("aircut_email_for_signin");
      if (!stored) {
        setNeedEmail(true);
        setChecking(false);
        return;
      }
      completeEmailLink(stored);
    } else {
      setChecking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function completeEmailLink(email: string) {
    try {
      const auth = getFirebaseAuth();
      await signInWithEmailLink(auth, email, window.location.href);
      window.localStorage.removeItem("aircut_email_for_signin");
      router.replace("/benvenuto");
    } catch {
      setError("Link non valido o scaduto. Richiedi un nuovo accesso.");
      setChecking(false);
    }
  }

  async function onConfirmEmail(ev: React.FormEvent) {
    ev.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.trim())) {
      setError("Inserisci l'email con cui ti sei iscritto.");
      return;
    }
    setLoading(true);
    await completeEmailLink(emailInput.trim());
    setLoading(false);
  }

  async function onConfirmPhone(ev: React.FormEvent) {
    ev.preventDefault();
    if (code.trim().length < 4) {
      setError("Inserisci il codice ricevuto.");
      return;
    }
    const confirmation: ConfirmationResult | undefined = (window as any)
      .__aircutConfirmation;
    if (!confirmation) {
      setError("Sessione scaduta. Torna all'iscrizione e riprova.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await confirmation.confirm(code.trim());
      router.replace("/benvenuto");
    } catch {
      setError("Codice non valido o scaduto. Riprova.");
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
        Verifica in corso...
      </div>
    );
  }

  // Email: completamento da link su un altro dispositivo (manca l'email salvata)
  if (method === "email" && needEmail) {
    return (
      <div style={{ textAlign: "center" }}>
        <h1 style={titleStyle}>Conferma la tua email</h1>
        <p style={subStyle}>Inserisci l'email con cui ti sei iscritto.</p>
        <form onSubmit={onConfirmEmail} style={{ marginTop: 24, textAlign: "left" }} noValidate>
          <label className="field-label">Email</label>
          <input
            className="input"
            type="email"
            value={emailInput}
            aria-invalid={!!error}
            onChange={(e) => setEmailInput(e.target.value)}
          />
          {error && <p className="field-error" role="alert">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", marginTop: 18 }}>
            {loading ? "Verifica..." : "Accedi"}
          </button>
        </form>
      </div>
    );
  }

  // Email: in attesa che l'utente apra il link
  if (method === "email") {
    return (
      <div style={{ textAlign: "center" }}>
        <h1 style={titleStyle}>Controlla la tua email</h1>
        <p style={subStyle}>
          Ti abbiamo inviato un link di accesso a{" "}
          <strong style={{ color: "var(--text)" }}>{contact}</strong>. Aprilo da
          questo dispositivo per entrare.
        </p>
        {error && <p className="field-error" role="alert" style={{ marginTop: 16 }}>{error}</p>}
      </div>
    );
  }

  // Phone: inserimento OTP
  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={titleStyle}>Conferma il tuo numero</h1>
      <p style={subStyle}>
        Inserisci il codice inviato via SMS a{" "}
        <strong style={{ color: "var(--text)" }}>{contact}</strong>.
      </p>
      <form onSubmit={onConfirmPhone} style={{ marginTop: 28, textAlign: "left" }} noValidate>
        <label className="field-label">Codice di verifica</label>
        <input
          className="input"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="123456"
          value={code}
          aria-invalid={!!error}
          onChange={(e) => setCode(e.target.value)}
          style={{ textAlign: "center", letterSpacing: "0.3em", fontSize: 20 }}
        />
        {error && <p className="field-error" role="alert">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", marginTop: 18, fontSize: 16 }}>
          {loading ? "Verifica..." : "Verifica e accedi"}
        </button>
      </form>
    </div>
  );
}

const titleStyle: React.CSSProperties = {
  fontSize: "clamp(1.8rem, 5vw, 2.4rem)",
  fontWeight: 700,
  letterSpacing: "-0.03em",
  margin: 0,
};
const subStyle: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: 16,
  marginTop: 12,
  lineHeight: 1.5,
};
