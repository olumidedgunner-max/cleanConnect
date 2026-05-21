import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ padding: "60px 30px 40px", background: "#050c17", color: "#90a3b6" }}>
      <div style={{ maxWidth: "1100px", margin: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px", marginBottom: "50px" }}>
          {/* Brand */}
          <div>
            <div style={{ fontSize: "28px", fontWeight: 800, marginBottom: "16px", color: "white" }}>
              Clean<span style={{ color: "#57c7ff" }}>Connect</span>
            </div>
            <p style={{ lineHeight: 1.7, fontSize: "14px", maxWidth: "280px" }}>
              AI-powered cleaning marketplace. Every job verified, priced fairly, and protected by escrow.
            </p>
          </div>

          {/* Platform */}
          <div>
            <div style={{ color: "white", fontWeight: 700, marginBottom: "16px", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>Platform</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <a href="/#post-job" style={{ color: "#90a3b6", textDecoration: "none", fontSize: "14px" }}>Post a Job</a>
              <Link href="/register-cleaner" style={{ color: "#90a3b6", textDecoration: "none", fontSize: "14px" }}>Become a Cleaner</Link>
              <Link href="/register-business" style={{ color: "#90a3b6", textDecoration: "none", fontSize: "14px" }}>Business Account</Link>
              <Link href="/dashboard" style={{ color: "#90a3b6", textDecoration: "none", fontSize: "14px" }}>Dashboard</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <div style={{ color: "white", fontWeight: 700, marginBottom: "16px", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>Legal</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Link href="/privacy" style={{ color: "#90a3b6", textDecoration: "none", fontSize: "14px" }}>Privacy Policy</Link>
              <Link href="/terms" style={{ color: "#90a3b6", textDecoration: "none", fontSize: "14px" }}>Terms of Service</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <div style={{ color: "white", fontWeight: 700, marginBottom: "16px", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>Support</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <a href="mailto:olumidedgunner@gmail.com" style={{ color: "#90a3b6", textDecoration: "none", fontSize: "14px" }}>Contact Us</a>
              <Link href="/support" style={{ color: "#90a3b6", textDecoration: "none", fontSize: "14px" }}>Help Centre</Link>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <p style={{ fontSize: "13px" }}>© 2026 CleanConnect · Privacy First · AI Assisted · Escrow Protected</p>
          <a href="mailto:olumidedgunner@gmail.com" style={{ color: "#57c7ff", textDecoration: "none", fontSize: "13px", fontWeight: 700 }}>
            olumidedgunner@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
