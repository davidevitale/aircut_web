import { Reveal } from "../Reveal";

export function Elite() {
  return (
    <section className="relative" style={{ overflow: "hidden", paddingBlock: "clamp(80px, 14vw, 150px)" }}>
      <div
        className="ambient-glow"
        aria-hidden
        style={{ opacity: 0.6, transform: "scaleY(-1)" }}
      />
      <div className="container relative" style={{ zIndex: 1, textAlign: "center", maxWidth: 760 }}>
        <Reveal>
          <h2
            style={{
              fontSize: "clamp(2rem, 5.5vw, 3.4rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.06,
              margin: 0,
            }}
          >
            Accettiamo solo l&rsquo;élite.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "clamp(1.05rem, 2.4vw, 1.35rem)",
              lineHeight: 1.55,
              marginTop: 22,
              marginInline: "auto",
              maxWidth: 620,
            }}
          >
            Ogni portfolio è reale, autentico, verificato. Niente filtri. Niente
            saloni. Solo talento.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
