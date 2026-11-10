import Link from "next/link";

export const metadata = { title: "Register as Business — CleanConnect" };

export default function RegisterBusinessPage() {
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
        <div style={{ display: "inline-block", padding: "8px 16px", background: "rgba(245,158,11,.15)", border: "1px solid rgba(245,158,11,.3)", borderRadius: "999px", color: "#f59e0b", fontSize: "13px", fontWeight: 700, marginBottom: "20px" }}>
          Business Account
        </div>
        <h1 style={{ fontSize: "42px", fontWeight: 900, marginBottom: "14px" }}>Register as a Business</h1>
        <p style={{ color: "#9fb0c1", fontSize: "16px", lineHeight: 1.7, marginBottom: "50px", maxWidth: "600px" }}>
          Whether your company needs cleaning services or provides them — pick your path below.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>

          {/* Path 1 — Post a job as a business */}
          <Link href="/post-job" style={{ textDecoration: "none" }}>
            <div style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", border: "2px solid rgba(30,167,255,.25)", borderRadius: "24px", padding: "44px 34px", cursor: "pointer", color: "white", height: "100%", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "52px", marginBottom: "22px" }}>🏢</div>
              <h2 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "12px" }}>We Need Cleaning</h2>
              <p style={{ color: "#9fb0c1", lineHeight: 1.7, fontSize: "15px", flex: 1 }}>
                Post a cleaning job for your office, retail space, Airbnb, or commercial property. AI prices each room and connects you with verified cleaners nearby.
              </p>
              <div style={{ marginTop: "28px", padding: "14px 28px", borderRadius: "12px", background: "linear-gradient(135deg,#1ea7ff,#0077ff)", display: "inline-block", fontWeight: 700, fontSize: "14px", textAlign: "center" }}>
                Post a Job →
              </div>
            </div>
          </Link>

          {/* Path 2 — Register as cleaning company */}
          <Link href="/register-cleaner?type=company" style={{ textDecoration: "none" }}>
            <div style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", border: "2px solid rgba(245,158,11,.25)", borderRadius: "24px", padding: "44px 34px", cursor: "pointer", color: "white", height: "100%", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "52px", marginBottom: "22px" }}>🧹</div>
              <h2 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "12px" }}>We Offer Cleaning</h2>
              <p style={{ color: "#9fb0c1", lineHeight: 1.7, fontSize: "15px", flex: 1 }}>
                Register your cleaning company. Get matched with clients in your area, set your rates, and manage jobs through the platform.
              </p>
              <div style={{ marginTop: "28px", padding: "10px 16px", borderRadius: "10px", background: "rgba(245,158,11,.12)", border: "1px solid rgba(245,158,11,.3)", fontSize: "13px", color: "#f59e0b", fontWeight: 700, marginBottom: "12px", display: "inline-block" }}>
                One-off fee: £179 (non-refundable)
              </div>
              <div style={{ padding: "14px 28px", borderRadius: "12px", background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "inline-block", fontWeight: 700, fontSize: "14px", textAlign: "center" }}>
                Register as Company →
              </div>
            </div>
          </Link>

        </div>
      </div>
    </main>
  );
}
