import Link from "next/link";

export const metadata = { title: "Register as Individual — CleanConnect" };

export default function RegisterIndividualPage() {
  return (
    <main style={{ background: "#07111f", minHeight: "100vh", color: "white" }}>
      <div style={{ padding: "24px 30px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ maxWidth: "900px", margin: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ fontSize: "28px", fontWeight: 800, textDecoration: "none", color: "white" }}>
            Clean<span style={{ color: "#57c7ff" }}>Connect</span>
          </Link>
          <Link href="/" style={{ color: "#9fb0c1", textDecoration: "none", fontSize: "14px" }}>← Back to Home</Link>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "auto", padding: "70px 30px" }}>
        <div style={{ display: "inline-block", padding: "8px 16px", background: "rgba(34,197,94,.15)", border: "1px solid rgba(34,197,94,.3)", borderRadius: "999px", color: "#22c55e", fontSize: "13px", fontWeight: 700, marginBottom: "20px" }}>
          Individual Account
        </div>
        <h1 style={{ fontSize: "42px", fontWeight: 900, marginBottom: "14px" }}>Register as an Individual</h1>
        <p style={{ color: "#9fb0c1", fontSize: "16px", lineHeight: 1.7, marginBottom: "50px", maxWidth: "600px" }}>
          Whether you need a clean or want to earn money cleaning — pick your path below.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>

          {/* Path 1 — Post a job */}
          <Link href="/post-job" style={{ textDecoration: "none" }}>
            <div style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", border: "2px solid rgba(30,167,255,.25)", borderRadius: "24px", padding: "44px 34px", cursor: "pointer", color: "white", height: "100%", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "52px", marginBottom: "22px" }}>🏠</div>
              <h2 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "12px" }}>I Need Cleaning</h2>
              <p style={{ color: "#9fb0c1", lineHeight: 1.7, fontSize: "15px", flex: 1 }}>
                Post a cleaning job for your home. Upload room photos, get an AI-generated price, and connect with a verified cleaner near you.
              </p>
              <div style={{ marginTop: "28px", padding: "14px 28px", borderRadius: "12px", background: "linear-gradient(135deg,#1ea7ff,#0077ff)", display: "inline-block", fontWeight: 700, fontSize: "14px", textAlign: "center" }}>
                Post a Job →
              </div>
            </div>
          </Link>

          {/* Path 2 — Register as individual cleaner */}
          <Link href="/register-cleaner?type=individual" style={{ textDecoration: "none" }}>
            <div style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", border: "2px solid rgba(34,197,94,.25)", borderRadius: "24px", padding: "44px 34px", cursor: "pointer", color: "white", height: "100%", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "52px", marginBottom: "22px" }}>🧑</div>
              <h2 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "12px" }}>I Want to Clean</h2>
              <p style={{ color: "#9fb0c1", lineHeight: 1.7, fontSize: "15px", flex: 1 }}>
                Register as an individual cleaner. Set your rate, your area, and start receiving job requests from people near you.
              </p>
              <div style={{ marginTop: "28px", padding: "10px 16px", borderRadius: "10px", background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.3)", fontSize: "13px", color: "#22c55e", fontWeight: 700, marginBottom: "12px", display: "inline-block" }}>
                One-off fee: £99 (non-refundable)
              </div>
              <div style={{ padding: "14px 28px", borderRadius: "12px", background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "inline-block", fontWeight: 700, fontSize: "14px", textAlign: "center" }}>
                Register as Cleaner →
              </div>
            </div>
          </Link>

        </div>
      </div>
    </main>
  );
}
