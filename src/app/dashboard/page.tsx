"use client";
import Link from "next/link";
import { useCleanConnect } from "@/context/CleanConnectContext";
import { SAMPLE_JOBS } from "@/lib/sampleJobs";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    awaiting: { label: "Awaiting Cleaner", bg: "rgba(245,158,11,.15)", color: "#f59e0b" },
    accepted: { label: "Cleaner Accepted", bg: "rgba(30,167,255,.15)", color: "#57c7ff" },
    completed: { label: "Completed", bg: "rgba(34,197,94,.15)", color: "#22c55e" },
  };
  const s = map[status] || map.awaiting;
  return (
    <span style={{ padding: "6px 14px", borderRadius: "999px", background: s.bg, color: s.color, fontSize: "12px", fontWeight: 700 }}>
      {s.label}
    </span>
  );
}

export default function DashboardPage() {
  const { jobs, cleaners, businesses } = useCleanConnect();

  const allJobs = [
    ...jobs.map((j) => ({
      id: j.id,
      title: j.rooms.map((r) => `${r.count} ${r.type}`).join(", "),
      city: j.city,
      postcode: j.postcode,
      total: j.total,
      rooms: j.totalRooms,
      status: j.status,
      postedAt: j.postedAt,
      live: true,
    })),
    ...SAMPLE_JOBS.map((j) => ({
      id: j.id,
      title: j.title,
      city: j.city,
      postcode: j.postcode,
      total: j.total,
      rooms: j.rooms.length,
      status: j.status,
      postedAt: j.postedAt,
      live: false,
    })),
  ];

  return (
    <main style={{ background: "#07111f", minHeight: "100vh", color: "white" }}>
      {/* Top bar */}
      <div style={{ padding: "24px 30px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ maxWidth: "1100px", margin: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ fontSize: "28px", fontWeight: 800, textDecoration: "none", color: "white" }}>
            Clean<span style={{ color: "#57c7ff" }}>Connect</span>
          </Link>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <Link href="/" style={{ color: "#9fb0c1", textDecoration: "none", fontSize: "14px" }}>← Home</Link>
            <a href="/#post-job" style={{ padding: "10px 20px", borderRadius: "12px", background: "linear-gradient(135deg,#1ea7ff,#0077ff)", color: "white", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>
              + Post a Job
            </a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "auto", padding: "50px 30px" }}>
        <h1 style={{ fontSize: "42px", fontWeight: 900, marginBottom: "10px" }}>Dashboard</h1>
        <p style={{ color: "#9fb0c1", fontSize: "16px", marginBottom: "50px" }}>Overview of all jobs, cleaners, and businesses on CleanConnect.</p>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "50px" }}>
          {[
            { label: "Total Jobs", value: allJobs.length, color: "#57c7ff" },
            { label: "Live Jobs Posted", value: jobs.length, color: "#1ea7ff" },
            { label: "Cleaners Registered", value: cleaners.length, color: "#22c55e" },
            { label: "Businesses Registered", value: businesses.length, color: "#f59e0b" },
          ].map((s) => (
            <div key={s.label} style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "20px", padding: "26px", border: "1px solid rgba(255,255,255,.06)" }}>
              <div style={{ fontSize: "40px", fontWeight: 900, color: s.color, marginBottom: "8px" }}>{s.value}</div>
              <div style={{ color: "#9fb0c1", fontSize: "14px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Jobs table */}
        <div style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "26px", padding: "32px", border: "1px solid rgba(255,255,255,.06)", marginBottom: "36px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 800 }}>All Jobs</h2>
            <span style={{ color: "#9fb0c1", fontSize: "14px" }}>{allJobs.length} total</span>
          </div>
          {allJobs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#9fb0c1" }}>No jobs yet. <a href="/#post-job" style={{ color: "#57c7ff" }}>Post the first one.</a></div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                  {["Job", "Location", "Rooms", "Total", "Status", ""].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#9fb0c1", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allJobs.map((j) => (
                  <tr key={j.id} style={{ borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                    <td style={{ padding: "16px", fontWeight: 700 }}>
                      {j.title}
                      {j.live && <span style={{ marginLeft: "8px", padding: "3px 8px", borderRadius: "6px", background: "rgba(30,167,255,.15)", color: "#57c7ff", fontSize: "11px", fontWeight: 700 }}>LIVE</span>}
                    </td>
                    <td style={{ padding: "16px", color: "#9fb0c1", fontSize: "14px" }}>{j.city}, {j.postcode}</td>
                    <td style={{ padding: "16px", color: "#c5d0dc" }}>{j.rooms} room{j.rooms > 1 ? "s" : ""}</td>
                    <td style={{ padding: "16px", fontWeight: 800, color: "#57c7ff" }}>£{j.total.toFixed ? j.total.toFixed(2) : j.total}</td>
                    <td style={{ padding: "16px" }}><StatusBadge status={j.status} /></td>
                    <td style={{ padding: "16px" }}>
                      <Link href={`/jobs/${j.id}`} style={{ color: "#57c7ff", textDecoration: "none", fontSize: "13px", fontWeight: 700 }}>View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Cleaners + Businesses side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
          {/* Cleaners */}
          <div style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "26px", padding: "32px", border: "1px solid rgba(255,255,255,.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800 }}>Registered Cleaners</h2>
              <Link href="/register-cleaner" style={{ color: "#22c55e", textDecoration: "none", fontSize: "13px", fontWeight: 700 }}>+ Add</Link>
            </div>
            {cleaners.length === 0 ? (
              <p style={{ color: "#9fb0c1", textAlign: "center", padding: "20px 0" }}>No cleaners yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {cleaners.map((c) => (
                  <div key={c.id} style={{ display: "flex", gap: "14px", alignItems: "center", padding: "14px", background: "rgba(255,255,255,.03)", borderRadius: "14px" }}>
                    <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "16px", flexShrink: 0 }}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "15px" }}>{c.name}</div>
                      <div style={{ color: "#9fb0c1", fontSize: "13px" }}>{c.city} · {c.postcode.toUpperCase()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Businesses */}
          <div style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "26px", padding: "32px", border: "1px solid rgba(255,255,255,.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800 }}>Registered Businesses</h2>
              <Link href="/register-business" style={{ color: "#f59e0b", textDecoration: "none", fontSize: "13px", fontWeight: 700 }}>+ Add</Link>
            </div>
            {businesses.length === 0 ? (
              <p style={{ color: "#9fb0c1", textAlign: "center", padding: "20px 0" }}>No businesses yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {businesses.map((b) => (
                  <div key={b.id} style={{ padding: "14px", background: "rgba(255,255,255,.03)", borderRadius: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <div style={{ fontWeight: 700, fontSize: "15px" }}>{b.companyName}</div>
                      <span style={{ padding: "3px 8px", borderRadius: "6px", background: "rgba(245,158,11,.15)", color: "#f59e0b", fontSize: "11px", fontWeight: 700 }}>B2B</span>
                    </div>
                    <div style={{ color: "#9fb0c1", fontSize: "13px" }}>{b.city} · {b.postcode.toUpperCase()} · {b.serviceType || "General"}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
