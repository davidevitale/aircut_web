import Link from "next/link";
import { Reveal } from "../Reveal";

export function ClosingCTA() {
  return (
    <section style={{ paddingBlock: "clamp(60px, 12vw, 130px)" }}>
      <div className="container">
        <Reveal>
          <div
            className="glass-strong relative"
            style={{
              borderRadius: 28,
              padding: "clamp(48px, 8vw, 88px) 28px",
              textAlign: "center",
              overflow: "hidden",
            }}
          >
            <div className="ambient-glow" aria-hidden style={{ opacity: 0.7 }} />
            <div className="relative" style={{ zIndex: 1 }}>
              <h2
                style={{
                  fontSize: "clamp(1.9rem, 5vw, 3.1rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.08,
                  margin: 0,
                  maxWidth: 600,
                  marginInline: "auto",
                }}
              >
Se sei bravo, dimostralo. Se non lo sei, lascia stare.
              </h2>
              <div style={{ marginTop: 34 }}>
                <Link
                  href="/iscriviti"
                  className="btn-primary"
                  style={{ fontSize: 17, padding: "16px 34px" }}
                >
                  Inizia gratis · 1 mese
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
