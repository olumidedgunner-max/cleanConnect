"use client";
import { useState } from "react";
import Link from "next/link";
import { useCleanConnect } from "@/context/CleanConnectContext";
import { SAMPLE_CLEANERS, SampleCleaner } from "@/lib/sampleCleaners";
import { Cleaner } from "@/context/CleanConnectContext";

type DisplayCleaner = {
  id: string;
  name: string;
  type: "individual" | "company";
  city: string;
  postcode: string;
  rate: number;
  radius: number;
  bio: string;
  rating?: number;
  jobsCompleted?: number;
  live?: boolean;
};

function CleanerCard({ c }: { c: DisplayCleaner }) {
  const isCompany = c.type === "company";
  return (
    <div style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "24px", padding: "28px", border: `1px solid rgba(${isCompany ? "245,158,11" : "34,197,94"},.15)`, display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: `linear-gradient(135deg,${isCompany ? "#f59e0b,#d97706" : "#22c55e,#16a34a"})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "20px", flexShrink: 0 }}>
            {c.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "18px" }}>{c.name}</div>
            <div style={{ color: "#9fb0c1", fontSize: "13px" }}>{c.city} · {c.postcode}</div>
          </div>
        </div>
        <span style={{ padding: "6px 14px", borderRadius: "999px", background: `rgba(${isCompany ? "245,158,11" : "34,197,94"},.15)`, color: isCompany ? "#f59e0b" : "#22c55e", fontSize: "12px", fontWeight: 700, whiteSpace: "nowrap" }}>
          {isCompany ? "🏢 Company" : "🧑 Individual"}
        </span>
      </div>

      {c.bio && <p style={{ color: "#9fb0c1", fontSize: "14px", lineHeight: 1.7 }}>{c.bio}</p>}

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", fontSize: "14px" }}>
        <div style={{ background: "rgba(87,199,255,.08)", borderRadius: "10px", padding: "10px 16px" }}>
          <div style={{ color: "#9fb0c1", fontSize: "12px", marginBottom: "2px" }}>Base Rate</div>
          <div style={{ fontWeight: 900, color: "#57c7ff", fontSize: "18px" }}>£{c.rate}/hr</div>
        </div>
        <div style={{ background: "rgba(255,255,255,.04)", borderRadius: "10px", padding: "10px 16px" }}>
          <div style={{ color: "#9fb0c1", fontSize: "12px", marginBottom: "2px" }}>Radius</div>
          <div style={{ fontWeight: 700, fontSize: "16px" }}>{c.radius} miles</div>
        </div>
        {c.rating && (
          <div style={{ background: "rgba(255,255,255,.04)", borderRadius: "10px", padding: "10px 16px" }}>
            <div style={{ color: "#9fb0c1", fontSize: "12px", marginBottom: "2px" }}>Rating</div>
            <div style={{ fontWeight: 700, fontSize: "16px", color: "#fbbf24" }}>★ {c.rating}</div>
          </div>
        )}
        {c.jobsCompleted !== undefined && (
          <div style={{ background: "rgba(255,255,255,.04)", borderRadius: "10px", padding: "10px 16px" }}>
            <div style={{ color: "#9fb0c1", fontSize: "12px", marginBottom: "2px" }}>Jobs Done</div>
            <div style={{ fontWeight: 700, fontSize: "16px" }}>{c.jobsCompleted}</div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
        <Link href={`/cleaners/${c.id}`} style={{ flex: 1, padding: "14px", borderRadius: "12px", background: "linear-gradient(135deg,#1ea7ff,#0077ff)", color: "white", textDecoration: "none", fontWeight: 700, fontSize: "15px", textAlign: "center" }}>
          View & Offer a Job
        </Link>
        {c.live && <span style={{ padding: "14px 16px", borderRadius: "12px", background: "rgba(30,167,255,.1)", border: "1px solid rgba(30,167,255,.2)", color: "#57c7ff", fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center" }}>LIVE</span>}
      </div>
    </div>
  );
}

export default function CleanersPage() {
  const { cleaners } = useCleanConnect();
  const [cityFilter, setCityFilter] = useState("");

  const liveCleaners: DisplayCleaner[] = cleaners.map((c: Cleaner) => ({
    id: c.id,
    name: c.name,
    type: c.type || "individual",
    city: c.city,
    postcode: c.postcode,
    rate: c.rate || 25,
    radius: c.radius || 20,
    bio: c.bio,
    live: true,
  }));

  const sampleDisplay: DisplayCleaner[] = SAMPLE_CLEANERS.map((c: SampleCleaner) => ({
    id: c.id,
    name: c.name,
    type: c.type,
    city: c.city,
    postcode: c.postcode,
    rate: c.rate,
    radius: c.radius,
    bio: c.bio,
    rating: c.rating,
    jobsCompleted: c.jobsCompleted,
  }));

  const all = [...liveCleaners, ...sampleDisplay];
  const filtered = cityFilter ? all.filter((c) => c.city.toLowerCase().includes(cityFilter.toLowerCase()) || c.postcode.toLowerCase().includes(cityFilter.toLowerCase())) : all;

  return (
    <main style={{ background: "#07111f", minHeight: "100vh", color: "white" }}>
      <div style={{ padding: "24px 30px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ maxWidth: "1100px", margin: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ fontSize: "28px", fontWeight: 800, textDecoration: "none", color: "white" }}>Clean<span style={{ color: "#57c7ff" }}>Connect</span></Link>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <Link href="/post-job" style={{ color: "#57c7ff", textDecoration: "none", fontSize: "14px", fontWeight: 700 }}>Post a Job</Link>
            <Link href="/" style={{ color: "#9fb0c1", textDecoration: "none", fontSize: "14px" }}>← Home</Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "auto", padding: "50px 30px" }}>
        <h1 style={{ fontSize: "46px", fontWeight: 900, marginBottom: "12px" }}>Cleaners in Your Area</h1>
        <p style={{ color: "#9fb0c1", fontSize: "18px", lineHeight: 1.7, marginBottom: "40px", maxWidth: "600px" }}>
          Browse individual cleaners and companies near you. Click any cleaner to view their profile and make a job offer — negotiate up to 20% off their listed rate.
        </p>

        {/* Filter */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "40px", flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            placeholder="Filter by city or postcode..."
            style={{ flex: 1, minWidth: "250px", maxWidth: "400px", padding: "14px 20px", borderRadius: "14px", border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.05)", color: "white", fontSize: "16px", outline: "none" }}
          />
          <div style={{ color: "#9fb0c1", fontSize: "14px" }}>{filtered.length} cleaner{filtered.length !== 1 ? "s" : ""} found</div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#9fb0c1" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <p>No cleaners found in that area. <Link href="/register-cleaner" style={{ color: "#57c7ff" }}>Be the first to register!</Link></p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
            {filtered.map((c) => <CleanerCard key={c.id} c={c} />)}
          </div>
        )}
      </div>
    </main>
  );
}
