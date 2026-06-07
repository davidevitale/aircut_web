"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  sendSignInLinkToEmail,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  type ConfirmationResult,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";

type Method = "email" | "phone";
type Errors = Partial<
  Record<"contact" | "firstName" | "lastName" | "salonName" | "form", string>
>;

export function SignupForm() {
  const router = useRouter();
  const [method, setMethod] = useState<Method>("email");
  const [contact, setContact] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [salonName, setSalonName] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef<HTMLDivElement>(null);

  function validate(): Errors {
    const e: Errors = {};
    if (!firstName.trim()) e.firstName = "Inserisci il nome.";
    if (!lastName.trim()) e.lastName = "Inserisci il cognome.";
    if (!salonName.trim()) e.salonName = "Inserisci il nome del salone.";
    if (method === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim()))
        e.contact = "Inserisci un'email valida.";
    } else {
      if (!/^\+?[0-9\s().-]{7,}$/.test(contact.trim()))
        e.contact = "Inserisci un numero di telefono valido.";
    }
    return e;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    const value = contact.trim();

    try {
      // 1. Crea utente + profilo + trial lato server.
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          contact: value,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          salonName: salonName.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data?.errors) setErrors(data.errors);
        else setErrors({ form: data?.error ?? "Qualcosa e andato storto. Riprova." });
        setLoading(false);
        return;
      }

      const auth = getFirebaseAuth();

      if (method === "email") {
        // 2a. Invia il magic link via Firebase Auth.
        const url = `${window.location.origin}/verifica`;
        await sendSignInLinkToEmail(auth, value, {
          url,
          handleCodeInApp: true,
        });
        window.localStorage.setItem("aircut_email_for_signin", value);
        router.push(`/verifica?method=email&contact=${encodeURIComponent(value)}`);
      } else {
        // 2b. Invia OTP via SMS (richiede reCAPTCHA invisibile).
        const verifier = new RecaptchaVerifier(auth, recaptchaRef.current!, {
          size: "invisible",
        });
        const confirmation: ConfirmationResult = await signInWithPhoneNumber(
          auth,
          value.replace(/[\s().-]/g, ""),
          verifier
        );
        // Conserva il confirmationResult per la pagina /verifica.
        (window as any).__aircutConfirmation = confirmation;
        window.sessionStorage.setItem("aircut_phone", value);
        router.push(`/verifica?method=phone&contact=${encodeURIComponent(value)}`);
      }
    } catch (err: any) {
      console.error(err);
      setErrors({ form: "Invio non riuscito. Riprova tra poco." });
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div
        className="glass"
        role="tablist"
        aria-label="Metodo di contatto"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          padding: 4,
          borderRadius: "var(--radius-pill)",
          marginBottom: 22,
        }}
      >
        {(["email", "phone"] as Method[]).map((m) => {
          const active = method === m;
          return (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setMethod(m);
                setContact("");
                setErrors((p) => ({ ...p, contact: undefined }));
              }}
              style={{
                border: "none",
                cursor: "pointer",
                borderRadius: "var(--radius-pill)",
                padding: "11px 0",
                fontSize: 15,
                fontWeight: 600,
                color: active ? "#0A0A0F" : "var(--text-secondary)",
                background: active ? "var(--brand-gradient)" : "transparent",
                transition: "color .2s",
              }}
            >
              {m === "email" ? "Email" : "Telefono"}
            </button>
          );
        })}
      </div>

      <Field label={method === "email" ? "Email" : "Telefono"} error={errors.contact}>
        <input
          className="input"
          type={method === "email" ? "email" : "tel"}
          inputMode={method === "email" ? "email" : "tel"}
          autoComplete={method === "email" ? "email" : "tel"}
          placeholder={method === "email" ? "tu@esempio.it" : "+39 333 123 4567"}
          value={contact}
          aria-invalid={!!errors.contact}
          onChange={(e) => setContact(e.target.value)}
        />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Nome" error={errors.firstName}>
          <input
            className="input"
            autoComplete="given-name"
            value={firstName}
            aria-invalid={!!errors.firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Field>
        <Field label="Cognome" error={errors.lastName}>
          <input
            className="input"
            autoComplete="family-name"
            value={lastName}
            aria-invalid={!!errors.lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Field>
      </div>

      <Field label="Nome del salone" error={errors.salonName}>
        <input
          className="input"
          autoComplete="organization"
          value={salonName}
          aria-invalid={!!errors.salonName}
          onChange={(e) => setSalonName(e.target.value)}
        />
      </Field>

      {errors.form && (
        <p className="field-error" role="alert" style={{ marginBottom: 14 }}>
          {errors.form}
        </p>
      )}

      <button
        type="submit"
        className="btn-primary"
        disabled={loading}
        style={{ width: "100%", marginTop: 8, fontSize: 16 }}
      >
        {loading ? "Invio in corso..." : "Continua"}
      </button>

      {/* contenitore reCAPTCHA invisibile per Phone Auth */}
      <div ref={recaptchaRef} />

      <p
        style={{
          color: "var(--text-tertiary)",
          fontSize: 13,
          textAlign: "center",
          marginTop: 16,
          lineHeight: 1.5,
        }}
      >
        Continuando accetti i{" "}
        <a href="/legal/termini" style={{ color: "var(--text-secondary)" }}>
          Termini
        </a>{" "}
        e la{" "}
        <a href="/legal/privacy" style={{ color: "var(--text-secondary)" }}>
          Privacy
        </a>
        .
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label className="field-label">{label}</label>
      {children}
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
