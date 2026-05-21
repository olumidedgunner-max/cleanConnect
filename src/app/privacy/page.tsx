import Link from "next/link";

export const metadata = { title: "Privacy Policy — CleanConnect" };

export default function PrivacyPage() {
  return (
    <main style={{ background: "#07111f", minHeight: "100vh", color: "white" }}>
      <div style={{ padding: "24px 30px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ maxWidth: "800px", margin: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ fontSize: "24px", fontWeight: 800, textDecoration: "none", color: "white" }}>Clean<span style={{ color: "#57c7ff" }}>Connect</span></Link>
          <Link href="/" style={{ color: "#9fb0c1", textDecoration: "none", fontSize: "14px" }}>← Back to Home</Link>
        </div>
      </div>
      <div style={{ maxWidth: "800px", margin: "auto", padding: "60px 30px" }}>
        <h1 style={{ fontSize: "42px", fontWeight: 900, marginBottom: "12px" }}>Privacy Policy</h1>
        <p style={{ color: "#9fb0c1", marginBottom: "40px" }}>Last updated: May 2026</p>
        {[
          { title: "What We Collect", body: "We collect your name, email address, phone number, postcode and city when you register or post a job. Full address and payment details are collected only via Stripe at the point of escrow activation — never stored by CleanConnect directly." },
          { title: "How We Use Your Data", body: "Your contact details are used to match you with local cleaners or jobs. Location data (postcode/city) is used for proximity matching only. We never sell your data to third parties." },
          { title: "Photo & Media Storage", body: "Room photos uploaded for AI pricing are stored securely and attached only to the verified booking. They are not shared publicly and are deleted after the dispute window closes." },
          { title: "Identity Reveal", body: "Full names and addresses for both clients and cleaners are only revealed to each other after escrow has been funded. This protects both parties until commitment is confirmed." },
          { title: "UK GDPR", body: "CleanConnect complies with UK GDPR. You have the right to access, correct, or request deletion of your personal data at any time. Contact us at olumidedgunner@gmail.com." },
          { title: "Cookies", body: "We use essential cookies only to maintain your session. No tracking or advertising cookies are used." },
          { title: "Contact", body: "For privacy concerns, email olumidedgunner@gmail.com." },
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
