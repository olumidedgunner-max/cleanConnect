import RegisterCleanerSection from "@/components/RegisterCleanerSection";
import Link from "next/link";

export const metadata = { title: "Register as a Cleaner — CleanConnect" };

export default function RegisterCleanerPage() {
  return (
    <main style={{ background: "#07111f", minHeight: "100vh", color: "white" }}>
      <div style={{ padding: "24px 30px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ maxWidth: "1100px", margin: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ fontSize: "28px", fontWeight: 800, textDecoration: "none", color: "white" }}>
            Clean<span style={{ color: "#57c7ff" }}>Connect</span>
          </Link>
          <Link href="/" style={{ color: "#9fb0c1", textDecoration: "none", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
            ← Back to Home
          </Link>
        </div>
      </div>
      <RegisterCleanerSection />
    </main>
  );
}
