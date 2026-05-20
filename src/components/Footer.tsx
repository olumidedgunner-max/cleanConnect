export default function Footer() {
  return (
    <footer style={{ padding: "45px", textAlign: "center", background: "#050c17", color: "#90a3b6", marginTop: "0" }}>
      <div style={{ fontSize: "28px", fontWeight: 800, marginBottom: "15px" }}>
        Clean<span style={{ color: "#57c7ff" }}>Connect</span>
      </div>
      <p style={{ marginBottom: "20px", lineHeight: 1.7, maxWidth: "600px", margin: "0 auto 20px" }}>
        AI-powered cleaning marketplace. Privacy protected. Escrow secured. Every job verified.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap", marginBottom: "30px", fontSize: "14px" }}>
        <span style={{ cursor: "pointer" }}>Privacy Policy</span>
        <span style={{ cursor: "pointer" }}>Terms of Service</span>
        <span style={{ cursor: "pointer" }}>Contact Us</span>
        <span style={{ cursor: "pointer" }}>Support</span>
      </div>
      <p style={{ fontSize: "13px", opacity: 0.6 }}>© 2026 CleanConnect • Privacy First • AI Assisted • Escrow Protected</p>
    </footer>
  );
}
