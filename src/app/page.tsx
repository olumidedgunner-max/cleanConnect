import HeroSection from "@/components/HeroSection";
import PostJobSection from "@/components/PostJobSection";
import JobListings from "@/components/JobListings";
import RegisterCleanerSection from "@/components/RegisterCleanerSection";
import RegisterBusinessSection from "@/components/RegisterBusinessSection";
import HowItWorks from "@/components/HowItWorks";
import FeeStructure from "@/components/FeeStructure";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <PostJobSection />
      <JobListings />
      <RegisterCleanerSection />
      <RegisterBusinessSection />
      <HowItWorks />
      <FeeStructure />
      <Footer />
    </main>
  );
}
