import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SignupForm } from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "Fai vedere chi sei",
  description: "Un mese gratis. Nessuna carta. Solo i tuoi tagli.",
};

export default function IscrivitiPage() {
  return (
    <PageShell>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <h1
          style={{
            fontSize: "clamp(1.9rem, 5vw, 2.6rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Fai vedere chi sei
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 17, marginTop: 12 }}>
          Un mese gratis. Nessuna carta. Solo i tuoi tagli.
        </p>
      </div>
      <SignupForm />
    </PageShell>
  );
}
