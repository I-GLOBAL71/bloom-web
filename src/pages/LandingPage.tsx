import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { CTASection } from '../components/landing/CTASection';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
export function LandingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}