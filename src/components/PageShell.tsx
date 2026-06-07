import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * Layout centrato per le pagine di flusso (iscrizione, verifica, benvenuto,
 * prezzi, pagamento): header + contenuto con glow + footer.
 */
export function PageShell({
  children,
  glow = true,
  maxWidth = 520,
}: {
  children: React.ReactNode;
  glow?: boolean;
  maxWidth?: number;
}) {
  return (
    <>
      <Header />
      <main
        className="relative"
        style={{
          minHeight: "calc(100dvh - 64px)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "clamp(40px, 9vw, 96px) 24px",
          overflow: "hidden",
        }}
      >
        {glow && <div className="ambient-glow" aria-hidden style={{ opacity: 0.7 }} />}
        <div className="relative" style={{ zIndex: 1, width: "100%", maxWidth }}>
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
