import Link from "next/link";

export const metadata = { title: "Terms of Service — CleanConnect" };

export default function TermsPage() {
  return (
    <main style={{ background: "#07111f", minHeight: "100vh", color: "white" }}>
      <div style={{ padding: "24px 30px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ maxWidth: "800px", margin: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ fontSize: "24px", fontWeight: 800, textDecoration: "none", color: "white" }}>Clean<span style={{ color: "#57c7ff" }}>Connect</span></Link>
          <Link href="/" style={{ color: "#9fb0c1", textDecoration: "none", fontSize: "14px" }}>← Back to Home</Link>
        </div>
      </div>
      <div style={{ maxWidth: "800px", margin: "auto", padding: "60px 30px" }}>
        <h1 style={{ fontSize: "42px", fontWeight: 900, marginBottom: "12px" }}>Terms of Service</h1>
        <p style={{ color: "#9fb0c1", marginBottom: "40px" }}>Last updated: May 2026</p>
        {[
          { title: "Platform Role", body: "CleanConnect is a marketplace that connects clients with cleaners. We are not a cleaning company. We do not employ cleaners. All jobs are agreed directly between clients and cleaners." },
          { title: "Platform Fees", body: "Clients (individuals) pay a 5% platform fee on each job. Businesses pay 15%. Cleaners pay a 7.5% matching fee deducted from their payout. All fees are shown before any commitment is made." },
          { title: "Escrow Payments", body: "All payments are processed via Stripe and held in escrow. Funds are only released after the client confirms job completion or after the dispute window closes. CleanConnect does not hold funds directly." },
          { title: "Identity Verification", body: "Both clients and cleaners must complete identity verification via Stripe before a job proceeds. Full addresses are only exchanged after escrow is funded." },
          { title: "Photo Evidence", body: "Cleaners are required to upload before and after photos for every job. This evidence is used in any dispute resolution process." },
          { title: "Disputes", body: "Disputes must be raised within 48 hours of job completion. CleanConnect will review evidence and make a final decision within 5 working days. Our decision is final." },
          { title: "Prohibited Use", body: "Users must not post false information, manipulate reviews, attempt to bypass escrow, or engage in any fraudulent activity. Violations will result in permanent account suspension." },
          { title: "Limitation of Liability", body: "CleanConnect is not liable for damage to property during a cleaning job. We recommend both parties document the condition of the property with photos before and after the service." },
          { title: "Contact", body: "For legal queries, email olumidedgunner@gmail.com." },
        ].map((s) => (
          <div key={s.title} style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "12px", color: "#57c7ff" }}>{s.title}</h2>
            <p style={{ color: "#c5d0dc", lineHeight: 1.8, fontSize: "16px" }}>{s.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
