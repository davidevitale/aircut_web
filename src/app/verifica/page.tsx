import { Suspense } from "react";
import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { VerifyForm } from "@/components/VerifyForm";

export const metadata: Metadata = {
  title: "Verifica",
  robots: { index: false },
};

export default function VerificaPage() {
  return (
    <PageShell maxWidth={480}>
      <Suspense
        fallback={
          <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
            Caricamento…
          </div>
        }
      >
        <VerifyForm />
      </Suspense>
    </PageShell>
  );
}
