"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useCleanConnect } from "@/context/CleanConnectContext";
import { SAMPLE_CLEANERS } from "@/lib/sampleCleaners";

const DISCOUNTS = [
  { pct: 0, label: "No discount — full rate" },
  { pct: 5, label: "5% off" },
  { pct: 10, label: "10% off" },
  { pct: 15, label: "15% off" },
  { pct: 20, label: "20% off (maximum)" },
];

const inputStyle = { width: "100%", padding: "14px 18px", borderRadius: "12px", border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.05)", color: "white", fontSize: "16px", outline: "none" };
const labelStyle = { display: "block" as const, color: "#9fb0c1", fontSize: "13px", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase" as const, letterSpacing: "1px" };

export default function CleanerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { cleaners } = useCleanConnect();

  const liveMatch = cleaners.find((c) => c.id === id);
  const sampleMatch = SAMPLE_CLEANERS.find((c) => c.id === id);

  if (!liveMatch && !sampleMatch) {
    return (
      <main style={{ background: "#07111f", minHeight: "100vh", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "60px", marginBottom: "20px" }}>🔍</div>
          <h2 style={{ fontSize: "28px", fontWeight: 900, marginBottom: "12px" }}>Cleaner Not Found</h2>
          <Link href="/cleaners" style={{ color: "#57c7ff", textDecoration: "none", fontWeight: 700 }}>← Back to cleaners</Link>
        </div>
      </main>
    );
  }

  const cleaner = liveMatch
    ? { id: liveMatch.id, name: liveMatch.name, type: liveMatch.type || "individual", city: liveMatch.city, postcode: liveMatch.postcode, rate: liveMatch.rate || 25, radius: liveMatch.radius || 20, bio: liveMatch.bio, rating: undefined, jobsCompleted: undefined }
    : { id: sampleMatch!.id, name: sampleMatch!.name, type: sampleMatch!.type, city: sampleMatch!.city, postcode: sampleMatch!.postcode, rate: sampleMatch!.rate, radius: sampleMatch!.radius, bio: sampleMatch!.bio, rating: sampleMatch!.rating, jobsCompleted: sampleMatch!.jobsCompleted };

  const isCompany = cleaner.type === "company";

  const [discount, setDiscount] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [postcode, setPostcode] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const offeredRate = Math.round(cleaner.rate * (1 - discount / 100) * 100) / 100;
  const jobTotal = Math.round(offeredRate * rooms * 100) / 100;
  const platformFee = Math.round(jobTotal * 0.05 * 100) / 100;
  const clientPays = Math.round((jobTotal + platformFee) * 100) / 100;
  const cleanerReceives = Math.round(jobTotal * (1 - 0.075) * 100) / 100;

  function handleSend() {
    if (!name || !email || !phone || !postcode || !city) return;
    setSent(true);
  }

  return (
    <main style={{ background: "#07111f", minHeight: "100vh", color: "white" }}>
      <div style={{ padding: "24px 30px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ maxWidth: "1000px", margin: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ fontSize: "28px", fontWeight: 800, textDecoration: "none", color: "white" }}>Clean<span style={{ color: "#57c7ff" }}>Connect</span></Link>
          <Link href="/cleaners" style={{ color: "#9fb0c1", textDecoration: "none", fontSize: "14px" }}>← Back to cleaners</Link>
        </div>
      </div>

      <div style={{ maxWidth: "1000px", margin: "auto", padding: "50px 30px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "36px", alignItems: "start" }}>

          {/* Cleaner profile */}
          <div>
            <div style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "26px", padding: "36px", border: `1px solid rgba(${isCompany ? "245,158,11" : "34,197,94"},.2)`, marginBottom: "24px" }}>
              <div style={{ display: "flex", gap: "18px", alignItems: "center", marginBottom: "24px" }}>
                <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: `linear-gradient(135deg,${isCompany ? "#f59e0b,#d97706" : "#22c55e,#16a34a"})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "28px", flexShrink: 0 }}>
                  {cleaner.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: "24px" }}>{cleaner.name}</div>
                  <div style={{ color: "#9fb0c1", fontSize: "14px", marginTop: "4px" }}>{cleaner.city} · {cleaner.postcode}</div>
                  <span style={{ marginTop: "8px", display: "inline-block", padding: "4px 12px", borderRadius: "999px", background: `rgba(${isCompany ? "245,158,11" : "34,197,94"},.15)`, color: isCompany ? "#f59e0b" : "#22c55e", fontSize: "12px", fontWeight: 700 }}>
                    {isCompany ? "🏢 Company" : "🧑 Individual"}
                  </span>
                </div>
              </div>

              {cleaner.bio && <p style={{ color: "#c5d0dc", lineHeight: 1.8, marginBottom: "24px", fontSize: "15px" }}>{cleaner.bio}</p>}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                {[
                  { label: "Base Rate", value: `£${cleaner.rate}/hr`, color: "#57c7ff" },
                  { label: "Coverage", value: `${cleaner.radius} miles`, color: "white" },
                  cleaner.rating ? { label: "Rating", value: `★ ${cleaner.rating}`, color: "#fbbf24" } : null,
                  cleaner.jobsCompleted !== undefined ? { label: "Jobs Done", value: `${cleaner.jobsCompleted}`, color: "white" } : null,
                ].filter(Boolean).map((s) => s && (
                  <div key={s.label} style={{ background: "rgba(255,255,255,.04)", borderRadius: "12px", padding: "14px 18px" }}>
                    <div style={{ color: "#9fb0c1", fontSize: "12px", marginBottom: "4px" }}>{s.label}</div>
                    <div style={{ fontWeight: 800, fontSize: "20px", color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Negotiation info */}
            <div style={{ background: "rgba(30,167,255,.06)", border: "1px solid rgba(30,167,255,.15)", borderRadius: "18px", padding: "20px 24px" }}>
              <div style={{ fontWeight: 800, marginBottom: "8px" }}>💬 Negotiation Allowed</div>
              <p style={{ color: "#9fb0c1", fontSize: "14px", lineHeight: 1.7 }}>
                You can offer up to <strong style={{ color: "#57c7ff" }}>20% below</strong> this cleaner&apos;s listed rate.
                Both parties will receive an email to confirm the negotiated price before any payment is taken.
              </p>
            </div>
          </div>

          {/* Offer form */}
          <div style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "26px", padding: "36px", border: "1px solid rgba(255,255,255,.06)" }}>
            {!sent ? (
              <>
                <h2 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "24px" }}>Make a Job Offer</h2>

                {/* Discount picker */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={labelStyle}>Your Offered Rate</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {DISCOUNTS.map((d) => (
                      <button key={d.pct} onClick={() => setDiscount(d.pct)} style={{ padding: "14px 18px", borderRadius: "12px", border: `2px solid ${discount === d.pct ? "#57c7ff" : "rgba(255,255,255,.08)"}`, background: discount === d.pct ? "rgba(87,199,255,.1)" : "rgba(255,255,255,.03)", color: "white", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: discount === d.pct ? 700 : 400 }}>
                        <span>{d.label}</span>
                        <span style={{ color: "#57c7ff", fontWeight: 900 }}>£{Math.round(cleaner.rate * (1 - d.pct / 100) * 100) / 100}/hr</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rooms */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={labelStyle}>Number of Rooms</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <button onClick={() => setRooms(Math.max(1, rooms - 1))} style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1px solid rgba(255,255,255,.15)", background: "rgba(255,255,255,.06)", color: "white", fontSize: "20px", cursor: "pointer", fontWeight: 700 }}>−</button>
                    <span style={{ fontSize: "28px", fontWeight: 900 }}>{rooms}</span>
                    <button onClick={() => setRooms(rooms + 1)} style={{ width: "40px", height: "40px", borderRadius: "50%", border: "none", background: "linear-gradient(135deg,#1ea7ff,#0077ff)", color: "white", fontSize: "20px", cursor: "pointer", fontWeight: 700 }}>+</button>
                    <span style={{ color: "#9fb0c1", fontSize: "14px" }}>room{rooms > 1 ? "s" : ""} · {rooms} hour{rooms > 1 ? "s" : ""}</span>
                  </div>
                </div>

                {/* Price breakdown */}
                <div style={{ background: "rgba(255,255,255,.03)", borderRadius: "14px", padding: "18px", marginBottom: "24px", fontSize: "14px" }}>
                  {[
                    { l: `Rate (${discount > 0 ? `${discount}% off` : "full rate"})`, v: `£${offeredRate}/hr` },
                    { l: `Job total (${rooms} room${rooms > 1 ? "s" : ""})`, v: `£${jobTotal}` },
                    { l: "Platform fee (5%)", v: `£${platformFee.toFixed(2)}` },
                    { l: "You pay", v: `£${clientPays.toFixed(2)}`, bold: true, color: "#57c7ff" },
                    { l: `${cleaner.name.split(" ")[0]} receives (after 7.5%)`, v: `£${cleanerReceives.toFixed(2)}`, bold: true, color: "#22c55e" },
                  ].map((row) => (
                    <div key={row.l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,.04)", color: (row as { color?: string }).color || "#c5d0dc", fontWeight: (row as { bold?: boolean }).bold ? 800 : 400 }}>
                      <span>{row.l}</span><span>{row.v}</span>
                    </div>
                  ))}
                </div>

                {/* Contact details */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                  <div><label style={labelStyle}>Your Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Phone</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+44 7700 000000" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Postcode</label><input type="text" value={postcode} onChange={(e) => setPostcode(e.target.value)} placeholder="SW1A 1AA" style={inputStyle} /></div>
                  <div style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>City</label><input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="London" style={inputStyle} /></div>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={labelStyle}>Message to {cleaner.name.split(" ")[0]} (optional)</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="e.g. 3-bedroom house, available Saturday morning..." rows={3} style={{ ...inputStyle, resize: "none" }} />
                </div>

                <button onClick={handleSend} style={{ width: "100%", padding: "18px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg,#1ea7ff,#0077ff)", color: "white", fontSize: "17px", fontWeight: 800, cursor: "pointer" }}>
                  Send Offer — £{clientPays.toFixed(2)} total
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "60px", marginBottom: "20px" }}>✉️</div>
                <h3 style={{ fontSize: "26px", fontWeight: 900, marginBottom: "12px" }}>Offer Sent!</h3>
                <p style={{ color: "#9fb0c1", lineHeight: 1.8, marginBottom: "24px" }}>
                  An email has been sent to both you and <strong style={{ color: "white" }}>{cleaner.name}</strong> to connect.
                  Once they accept, you will be guided through secure Stripe payment and escrow activation.
                  Your offered rate: <strong style={{ color: "#57c7ff" }}>£{offeredRate}/hr · {rooms} room{rooms > 1 ? "s" : ""} · £{clientPays.toFixed(2)} total</strong>
                </p>
                <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
                  <Link href="/cleaners" style={{ padding: "14px 28px", borderRadius: "12px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "white", textDecoration: "none", fontWeight: 700 }}>Browse More Cleaners</Link>
                  <Link href="/" style={{ padding: "14px 28px", borderRadius: "12px", background: "linear-gradient(135deg,#1ea7ff,#0077ff)", color: "white", textDecoration: "none", fontWeight: 700 }}>Back to Home</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
