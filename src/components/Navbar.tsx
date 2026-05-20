export default function Navbar() {
  return (
    <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 0" }}>
      <div style={{ fontSize: "34px", fontWeight: 800, letterSpacing: "-1px" }}>
        Clean<span style={{ color: "#57c7ff" }}>Connect</span>
      </div>
      <ul style={{ display: "flex", gap: "25px", listStyle: "none", alignItems: "center" }}>
        <li style={{ opacity: 0.85, cursor: "pointer" }}>Home</li>
        <li style={{ opacity: 0.85, cursor: "pointer" }}>How It Works</li>
        <li style={{
          background: "linear-gradient(135deg,#ff9500,#ff6b00)",
          padding: "6px 14px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 700,
          cursor: "pointer",
        }}>
          Go Premium
        </li>
        <li style={{ opacity: 0.85, cursor: "pointer" }}>Sign In</li>
      </ul>
    </nav>
  );
}
