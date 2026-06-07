import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AirCut. Vieni scelto per quello che sai fare",
    template: "%s · AirCut",
  },
  description:
    "La piattaforma dove i clienti scelgono il professionista, non il salone. Solo lavori reali. Solo i migliori.",
  icons: {
    icon: "/brand/icon.png",
    apple: "/brand/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    title: "AirCut. Vieni scelto per quello che sai fare",
    description:
      "La piattaforma dove i clienti scelgono il professionista, non il salone.",
    images: ["/brand/icon.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AirCut. Vieni scelto per quello che sai fare",
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
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
