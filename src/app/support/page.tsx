import Link from "next/link";

export const metadata = { title: "Support — CleanConnect" };

export default function SupportPage() {
  return (
    <main style={{ background: "#07111f", minHeight: "100vh", color: "white" }}>
      <div style={{ padding: "24px 30px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ maxWidth: "800px", margin: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ fontSize: "24px", fontWeight: 800, textDecoration: "none", color: "white" }}>Clean<span style={{ color: "#57c7ff" }}>Connect</span></Link>
          <Link href="/" style={{ color: "#9fb0c1", textDecoration: "none", fontSize: "14px" }}>← Back to Home</Link>
        </div>
      </div>
      <div style={{ maxWidth: "800px", margin: "auto", padding: "60px 30px" }}>
        <h1 style={{ fontSize: "42px", fontWeight: 900, marginBottom: "12px" }}>Help Centre</h1>
        <p style={{ color: "#9fb0c1", marginBottom: "50px", fontSize: "18px" }}>We&apos;re here to help. Reach us directly or browse common questions below.</p>

        <div style={{ background: "linear-gradient(135deg,#1ea7ff,#0077ff)", borderRadius: "22px", padding: "32px", marginBottom: "40px", textAlign: "center" }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>✉️</div>
          <h2 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "8px" }}>Email Support</h2>
          <p style={{ color: "rgba(255,255,255,.8)", marginBottom: "20px" }}>We aim to reply within 24 hours.</p>
          <a href="mailto:olumidedgunner@gmail.com" style={{ display: "inline-block", padding: "14px 32px", borderRadius: "12px", background: "white", color: "#0077ff", textDecoration: "none", fontWeight: 800, fontSize: "16px" }}>
            olumidedgunner@gmail.com
          </a>
        </div>

        {[
          { q: "How do I post a cleaning job?", a: "Go to the home page and scroll to 'Post a Clean Job'. Add your room counts, upload photos for AI pricing, then enter your email, phone, postcode and city. That's all you need to go live." },
          { q: "When is my full address shared with the cleaner?", a: "Never before payment. Your full address is only revealed to the cleaner after you have funded the escrow via Stripe. Until then only your city and postcode are visible." },
          { q: "How does escrow work?", a: "When a cleaner accepts your job, you pay via Stripe. The money is held securely — not paid to the cleaner yet. After the job is done and you approve, funds are released automatically." },
          { q: "What if I'm unhappy with the clean?", a: "Raise a dispute within 48 hours of approval. The cleaner's before/after photos will be reviewed alongside any evidence you provide. Our team makes a final decision within 5 working days." },
          { q: "How do cleaners get paid?", a: "After you approve the job, payment is released from escrow via Stripe within 24 hours. A 7.5% matching fee is deducted from the cleaner's payout." },
          { q: "Can a business use CleanConnect?", a: "Yes. Register a business account via 'Register Business' in the nav. Businesses pay a 15% platform fee. Full Stripe registration is required before your first job goes live." },
        ].map((faq) => (
          <div key={faq.q} style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "18px", padding: "24px", marginBottom: "16px", border: "1px solid rgba(255,255,255,.06)" }}>
            <h3 style={{ fontWeight: 800, fontSize: "17px", marginBottom: "10px" }}>{faq.q}</h3>
            <p style={{ color: "#9fb0c1", lineHeight: 1.7, fontSize: "15px" }}>{faq.a}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
