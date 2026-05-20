const steps = [
  { n: "1", title: "Tell Us Your Rooms", desc: "Enter how many kitchens, living rooms, bedrooms, play rooms, and toilets need cleaning. Each room = 1 hour." },
  { n: "2", title: "Upload Room Photos", desc: "Photos let our AI determine dirt level and set the fairest price. No photo? We quote at the deep-clean rate (£30/hr)." },
  { n: "3", title: "AI Prices Your Job", desc: "Moderate dirt: £20/hr. Medium dirt: £25/hr. Heavy/no photo: £30/hr. You see the full breakdown before paying." },
  { n: "4", title: "Cleaner Accepts & Escrow Activates", desc: "Once a cleaner accepts, full identity and address are revealed. Payment is held securely in escrow via Stripe." },
  { n: "5", title: "Job Done — Before & After Proof", desc: "Cleaner uploads arrival photos and completion photos. You approve, then escrow is released. Reviews unlock after completion." },
];

export default function HowItWorks() {
  return (
    <section style={{ padding: "90px 30px", maxWidth: "1100px", margin: "auto" }}>
      <h2 style={{ fontSize: "46px", fontWeight: 900, marginBottom: "15px" }}>How CleanConnect Works</h2>
      <p style={{ color: "#9fb0c1", fontSize: "18px", lineHeight: 1.7, marginBottom: "55px", maxWidth: "700px" }}>
        From room count to clean home — every step is transparent, verified, and protected.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
        {steps.map((s) => (
          <div key={s.n} style={{ display: "flex", gap: "22px", alignItems: "flex-start", background: "#0d1727", padding: "26px", borderRadius: "22px", border: "1px solid rgba(255,255,255,.05)" }}>
            <div style={{ minWidth: "52px", height: "52px", borderRadius: "50%", background: "linear-gradient(135deg,#1ea7ff,#0077ff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "20px" }}>
              {s.n}
            </div>
            <div>
              <h3 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "8px" }}>{s.title}</h3>
              <p style={{ color: "#9fb0c1", lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
