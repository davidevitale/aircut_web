import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = { title: "Termini" };

export default function TerminiPage() {
  return (
    <PageShell glow={false} maxWidth={720}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
        Termini di servizio
      </h1>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 16 }}>
        Placeholder. Inserire qui i termini di servizio completi forniti
        dall&rsquo;utente. Iscrizione gratuita per 30 giorni, poi €29/mese.
        Nessun vincolo: disdici quando vuoi.
      </p>
    </PageShell>
  );
}
