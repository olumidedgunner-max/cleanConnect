"use client";
import Link from "next/link";
import { useCleanConnect } from "@/context/CleanConnectContext";

const SAMPLE_JOBS = [
  { id: "s1", title: "3-Bed House Clean", detail: "3 bedrooms · 1 kitchen · 1 living room · 2 toilets", condition: "AI: Moderate dirt", conditionColor: "#f59e0b", badge: "Awaiting Cleaner", badgeColor: "#f59e0b", price: "£140", duration: "7 hours", city: "London", postcode: "SE1 7PB", verified: true },
  { id: "s2", title: "Airbnb Turnover", detail: "1 bedroom · 1 kitchen · 1 living room · 1 toilet", condition: "AI: Medium dirt", conditionColor: "#3b82f6", badge: "Escrow Secured", badgeColor: "#1ea7ff", price: "£100", duration: "4 hours", city: "Manchester", postcode: "M1 1AE", verified: true },
  { id: "s3", title: "Student Flat Clean", detail: "2 bedrooms · 1 kitchen · 1 toilet", condition: "No photo — heavy rate applied", conditionColor: "#ef4444", badge: "Unverified Condition", badgeColor: "#ef4444", price: "£120", duration: "4 hours", city: "Birmingham", postcode: "B1 1BB", verified: false },
];

export default function JobListings() {
  const { jobs } = useCleanConnect();

  const liveJobs = jobs.map((j) => ({
    id: j.id,
    title: j.rooms.map((r) => `${r.count} ${r.type}`).join(" · "),
    detail: j.rooms.map((r) => `${r.count} ${r.type}${r.count > 1 ? "s" : ""}`).join(" · "),
    condition: Object.values(j.conditions).every((c) => c === "none") ? "No photo — heavy rate applied" : "AI: Mixed condition",
    conditionColor: Object.values(j.conditions).every((c) => c === "none") ? "#ef4444" : "#f59e0b",
    badge: "Awaiting Cleaner",
    badgeColor: "#f59e0b",
    price: `£${j.total.toFixed(2)}`,
    duration: `${j.totalRooms} hour${j.totalRooms > 1 ? "s" : ""}`,
    city: j.city,
    postcode: j.postcode,
    verified: Object.values(j.conditions).some((c) => c !== "none"),
  }));

  const allJobs = [...liveJobs, ...SAMPLE_JOBS];

  return (
    <section style={{ padding: "90px 30px", maxWidth: "1100px", margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "55px", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h2 style={{ fontSize: "46px", fontWeight: 900, marginBottom: "12px" }}>Current Jobs Awaiting Cleaners</h2>
          <p style={{ color: "#9fb0c1", fontSize: "18px", lineHeight: 1.7, maxWidth: "600px" }}>
            Verified clients post jobs with room photos. AI estimates the clean level so you know exactly what to expect.
          </p>
        </div>
        {liveJobs.length > 0 && (
          <div style={{ background: "rgba(30,167,255,.15)", border: "1px solid rgba(30,167,255,.3)", borderRadius: "12px", padding: "10px 20px", color: "#57c7ff", fontWeight: 700, fontSize: "14px" }}>
            {liveJobs.length} live job{liveJobs.length > 1 ? "s" : ""} posted
          </div>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
        {allJobs.map((job) => {
          const r = job.badgeColor === "#f59e0b" ? "245,158,11" : job.badgeColor === "#1ea7ff" ? "30,167,255" : "239,68,68";
          return (
            <div key={job.id} style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "26px", padding: "28px", border: "1px solid rgba(255,255,255,.06)", boxShadow: "0 18px 45px rgba(0,0,0,.28)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div style={{ display: "inline-block", padding: "8px 14px", background: `rgba(${r},.15)`, border: `1px solid rgba(${r},.3)`, borderRadius: "999px", color: job.badgeColor, fontSize: "13px", fontWeight: 700 }}>{job.badge}</div>
                <div style={{ color: "#9fb0c1", fontSize: "12px", textAlign: "right" }}>
                  <div style={{ fontWeight: 700, color: "white" }}>{job.city}</div>
                  <div>{job.postcode}</div>
                </div>
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "8px" }}>{job.title}</h3>
              <p style={{ color: "#9fb0c1", fontSize: "13px", marginBottom: "10px" }}>{job.detail}</p>
              <div style={{ color: job.conditionColor, fontSize: "13px", fontWeight: 700, marginBottom: "16px" }}>
                {job.verified ? "📷 " : "⚠️ "}{job.condition}
              </div>
              <div style={{ fontSize: "40px", fontWeight: 900, marginBottom: "6px" }}>{job.price}</div>
              <p style={{ color: "#9fb0c1", marginBottom: "22px", fontSize: "13px" }}>Est: {job.duration}</p>
              <Link href={`/jobs/${job.id}`} style={{ display: "block", width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#1ea7ff,#0077ff)", color: "white", fontWeight: 700, fontSize: "15px", cursor: "pointer", textDecoration: "none", textAlign: "center", boxSizing: "border-box" }}>
                View &amp; Accept Job
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
