import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PayButton } from "@/components/PayButton";
import { LockSimple } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Attiva AirCut",
  description: "€29 al mese. Disdici quando vuoi.",
  robots: { index: false },
};

export default function PagamentoPage() {
  return (
    <PageShell maxWidth={480}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <h1
          style={{
            fontSize: "clamp(1.9rem, 5vw, 2.6rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Attiva AirCut
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 17, marginTop: 12 }}>
          €29 al mese. Disdici quando vuoi.
        </p>
      </div>

      <div
        className="glass-strong"
        style={{ borderRadius: "var(--radius-card)", padding: "28px 26px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 6,
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.03em" }}>
            €29
          </span>
          <span style={{ color: "var(--text-secondary)", fontSize: 17 }}>/ mese</span>
        </div>

        <PayButton />

        <p
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            color: "var(--text-tertiary)",
            fontSize: 13,
            marginTop: 18,
          }}
        >
          <LockSimple size={14} weight="bold" />
          Pagamento sicuro con Stripe.
        </p>
      </div>
    </PageShell>
  );
}
