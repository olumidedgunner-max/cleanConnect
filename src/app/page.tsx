import HeroSection from "@/components/HeroSection";
import PostJobSection from "@/components/PostJobSection";
import ExplainerVideo from "@/components/ExplainerVideo";
import JobListings from "@/components/JobListings";
import HowItWorks from "@/components/HowItWorks";
import FeeStructure from "@/components/FeeStructure";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ExplainerVideo />
      <PostJobSection />
      <JobListings />
      <HowItWorks />
      <FeeStructure />
      <Footer />
    </main>
  );
}
