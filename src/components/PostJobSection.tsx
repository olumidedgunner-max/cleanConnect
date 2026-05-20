"use client";
import { useState, useRef } from "react";
import { useCleanConnect } from "@/context/CleanConnectContext";

const ROOM_TYPES = [
  { key: "kitchen", label: "Kitchen" },
  { key: "living", label: "Living Room" },
  { key: "bedroom", label: "Bedroom" },
  { key: "playroom", label: "Play Room" },
  { key: "toilet", label: "Toilet / Bathroom" },
];

type RoomEntry = { hasPhoto: boolean; condition: "none" | "moderate" | "medium"; photoName: string };
type Rooms = Record<string, RoomEntry[]>;

function getPricePerHour(c: "none" | "moderate" | "medium") {
  return c === "none" ? 30 : c === "moderate" ? 20 : 25;
}

function getConditionLabel(c: "none" | "moderate" | "medium") {
  if (c === "none") return { label: "Unverified — assumed heavy dirty", color: "#ef4444" };
  if (c === "moderate") return { label: "AI: Moderate dirt", color: "#f59e0b" };
  return { label: "AI: Medium dirt", color: "#3b82f6" };
}

const inputStyle = { width: "100%", padding: "14px 18px", borderRadius: "12px", border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.05)", color: "white", fontSize: "16px", outline: "none" };
const labelStyle = { display: "block" as const, color: "#9fb0c1", fontSize: "13px", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase" as const, letterSpacing: "1px" };

export default function PostJobSection() {
  const { addJob } = useCleanConnect();
  const [counts, setCounts] = useState<Record<string, number>>({ kitchen: 0, living: 0, bedroom: 0, playroom: 0, toilet: 0 });
  const [rooms, setRooms] = useState<Rooms>({});
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [postcode, setPostcode] = useState("");
  const [city, setCity] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<Record<string, HTMLInputElement | null>>({});

  function updateCount(key: string, val: number) {
    const next = Math.max(0, val);
    setCounts((c) => ({ ...c, [key]: next }));
    setRooms((r) => {
      const existing = r[key] || [];
      if (next > existing.length) {
        const added = Array.from({ length: next - existing.length }, () => ({ hasPhoto: false, condition: "none" as const, photoName: "" }));
        return { ...r, [key]: [...existing, ...added] };
      }
      return { ...r, [key]: existing.slice(0, next) };
    });
  }

  function handlePhoto(key: string, index: number, file: File) {
    const options: Array<"moderate" | "medium"> = ["moderate", "medium"];
    const simulated = options[Math.floor(Math.random() * options.length)];
    setRooms((r) => {
      const updated = [...(r[key] || [])];
      updated[index] = { hasPhoto: true, condition: simulated, photoName: file.name };
      return { ...r, [key]: updated };
    });
  }

  const allRows: Array<{ key: string; label: string; index: number; entry: RoomEntry }> = [];
  ROOM_TYPES.forEach(({ key, label }) => {
    (rooms[key] || []).forEach((entry, index) => allRows.push({ key, label, index, entry }));
  });

  const subtotal = allRows.reduce((sum, { entry }) => sum + getPricePerHour(entry.condition), 0);
  const platformFee = Math.round(subtotal * 0.05 * 100) / 100;
  const total = Math.round((subtotal + platformFee) * 100) / 100;
  const totalRooms = Object.values(counts).reduce((a, b) => a + b, 0);

  function handleSubmit() {
    if (!email || !phone || !postcode || !city) return;
    const conditions: Record<string, string> = {};
    allRows.forEach(({ key, index, entry }) => { conditions[`${key}-${index}`] = entry.condition; });
    addJob({
      rooms: ROOM_TYPES.filter(({ key }) => counts[key] > 0).map(({ key, label }) => ({ type: label, count: counts[key] })),
      totalRooms,
      subtotal,
      total,
      email,
      phone,
      postcode: postcode.toUpperCase(),
      city,
      conditions,
    });
    setSubmitted(true);
  }

  const card = { background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "26px", padding: "36px", border: "1px solid rgba(255,255,255,.06)", marginBottom: "36px" };

  return (
    <section style={{ padding: "90px 30px", maxWidth: "1100px", margin: "auto" }}>
      <h2 style={{ fontSize: "46px", fontWeight: 900, marginBottom: "12px" }}>Post a Cleaning Job</h2>
      <p style={{ color: "#9fb0c1", fontSize: "18px", lineHeight: 1.7, marginBottom: "50px", maxWidth: "700px" }}>
        Tell us your rooms, upload photos for AI pricing, add your location, and pay securely via escrow. Each room = 1 hour.
      </p>

      {/* Step 1 — Room counts */}
      <div style={card}>
        <h3 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "24px" }}>Step 1 — How many of each room?</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "20px" }}>
          {ROOM_TYPES.map(({ key, label }) => (
            <div key={key} style={{ textAlign: "center" }}>
              <div style={{ color: "#9fb0c1", fontSize: "13px", fontWeight: 700, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>{label}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px" }}>
                <button onClick={() => updateCount(key, counts[key] - 1)} style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1px solid rgba(255,255,255,.15)", background: "rgba(255,255,255,.06)", color: "white", fontSize: "20px", cursor: "pointer", fontWeight: 700 }}>−</button>
                <span style={{ fontSize: "30px", fontWeight: 900, minWidth: "28px" }}>{counts[key]}</span>
                <button onClick={() => updateCount(key, counts[key] + 1)} style={{ width: "36px", height: "36px", borderRadius: "50%", border: "none", background: "linear-gradient(135deg,#1ea7ff,#0077ff)", color: "white", fontSize: "20px", cursor: "pointer", fontWeight: 700 }}>+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 2 — Photos */}
      {totalRooms > 0 && (
        <div style={card}>
          <h3 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "12px" }}>Step 2 — Upload a photo for each room</h3>
          <p style={{ color: "#9fb0c1", fontSize: "14px", marginBottom: "24px" }}>No photo = assumed heavy dirty (£30/hr). Photo → AI determines moderate (£20/hr) or medium (£25/hr).</p>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                {["#", "Room", "Photo", "AI Condition", "Rate/hr", "Est. Time"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#9fb0c1", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allRows.map(({ key, label, index, entry }, i) => {
                const cond = getConditionLabel(entry.condition);
                return (
                  <tr key={`${key}-${index}`} style={{ borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                    <td style={{ padding: "16px", color: "#9fb0c1", fontSize: "14px" }}>{i + 1}</td>
                    <td style={{ padding: "16px", fontWeight: 700 }}>{label} {index + 1}</td>
                    <td style={{ padding: "16px" }}>
                      <input type="file" accept="image/*" style={{ display: "none" }} ref={(el) => { fileInputRef.current[`${key}-${index}`] = el; }} onChange={(e) => { if (e.target.files?.[0]) handlePhoto(key, index, e.target.files[0]); }} />
                      <button onClick={() => fileInputRef.current[`${key}-${index}`]?.click()} style={{ padding: "8px 16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,.15)", background: entry.hasPhoto ? "rgba(30,167,255,.15)" : "rgba(255,255,255,.06)", color: entry.hasPhoto ? "#57c7ff" : "#9fb0c1", fontSize: "13px", cursor: "pointer", fontWeight: 600 }}>
                        {entry.hasPhoto ? `✓ ${entry.photoName.slice(0, 14)}...` : "Upload Photo"}
                      </button>
                    </td>
                    <td style={{ padding: "16px", color: cond.color, fontSize: "13px", fontWeight: 700 }}>{cond.label}</td>
                    <td style={{ padding: "16px", fontWeight: 800, color: "#57c7ff" }}>£{getPricePerHour(entry.condition)}</td>
                    <td style={{ padding: "16px", color: "#9fb0c1" }}>1 hour</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Step 3 — Price summary */}
      {totalRooms > 0 && (
        <div style={card}>
          <h3 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "24px" }}>Step 3 — Price Summary</h3>
          <div style={{ maxWidth: "500px" }}>
            {[{ label: `Cleaning (${totalRooms} room${totalRooms > 1 ? "s" : ""} × 1hr)`, value: `£${subtotal}` }, { label: "Platform fee (5%)", value: `£${platformFee.toFixed(2)}` }].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,.05)", color: "#c5d0dc" }}>
                <span>{row.label}</span><span style={{ fontWeight: 700 }}>{row.value}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "18px 0", fontSize: "24px", fontWeight: 900 }}>
              <span>Total</span><span style={{ color: "#57c7ff" }}>£{total.toFixed(2)}</span>
            </div>
            <div style={{ background: "rgba(30,167,255,.08)", border: "1px solid rgba(30,167,255,.2)", borderRadius: "14px", padding: "16px", fontSize: "13px", color: "#9fb0c1", lineHeight: 1.6 }}>
              The cleaner who accepts pays a <strong style={{ color: "#57c7ff" }}>7.5% matching fee</strong> from their payout. Funds held in escrow until you confirm completion.
            </div>
          </div>
        </div>
      )}

      {/* Step 4 — Contact + location */}
      {totalRooms > 0 && (
        <div style={card}>
          <h3 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "8px" }}>Step 4 — Contact & Location</h3>
          <p style={{ color: "#9fb0c1", fontSize: "14px", marginBottom: "24px" }}>
            Just your email, phone, postcode and city for now. Your full address is only asked after a cleaner accepts — at the secure Stripe payment step.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div><label style={labelStyle}>Email Address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={inputStyle} /></div>
            <div><label style={labelStyle}>Phone Number</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+44 7700 000000" style={inputStyle} /></div>
            <div><label style={labelStyle}>Postcode</label><input type="text" value={postcode} onChange={(e) => setPostcode(e.target.value)} placeholder="SW1A 1AA" style={inputStyle} /></div>
            <div><label style={labelStyle}>City</label><input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="London" style={inputStyle} /></div>
          </div>
        </div>
      )}

      {totalRooms > 0 && !submitted && (
        <button onClick={handleSubmit} style={{ padding: "20px 50px", borderRadius: "16px", border: "none", background: "linear-gradient(135deg,#1ea7ff,#0077ff)", color: "white", fontSize: "18px", fontWeight: 800, cursor: "pointer", width: "100%" }}>
          Post Job — £{total.toFixed(2)} (held in escrow)
        </button>
      )}

      {submitted && (
        <div style={{ background: "rgba(30,167,255,.1)", border: "1px solid rgba(30,167,255,.3)", borderRadius: "20px", padding: "30px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✓</div>
          <h3 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "10px" }}>Job Posted Successfully!</h3>
          <p style={{ color: "#9fb0c1", lineHeight: 1.7 }}>Your job is now live in {city} ({postcode.toUpperCase()}). Once a cleaner accepts, you will complete full ID and payment via Stripe. Full address stays private until escrow is funded.</p>
        </div>
      )}
    </section>
  );
}
