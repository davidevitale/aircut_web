"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

export function Hero() {
  const reduce = useReducedMotion();

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section
      className="relative"
      style={{
        minHeight: "92dvh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div className="ambient-glow" aria-hidden />

      <div
        className="container relative"
        style={{ zIndex: 1, paddingTop: 64, paddingBottom: 80, textAlign: "center" }}
      >
        <motion.div {...fade(0)} style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <Image
            src="/brand/icon.png"
            alt="aircut"
            width={128}
            height={128}
            priority
            style={{ width: 64, height: 64 }}
          />
        </motion.div>

        <motion.h1
          {...fade(0.08)}
          style={{
            fontSize: "clamp(2.6rem, 7vw, 4.6rem)",
            fontWeight: 700,
            lineHeight: 1.04,
            letterSpacing: "-0.03em",
            margin: 0,
            maxWidth: 860,
            marginInline: "auto",
          }}
        >
          Fai tagli di merda?
          <br />
          <span className="text-gradient">Non ti vogliamo.</span>
        </motion.h1>

        <motion.p
          {...fade(0.16)}
          style={{
            color: "var(--text-secondary)",
            fontSize: "clamp(1.05rem, 2.2vw, 1.3rem)",
            lineHeight: 1.5,
            maxWidth: 620,
            marginInline: "auto",
            marginTop: 24,
          }}
        >
          Noi mettiamo in mostra il tuo talento.
          I clienti ti invadono il negozio.
        </motion.p>

        <motion.div
          {...fade(0.24)}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: 14,
            marginTop: 38,
          }}
        >
          <a href="#come-funziona" className="btn-secondary" style={{ fontSize: 17, padding: "16px 32px" }}>
            Scopri di più
          </a>
          <Link href="/iscriviti" className="btn-primary" style={{ fontSize: 17, padding: "16px 34px" }}>
            Inizia gratis
          </Link>
        </motion.div>

        <motion.span
          {...fade(0.3)}
          style={{
            display: "block",
            color: "var(--text-tertiary)",
            fontSize: 14,
            marginTop: 18,
          }}
        >
          Un mese gratis. Nessuna carta richiesta.
        </motion.span>
      </div>
    </section>
  );
}
