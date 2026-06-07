import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-brand",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AirCut. Ti scelgono per come tagli, non per il salone",
    template: "%s · AirCut",
  },
  description:
    "Niente raccomandati, niente foto rubate. Qui i clienti ti scelgono per come tagli. Mostra il talento, ti scelgono da soli.",
  icons: {
    icon: "/brand/icon.png",
    apple: "/brand/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    title: "AirCut. Ti scelgono per come tagli, non per il salone",
    description:
      "Niente raccomandati. Qui i clienti ti scelgono per come tagli, non per il salone.",
    images: ["/brand/icon.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AirCut. Ti scelgono per come tagli, non per il salone",
    images: ["/brand/icon.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={quicksand.variable}>
      <body>{children}</body>
    </html>
  );
}
