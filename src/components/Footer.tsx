import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer style={{ marginTop: 0 }}>
      <hr className="glass-divider" />
      <div
        className="container"
        style={{ paddingTop: 48, paddingBottom: 48 }}
      >
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between"
          style={{ gap: 24 }}
        >
          <div style={{ maxWidth: 320 }}>
            <Logo />
            <p
              style={{
                color: "var(--text-tertiary)",
                fontSize: 14,
                marginTop: 14,
                lineHeight: 1.5,
              }}
            >
              Il palcoscenico del talento per il mondo beauty.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-wrap"
            style={{ gap: "10px 28px" }}
          >
            <Link href="/prezzi" style={footerLink}>
              Prezzi
            </Link>
            <Link href="/iscriviti" style={footerLink}>
              Iscriviti
            </Link>
            {/* Placeholder: aggiornare con i contatti reali */}
            <a href="mailto:ciao@aircut.app" style={footerLink}>
              Contatti
            </a>
            <Link href="/legal/privacy" style={footerLink}>
              Privacy
            </Link>
            <Link href="/legal/termini" style={footerLink}>
              Termini
            </Link>
          </nav>
        </div>

        <p
          style={{
            color: "var(--text-tertiary)",
            fontSize: 13,
            marginTop: 36,
          }}
        >
          © {new Date().getFullYear()} AirCut. Tutti i diritti riservati.
        </p>
      </div>
    </footer>
  );
}

const footerLink: React.CSSProperties = {
  color: "var(--text-secondary)",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 500,
};
