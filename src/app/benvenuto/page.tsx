import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "@/components/PageShell";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Ci sei",
  robots: { index: false },
};

// Placeholder: sostituire con i link reali agli store / deep link dell'app.
const APP_DEEP_LINK = "aircut://open";
const APP_STORE_URL = "#";
const PLAY_STORE_URL = "#";

export default function BenvenutoPage() {
  return (
    <PageShell maxWidth={520}>
      <div style={{ textAlign: "center" }}>
        <span
          aria-hidden
          style={{ display: "inline-flex", marginBottom: 22 }}
        >
          <CheckCircle size={58} weight="light" color="#BEB2E6" />
        </span>

        <h1
          style={{
            fontSize: "clamp(2rem, 5.5vw, 2.8rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Ci sei.
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 18, marginTop: 14 }}>
          Il tuo profilo è attivo.
        </p>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: 16,
            marginTop: 18,
            lineHeight: 1.55,
            maxWidth: 420,
            marginInline: "auto",
          }}
        >
          Apri l&rsquo;app AirCut e accedi con lo stesso identificativo
          (email o telefono): sei già dentro.
        </p>

        <div style={{ marginTop: 34 }}>
          <a
            href={APP_DEEP_LINK}
            className="btn-primary"
            style={{ fontSize: 16, padding: "16px 34px" }}
          >
            Apri l&rsquo;app
          </a>
        </div>

        {/* Badge store (placeholder finché non forniti gli URL reali) */}
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            marginTop: 24,
            flexWrap: "wrap",
          }}
        >
          <StoreBadge href={APP_STORE_URL} label="Scarica su App Store" />
          <StoreBadge href={PLAY_STORE_URL} label="Disponibile su Google Play" />
        </div>
      </div>
    </PageShell>
  );
}

function StoreBadge({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="glass"
      aria-label={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "10px 18px",
        borderRadius: 12,
        color: "var(--text-secondary)",
        textDecoration: "none",
        fontSize: 13,
        fontWeight: 500,
      }}
    >
      {label}
    </a>
  );
}
