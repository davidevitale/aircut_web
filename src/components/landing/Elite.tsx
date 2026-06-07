import { Reveal } from "../Reveal";

export function Elite() {
  return (
    <section
      className="relative"
      style={{ overflow: "hidden", paddingBlock: "clamp(80px, 14vw, 150px)" }}
    >
      <div
        className="ambient-glow"
        aria-hidden
        style={{ opacity: 0.6, transform: "scaleY(-1)" }}
      />
      <div
        className="container relative"
        style={{ zIndex: 1, textAlign: "center", maxWidth: 860 }}
      >
        <Reveal>
          <span
            style={{
              display: "inline-block",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              marginBottom: 22,
            }}
          >
            La nostra visione
          </span>
        </Reveal>

        <Reveal delay={0.06}>
          <h2
            style={{
              fontSize: "clamp(2rem, 5.5vw, 3.4rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            <span className="text-gradient">aircut</span> vuole mostrare il tuo talento.
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "clamp(1.1rem, 2.4vw, 1.4rem)",
              lineHeight: 1.55,
              marginTop: 22,
              marginInline: "auto",
              maxWidth: 640,
            }}
          >
            Tagli da fenomeno, ma vince chi ha l&rsquo;insegna pi&ugrave; grossa.
            Non le mani migliori.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div
            className="glass-strong"
            style={{
              marginTop: 38,
              borderRadius: "var(--radius-card)",
              padding: "clamp(30px, 5vw, 48px)",
              textAlign: "left",
            }}
          >
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "clamp(1.05rem, 2.2vw, 1.3rem)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              <span className="text-gradient">aircut</span> &egrave; il palcoscenico del
              talento beauty. Ogni tuo lavoro diventa un asset che lavora per te
              24 ore su 24 e attira clienti che hanno gi&agrave; visto il risultato che
              vogliono.
            </p>
            <p
              style={{
                color: "var(--text)",
                fontSize: "clamp(1.25rem, 2.8vw, 1.6rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.3,
                marginTop: 24,
                marginBottom: 0,
              }}
            >
              Qui scelgono te per quello che sai fare. Non il salone, non il
              prezzo. Solo il talento.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
