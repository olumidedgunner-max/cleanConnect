const jobs = [
  {
    badge: "Awaiting Cleaner",
    badgeColor: "#f59e0b",
    title: "3-Bed House Clean",
    detail: "3 bedrooms · 1 kitchen · 1 living room · 2 toilets",
    condition: "AI: Moderate dirt",
    conditionColor: "#f59e0b",
    price: "£140",
    duration: "7 hours",
    verified: true,
  },
  {
    badge: "Escrow Secured",
    badgeColor: "#1ea7ff",
    title: "Airbnb Turnover",
    detail: "1 bedroom · 1 kitchen · 1 living room · 1 toilet",
    condition: "AI: Medium dirt",
    conditionColor: "#3b82f6",
    price: "£100",
    duration: "4 hours",
    verified: true,
  },
  {
    badge: "Unverified Condition",
    badgeColor: "#ef4444",
    title: "Student Flat Clean",
    detail: "2 bedrooms · 1 kitchen · 1 toilet",
    condition: "No photo — heavy rate applied",
    conditionColor: "#ef4444",
    price: "£120",
    duration: "4 hours",
    verified: false,
  },
];

export default function JobListings() {
  return (
    <section style={{ padding: "90px 30px", maxWidth: "1100px", margin: "auto" }}>
      <h2 style={{ fontSize: "46px", fontWeight: 900, marginBottom: "15px" }}>Current Jobs Awaiting Cleaners</h2>
      <p style={{ color: "#9fb0c1", fontSize: "18px", lineHeight: 1.7, marginBottom: "55px", maxWidth: "700px" }}>
        Verified clients post jobs with room photos. AI estimates the clean level so cleaners know exactly what to expect.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "25px" }}>
        {jobs.map((job) => (
          <div key={job.title} style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "26px", padding: "28px", border: "1px solid rgba(255,255,255,.06)", boxShadow: "0 18px 45px rgba(0,0,0,.28)" }}>
            <div style={{ display: "inline-block", padding: "8px 14px", background: `rgba(${job.badgeColor === "#f59e0b" ? "245,158,11" : job.badgeColor === "#1ea7ff" ? "30,167,255" : "239,68,68"},.15)`, border: `1px solid rgba(${job.badgeColor === "#f59e0b" ? "245,158,11" : job.badgeColor === "#1ea7ff" ? "30,167,255" : "239,68,68"},.3)`, borderRadius: "999px", color: job.badgeColor, fontSize: "13px", fontWeight: 700, marginBottom: "18px" }}>
              {job.badge}
            </div>
            <h3 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "10px" }}>{job.title}</h3>
            <p style={{ color: "#9fb0c1", fontSize: "14px", marginBottom: "12px" }}>{job.detail}</p>
            <div style={{ color: job.conditionColor, fontSize: "13px", fontWeight: 700, marginBottom: "16px" }}>
              {job.verified ? "📷 " : "⚠️ "}{job.condition}
            </div>
            <div style={{ fontSize: "44px", fontWeight: 900, marginBottom: "8px" }}>{job.price}</div>
            <p style={{ color: "#9fb0c1", marginBottom: "24px", fontSize: "14px" }}>Estimated: {job.duration}</p>
            <button style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#1ea7ff,#0077ff)", color: "white", fontWeight: 700, fontSize: "16px", cursor: "pointer" }}>
              Accept Job
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
