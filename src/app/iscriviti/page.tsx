import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SignupForm } from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "Crea il tuo profilo",
  description: "Un mese gratis. Nessuna carta.",
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
          Crea il tuo profilo
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 17, marginTop: 12 }}>
          Un mese gratis. Nessuna carta.
        </p>
      </div>
      <SignupForm />
    </PageShell>
  );
}
