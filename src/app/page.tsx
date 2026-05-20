import HeroSection from "@/components/HeroSection";
import PricingSection from "@/components/PricingSection";
import ComparisonSection from "@/components/ComparisonSection";
import AddonsSection from "@/components/AddonsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <PricingSection />
      <ComparisonSection />
      <AddonsSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
