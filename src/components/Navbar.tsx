export default function Navbar() {
  return (
    <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 0" }}>
      <div style={{ fontSize: "34px", fontWeight: 800, letterSpacing: "-1px" }}>
        Clean<span style={{ color: "#57c7ff" }}>Connect</span>
      </div>
      <ul style={{ display: "flex", gap: "25px", listStyle: "none", alignItems: "center" }}>
        <li style={{ opacity: 0.85, cursor: "pointer" }}>Home</li>
        <li style={{ opacity: 0.85, cursor: "pointer" }}>Dashboard</li>
        <li style={{ opacity: 0.85, cursor: "pointer" }}>Current Jobs</li>
        <li style={{ opacity: 0.85, cursor: "pointer" }}>Escrow</li>
        <li style={{
          background: "linear-gradient(135deg,#1ea7ff,#0077ff)",
          padding: "10px 20px",
          borderRadius: "12px",
          fontWeight: 700,
          cursor: "pointer",
          fontSize: "14px",
        }}>
          Post a Job
        </li>
        <li style={{
          background: "rgba(255,255,255,.08)",
          border: "1px solid rgba(255,255,255,.1)",
          padding: "10px 20px",
          borderRadius: "12px",
          fontWeight: 700,
          cursor: "pointer",
          fontSize: "14px",
        }}>
          Become a Cleaner
        </li>
      </ul>
    </nav>
  );
}
