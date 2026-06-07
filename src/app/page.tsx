import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/landing/Hero";
import { Elite } from "@/components/landing/Elite";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ClosingCTA } from "@/components/landing/ClosingCTA";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Elite />
        <HowItWorks />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
