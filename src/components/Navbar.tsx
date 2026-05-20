import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 0" }}>
      <Link href="/" style={{ fontSize: "34px", fontWeight: 800, letterSpacing: "-1px", textDecoration: "none", color: "white" }}>
        Clean<span style={{ color: "#57c7ff" }}>Connect</span>
      </Link>
      <ul style={{ display: "flex", gap: "20px", listStyle: "none", alignItems: "center" }}>
        <li><Link href="/" style={{ color: "white", textDecoration: "none", opacity: 0.85, fontSize: "15px" }}>Home</Link></li>
        <li><Link href="/#jobs" style={{ color: "white", textDecoration: "none", opacity: 0.85, fontSize: "15px" }}>Current Jobs</Link></li>
        <li>
          <Link href="/register-cleaner" style={{
            display: "block",
            background: "linear-gradient(135deg,#22c55e,#16a34a)",
            padding: "10px 20px",
            borderRadius: "12px",
            fontWeight: 700,
            textDecoration: "none",
            color: "white",
            fontSize: "14px",
          }}>
            Register as Cleaner
          </Link>
        </li>
        <li>
          <Link href="/register-business" style={{
            display: "block",
            background: "linear-gradient(135deg,#f59e0b,#d97706)",
            padding: "10px 20px",
            borderRadius: "12px",
            fontWeight: 700,
            textDecoration: "none",
            color: "white",
            fontSize: "14px",
          }}>
            Register Business
          </Link>
        </li>
      </ul>
    </nav>
  );
}
