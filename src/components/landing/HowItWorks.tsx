import { Reveal } from "../Reveal";
import { Images, MagnifyingGlass, LinkSimple } from "@phosphor-icons/react/dist/ssr";

const steps = [
  {
    Icon: Images,
    title: "Pubblica il tuo portfolio",
    body: "Lavori reali, su persone reali.",
  },
  {
    Icon: MagnifyingGlass,
    title: "Vieni scoperto",
    body: "I clienti ti scelgono guardando i risultati.",
  },
  {
    Icon: LinkSimple,
    title: "Prenotano da te",
    body: "Con il tuo link. Zero commissioni: incassi tu. Funziona con il gestionale che già usi.",
  },
];

export function HowItWorks() {
  return (
    <section style={{ paddingBlock: "clamp(40px, 8vw, 90px)" }}>
      <div className="container">
        <Reveal>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4.5vw, 2.7rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              textAlign: "center",
              margin: 0,
              marginBottom: 14,
            }}
          >
            Come funziona
          </h2>
        </Reveal>

        <div
          style={{
            display: "grid",
            gap: 18,
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            marginTop: 40,
          }}
        >
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <article
                className="glass"
                style={{
                  borderRadius: "var(--radius-card)",
                  padding: "32px 28px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: "var(--surface-glass-strong)",
                    border: "1px solid var(--border-glass)",
                  }}
                >
                  <step.Icon size={26} weight="light" color="#BEB2E6" />
                </span>
                <h3
                  style={{
                    fontSize: 19,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    margin: 0,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: 15.5,
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {step.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
