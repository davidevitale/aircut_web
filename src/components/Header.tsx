import Link from "next/link";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50">
      <div
        className="glass"
        style={{
          borderLeft: "none",
          borderRight: "none",
          borderTop: "none",
        }}
      >
        <nav
          className="container flex items-center justify-between"
          style={{ height: 64 }}
          aria-label="Principale"
        >
          <Logo />
          <div className="flex items-center" style={{ gap: 10 }}>
            <Link
              href="/prezzi"
              className="hidden sm:inline-flex"
              style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: 15,
                fontWeight: 500,
                padding: "8px 12px",
              }}
            >
              Prezzi
            </Link>
            <Link href="/iscriviti" className="btn-primary" style={{ padding: "10px 20px", fontSize: 15 }}>
              Inizia gratis
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
