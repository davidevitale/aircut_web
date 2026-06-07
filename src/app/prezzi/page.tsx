import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Check } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Prezzi",
  description: "Un mese gratis. Poi €29 al mese.",
};

const included = [
  "Portfolio illimitato",
  "Visual discovery",
  "Il tuo link di prenotazione",
  "Zero commissioni",
  "Zero vincoli: se non ti serve, te ne vai",
];

export default function PrezziPage() {
  return (
    <PageShell maxWidth={560}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1
          style={{
            fontSize: "clamp(2rem, 5.5vw, 3rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            margin: 0,
          }}
        >
          Un mese gratis.
          <br />
          Poi <span className="text-gradient">€29 al mese.</span>
        </h1>
      </div>

      <div
        className="glass-strong"
        style={{ borderRadius: "var(--radius-card)", padding: "32px 28px" }}
      >
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 16 }}>
          {included.map((item) => (
            <li
              key={item}
              style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 16.5 }}
            >
              <span
                aria-hidden
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  background: "var(--surface-glass-strong)",
                  border: "1px solid var(--border-glass)",
                  flexShrink: 0,
                }}
              >
                <Check size={15} weight="bold" color="#BEB2E6" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <Link
          href="/iscriviti"
          className="btn-primary"
          style={{ width: "100%", marginTop: 30, fontSize: 16 }}
        >
          Inizia gratis
        </Link>
        <p
          style={{
            color: "var(--text-tertiary)",
            fontSize: 13,
            textAlign: "center",
            marginTop: 14,
          }}
        >
          Nessuna carta richiesta. Il pagamento parte solo a fine trial.
        </p>
      </div>
    </PageShell>
  );
}
