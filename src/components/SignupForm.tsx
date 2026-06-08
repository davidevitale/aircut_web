"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeSlash, Check, X, CircleNotch } from "@phosphor-icons/react";
import { validateNickname } from "@/lib/nickname";

type Method = "email" | "phone";

type Errors = Partial<
  Record<"contact" | "password" | "nickname" | "form", string>
>;

type NickState = "idle" | "checking" | "available" | "taken" | "invalid";

export function SignupForm() {
  const router = useRouter();
  const [method, setMethod] = useState<Method>("email");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [nickname, setNickname] = useState("");
  const [nickState, setNickState] = useState<NickState>("idle");
  const [nickReason, setNickReason] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  // --- Controllo live del nickname (debounced) ---
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const value = nickname.trim();
    setErrors((p) => ({ ...p, nickname: undefined }));

    if (!value) {
      setNickState("idle");
      setNickReason("");
      return;
    }
    const formatError = validateNickname(value);
    if (formatError) {
      setNickState("invalid");
      setNickReason(formatError);
      return;
    }

    setNickState("checking");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/check-nickname?value=${encodeURIComponent(value)}`
        );
        const data = await res.json();
        if (data.available) {
          setNickState("available");
          setNickReason("");
        } else {
          setNickState("taken");
          setNickReason(data.reason ?? "Nickname gia preso.");
        }
      } catch {
        setNickState("idle");
        setNickReason("");
      }
    }, 450);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [nickname]);

  function validate(): Errors {
    const e: Errors = {};
    const nickErr = validateNickname(nickname.trim());
    if (nickErr) e.nickname = nickErr;
    else if (nickState === "taken") e.nickname = "Nickname gia preso.";
    if (method === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim()))
        e.contact = "Inserisci un'email valida.";
    } else {
      if (!/^\+?[0-9\s().-]{7,}$/.test(contact.trim()))
        e.contact = "Inserisci un numero di telefono valido.";
    }
    if (password.length < 8) e.password = "Almeno 8 caratteri.";
    return e;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          contact: contact.trim(),
          password,
          nickname: nickname.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data?.errors) setErrors(data.errors);
        else setErrors({ form: data?.error ?? "Qualcosa e andato storto. Riprova." });
        setLoading(false);
        return;
      }

      router.push("/scarica");
    } catch (err) {
      console.error(err);
      setErrors({ form: "Invio non riuscito. Riprova tra poco." });
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* Toggle metodo di contatto */}
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

      <Field
        label="Nickname"
        error={errors.nickname}
        hint={
          nickState === "available"
            ? "Disponibile"
            : nickState === "taken" || nickState === "invalid"
            ? nickReason
            : "La tua identita pubblica, es. marco.tagli"
        }
        hintTone={
          nickState === "available"
            ? "ok"
            : nickState === "taken" || nickState === "invalid"
            ? "err"
            : "muted"
        }
      >
        <div style={{ position: "relative" }}>
          <input
            className="input"
            autoComplete="username"
            placeholder="marco.tagli"
            value={nickname}
            aria-invalid={
              nickState === "taken" || nickState === "invalid" || !!errors.nickname
            }
            onChange={(e) => setNickname(e.target.value)}
            style={{ paddingRight: 42 }}
          />
          <span
            aria-hidden
            style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
              display: "inline-flex",
            }}
          >
            {nickState === "checking" && (
              <CircleNotch size={18} color="var(--text-tertiary)" className="nick-spin" />
            )}
            {nickState === "available" && <Check size={18} color="#86e0b8" weight="bold" />}
            {(nickState === "taken" || nickState === "invalid") && (
              <X size={18} color="#ff9a9a" weight="bold" />
            )}
          </span>
        </div>
      </Field>

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

      <Field
        label="Password"
        error={errors.password}
        hint="Almeno 8 caratteri. La userai per accedere nell'app."
        hintTone="muted"
      >
        <div style={{ position: "relative" }}>
          <input
            className="input"
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            aria-invalid={!!errors.password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ paddingRight: 46 }}
          />
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            aria-label={showPw ? "Nascondi password" : "Mostra password"}
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 6,
              display: "inline-flex",
              color: "var(--text-tertiary)",
            }}
          >
            {showPw ? <EyeSlash size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </Field>

      {errors.form && (
        <p className="field-error" role="alert" style={{ marginBottom: 14 }}>
          {errors.form}
        </p>
      )}

      <button
        type="submit"
        className="btn-primary"
        disabled={loading || nickState === "checking"}
        style={{ width: "100%", marginTop: 8, fontSize: 16 }}
      >
        {loading ? "Creazione account..." : "Crea account"}
      </button>

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

      <style jsx>{`
        .nick-spin {
          animation: nick-rot 0.8s linear infinite;
        }
        @keyframes nick-rot {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  error,
  hint,
  hintTone = "muted",
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  hintTone?: "muted" | "ok" | "err";
  children: React.ReactNode;
}) {
  const hintColor =
    hintTone === "ok"
      ? "#86e0b8"
      : hintTone === "err"
      ? "#ff9a9a"
      : "var(--text-tertiary)";
  return (
    <div style={{ marginBottom: 16 }}>
      <label className="field-label">{label}</label>
      {children}
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p style={{ color: hintColor, fontSize: 13, marginTop: 6 }}>{hint}</p>
      ) : null}
    </div>
  );
}
