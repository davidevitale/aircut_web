import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <PageShell glow={false} maxWidth={720}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
        Privacy Policy
      </h1>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 16 }}>
        Placeholder. Inserire qui l&rsquo;informativa privacy completa fornita
        dall&rsquo;utente. Trattiamo solo i dati indispensabili (nome, cognome,
        nome salone, email o telefono) per creare e gestire l&rsquo;account.
      </p>
    </PageShell>
  );
}
