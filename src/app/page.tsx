import HeroSection from "@/components/HeroSection";
import ExplainerVideo from "@/components/ExplainerVideo";
import JobListings from "@/components/JobListings";
import HowItWorks from "@/components/HowItWorks";
import FeeStructure from "@/components/FeeStructure";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ExplainerVideo />

      {/* Post a Job CTA */}
      <section style={{ padding: "70px 30px", background: "#07111f" }}>
        <div style={{ maxWidth: "1100px", margin: "auto", background: "linear-gradient(135deg,#0d1f35,#0a1628)", borderRadius: "28px", padding: "50px 60px", border: "1px solid rgba(30,167,255,.15)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "30px" }}>
          <div>
            <h2 style={{ fontSize: "36px", fontWeight: 900, marginBottom: "12px" }}>Ready to book a clean?</h2>
            <p style={{ color: "#9fb0c1", fontSize: "17px", lineHeight: 1.6, maxWidth: "500px" }}>
              Tell us your rooms, upload photos, and our AI prices your job in seconds. Email and phone are all you need to get started.
            </p>
          </div>
          <Link href="/post-job" style={{ padding: "20px 40px", borderRadius: "16px", background: "linear-gradient(135deg,#1ea7ff,#0077ff)", color: "white", textDecoration: "none", fontWeight: 800, fontSize: "18px", whiteSpace: "nowrap" }}>
            Post a Clean Job →
          </Link>
        </div>
      </section>

      <JobListings />
      <HowItWorks />
      <FeeStructure />
      <Footer />
    </main>
  );
}
