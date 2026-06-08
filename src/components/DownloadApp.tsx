"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { detectPlatform, storeUrlFor, APP_STORE_URL, PLAY_STORE_URL } from "@/lib/stores";

/**
 * Pagina post-registrazione.
 * - Mobile (iOS/Android): redirect automatico allo store giusto.
 * - Desktop: mostra i badge dei due store + un QR code da inquadrare.
 *
 * L'account è già creato sul sito; nell'app il professionista accede con la
 * stessa email e password.
 */
export function DownloadApp() {
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop" | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const qrCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const p = detectPlatform(navigator.userAgent);
    setPlatform(p);

    const url = storeUrlFor(p);
    if (url) {
      setRedirecting(true);
      // Piccolo ritardo per mostrare il messaggio prima del redirect.
      const t = setTimeout(() => {
        window.location.href = url;
      }, 1200);
      return () => clearTimeout(t);
    }
  }, []);

  // Su desktop genera il QR verso questa stessa pagina (che poi reindirizza
  // allo store dal telefono).
  useEffect(() => {
    if (platform !== "desktop" || !qrCanvas.current) return;
    const target = `${window.location.origin}/scarica`;
    QRCode.toCanvas(qrCanvas.current, target, {
      width: 200,
      margin: 1,
      color: { dark: "#0a0a0f", light: "#ffffff" },
    }).catch(() => {});
  }, [platform]);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <Image
          src="/brand/icon.png"
          alt="aircut"
          width={128}
          height={128}
          priority
          style={{ width: 72, height: 72 }}
        />
      </div>

      <h1
        style={{
          fontSize: "clamp(1.8rem, 5vw, 2.4rem)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          margin: 0,
        }}
      >
        Account creato.
      </h1>
      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: 17,
          lineHeight: 1.5,
          marginTop: 14,
          maxWidth: 420,
          marginInline: "auto",
        }}
      >
        {redirecting
          ? "Ti stiamo portando allo store per scaricare l'app…"
          : "Scarica l'app e accedi con la stessa email e password."}
      </p>

      {/* Mobile: in attesa del redirect, link manuale di fallback */}
      {platform && platform !== "desktop" && (
        <div style={{ marginTop: 30 }}>
          <a
            href={storeUrlFor(platform) ?? "#"}
            className="btn-primary"
            style={{ fontSize: 16, padding: "15px 30px" }}
          >
            Apri lo store
          </a>
        </div>
      )}

      {/* Desktop: QR + entrambi i badge */}
      {platform === "desktop" && (
        <div style={{ marginTop: 32 }}>
          <div
            className="glass glass-card"
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              padding: 24,
            }}
          >
            <canvas
              ref={qrCanvas}
              width={200}
              height={200}
              style={{ borderRadius: 12, display: "block" }}
              aria-label="QR code per scaricare l'app"
            />
            <span style={{ color: "var(--text-tertiary)", fontSize: 13 }}>
              Inquadra col telefono
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 12,
              marginTop: 24,
            }}
          >
            <a href={APP_STORE_URL} className="btn-secondary" style={{ fontSize: 15 }}>
              App Store
            </a>
            <a href={PLAY_STORE_URL} className="btn-secondary" style={{ fontSize: 15 }}>
              Google Play
            </a>
          </div>
        </div>
      )}

      <p
        style={{
          color: "var(--text-tertiary)",
          fontSize: 13,
          marginTop: 28,
          lineHeight: 1.5,
        }}
      >
        Hai un mese gratis. Completi il tuo profilo direttamente nell&rsquo;app.
      </p>
    </div>
  );
}
