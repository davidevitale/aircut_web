import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { DownloadApp } from "@/components/DownloadApp";

export const metadata: Metadata = {
  title: "Scarica l'app",
  description: "Account creato. Scarica l'app aircut e accedi.",
  robots: { index: false },
};

export default function ScaricaPage() {
  return (
    <PageShell>
      <DownloadApp />
    </PageShell>
  );
}
