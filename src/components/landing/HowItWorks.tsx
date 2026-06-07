import { Reveal } from "../Reveal";
import { Images, MagnifyingGlass, LinkSimple } from "@phosphor-icons/react/dist/ssr";

const steps = [
  {
    Icon: Images,
    title: "Pubblichi il tuo portfolio",
    body: "Lavori reali, su persone reali, senza filtri. Le tue forbici, in vetrina.",
  },
  {
    Icon: MagnifyingGlass,
    title: "Ti scelgono per i tuoi tagli",
    body: "Il cliente vede il tuo lavoro e vuole proprio te. Non il salone accanto.",
  },
  {
    Icon: LinkSimple,
    title: "Prenotano dal tuo link",
    body: "Si aggancia al gestionale che già usi. Ogni euro resta tuo: noi non tratteniamo niente.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="come-funziona"
      style={{ paddingBlock: "clamp(40px, 8vw, 90px)", scrollMarginTop: 80 }}
    >
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

        <Reveal delay={0.06}>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "clamp(1rem, 2.2vw, 1.2rem)",
              lineHeight: 1.55,
              textAlign: "center",
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            Smetti di aspettare che entri qualcuno. Riempi la poltrona di clienti
            che cercavano proprio te.
          </p>
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
