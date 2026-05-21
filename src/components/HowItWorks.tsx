const steps = [
  {
    n: "1",
    title: "Register Your Job — AI Prices It Instantly",
    desc: "Enter your rooms (kitchen, bedrooms, bathrooms, living rooms, play rooms). Upload a photo of each. Claude AI analyses: room type, size, dirtiness score 1–10, and calculates the fair price using base hours × size × dirtiness × £20. No photo? Quoted at the heavy-clean rate (£30/hr). Your job is posted with email, phone, postcode and city — that's all we need upfront.",
    color: "#57c7ff",
  },
  {
    n: "2",
    title: "A Cleaner Accepts — Not the Same Person Who Posted",
    desc: "Your job is live on the marketplace. A separate registered cleaner or cleaning company in your area accepts it. This triggers full identity and payment verification for both parties via Stripe. Your full address is only revealed to the cleaner after escrow is funded.",
    color: "#22c55e",
  },
  {
    n: "3",
    title: "Both Parties Verified — Escrow Activated",
    desc: "Both the client and the cleaner complete Stripe ID verification and account registration. Payment is held securely in escrow — the cleaner cannot receive it until the job is confirmed complete. The cleaner photographs the rooms on arrival as evidence of the starting condition.",
    color: "#f59e0b",
  },
  {
    n: "4",
    title: "Job Done — Before & After Photos Uploaded",
    desc: "The cleaner completes the job and uploads after photos of every room. These are matched against the before photos. Timestamps, GPS check-in, and chat history are all recorded as part of the verified booking record.",
    color: "#c084fc",
  },
  {
    n: "5",
    title: "AI Checks the Clean — Money Releases",
    desc: "AI compares before and after photos. If the room passes — payment drops to the cleaner immediately. If AI is uncertain, you receive an SMS and email notification to approve or raise a dispute. No response within 4 hours? Payment releases automatically. Both parties can leave verified reviews after completion.",
    color: "#1ea7ff",
  },
];

export default function HowItWorks() {
  return (
    <section style={{ padding: "90px 30px", maxWidth: "1100px", margin: "auto" }}>
      <h2 style={{ fontSize: "46px", fontWeight: 900, marginBottom: "15px" }}>The Full CleanConnect Flow</h2>
      <p style={{ color: "#9fb0c1", fontSize: "18px", lineHeight: 1.7, marginBottom: "55px", maxWidth: "700px" }}>
        Every step verified. Every penny protected. From photo upload to payment — fully automated.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {steps.map((s, i) => (
          <div key={s.n} style={{ display: "flex", gap: "0", position: "relative" }}>
            {/* Left column: number + connector line */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "60px", flexShrink: 0 }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: `linear-gradient(135deg, ${s.color}, ${s.color}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "18px", flexShrink: 0, border: `2px solid ${s.color}40` }}>
                {s.n}
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: "2px", flex: 1, background: `linear-gradient(${s.color}40, ${steps[i + 1].color}40)`, minHeight: "40px" }} />
              )}
            </div>
            {/* Right column: content */}
            <div style={{ flex: 1, paddingLeft: "24px", paddingBottom: i < steps.length - 1 ? "32px" : "0" }}>
              <div style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", padding: "26px 28px", borderRadius: "20px", border: `1px solid ${s.color}20` }}>
                <div style={{ display: "inline-block", padding: "4px 12px", background: `${s.color}18`, borderRadius: "8px", color: s.color, fontSize: "12px", fontWeight: 700, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Step {s.n}
                </div>
                <h3 style={{ fontSize: "19px", fontWeight: 800, marginBottom: "10px" }}>{s.title}</h3>
                <p style={{ color: "#9fb0c1", lineHeight: 1.8, fontSize: "15px" }}>{s.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Escrow summary box */}
      <div style={{ marginTop: "40px", background: "linear-gradient(135deg,#0d1f35,#0a1628)", borderRadius: "22px", padding: "28px 32px", border: "1px solid rgba(30,167,255,.2)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
        {[
          { icon: "🔒", label: "Individual posts a job", fee: "5% platform fee" },
          { icon: "🧹", label: "Cleaner accepts a job", fee: "7.5% matching fee" },
          { icon: "🏢", label: "Business posts a job", fee: "15% platform fee" },
          { icon: "⏱", label: "No approval after 4hrs", fee: "Auto-release to cleaner" },
        ].map((f) => (
          <div key={f.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>{f.icon}</div>
            <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>{f.label}</div>
            <div style={{ color: "#57c7ff", fontSize: "13px", fontWeight: 700 }}>{f.fee}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
