"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useRef } from "react";
import { useCleanConnect } from "@/context/CleanConnectContext";
import { SAMPLE_CLEANERS } from "@/lib/sampleCleaners";

const ROOM_TYPES = [
  { key: "kitchen", label: "Kitchen", baseHours: 2 },
  { key: "living", label: "Living Room", baseHours: 1.5 },
  { key: "bedroom", label: "Bedroom", baseHours: 1 },
  { key: "playroom", label: "Play Room", baseHours: 1 },
  { key: "toilet", label: "Toilet / Bathroom", baseHours: 1.5 },
];

type AIAnalysis = {
  room_type: string;
  cleanliness_score: number;
  clutter_score: number;
  estimated_cleaning_hours: number;
  risk_level: string;
  suggested_price_gbp: number;
  recommended_cleaners: number;
  reasoning: string;
};

type RoomEntry = { hasPhoto: boolean; photoName: string; analyzing: boolean; analysis: AIAnalysis | null; error: string | null };
type Rooms = Record<string, RoomEntry[]>;

const inputStyle = { width: "100%", padding: "14px 18px", borderRadius: "12px", border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.05)", color: "white", fontSize: "16px", outline: "none" };
const labelStyle = { display: "block" as const, color: "#9fb0c1", fontSize: "13px", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase" as const, letterSpacing: "1px" };

export default function CleanerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { cleaners } = useCleanConnect();

  const liveMatch = cleaners.find((c) => c.id === id);
  const sampleMatch = SAMPLE_CLEANERS.find((c) => c.id === id);

  const cleaner = liveMatch
    ? { id: liveMatch.id, name: liveMatch.name, type: liveMatch.type || "individual", city: liveMatch.city, postcode: liveMatch.postcode, rate: liveMatch.rate || 25, radius: liveMatch.radius || 20, bio: liveMatch.bio, rating: undefined, jobsCompleted: undefined, autoAccept90: liveMatch.autoAccept90 ?? false }
    : sampleMatch
    ? { id: sampleMatch.id, name: sampleMatch.name, type: sampleMatch.type, city: sampleMatch.city, postcode: sampleMatch.postcode, rate: sampleMatch.rate, radius: sampleMatch.radius, bio: sampleMatch.bio, rating: sampleMatch.rating, jobsCompleted: sampleMatch.jobsCompleted, autoAccept90: false }
    : null;

  // — Room analysis state
  const [counts, setCounts] = useState<Record<string, number>>({ kitchen: 0, living: 0, bedroom: 0, playroom: 0, toilet: 0 });
  const [rooms, setRooms] = useState<Rooms>({});
  const fileInputRef = useRef<Record<string, HTMLInputElement | null>>({});

  // — Pricing state
  const [selectedTierIdx, setSelectedTierIdx] = useState(1); // default: 90%
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [postcode, setPostcode] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [autoAccepted, setAutoAccepted] = useState(false);

  if (!cleaner) {
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

  const isCompany = cleaner.type === "company";

  // Compute AI-based subtotal
  const allRows: Array<{ key: string; label: string; index: number; entry: RoomEntry }> = [];
  ROOM_TYPES.forEach(({ key, label }) => {
    (rooms[key] || []).forEach((entry, index) => allRows.push({ key, label, index, entry }));
  });

  const totalRooms = Object.values(counts).reduce((a, b) => a + b, 0);
  const anyAnalyzing = allRows.some((r) => r.entry.analyzing);

  const basePrice = Math.round(
    allRows.reduce((sum, { entry }) => {
      if (entry.analysis) return sum + entry.analysis.suggested_price_gbp;
      return sum + 30;
    }, 0)
  );

  // 4-tier pricing: 100%, 95%, 90%, 80% — displayed as specific £ amounts
  const TIERS = basePrice > 0
    ? [
        { pct: 100, price: basePrice },
        { pct: 95, price: Math.round(basePrice * 0.95 / 5) * 5 },
        { pct: 90, price: Math.round(basePrice * 0.90 / 5) * 5 },
        { pct: 80, price: Math.round(basePrice * 0.80 / 5) * 5 },
      ]
    : null;

  const chosenPrice = TIERS ? TIERS[selectedTierIdx].price : 0;
  const platformFee = Math.round(chosenPrice * 0.05 * 100) / 100;
  const clientPays = Math.round((chosenPrice + platformFee) * 100) / 100;
  const cleanerReceives = Math.round(chosenPrice * (1 - 0.075) * 100) / 100;

  function updateCount(key: string, val: number) {
    const next = Math.max(0, val);
    setCounts((c) => ({ ...c, [key]: next }));
    setRooms((r) => {
      const existing = r[key] || [];
      if (next > existing.length) {
        const added = Array.from({ length: next - existing.length }, () => ({ hasPhoto: false, photoName: "", analyzing: false, analysis: null, error: null }));
        return { ...r, [key]: [...existing, ...added] };
      }
      return { ...r, [key]: existing.slice(0, next) };
    });
  }

  function compressAndEncode(file: File): Promise<{ base64: string; mediaType: string }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const MAX = 768;
        let { width, height } = img;
        if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
        else if (height > MAX) { width = Math.round(width * MAX / height); height = MAX; }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.65);
        URL.revokeObjectURL(url);
        resolve({ base64: dataUrl.split(",")[1], mediaType: "image/jpeg" });
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  async function handlePhoto(key: string, index: number, file: File) {
    setRooms((r) => {
      const updated = [...(r[key] || [])];
      updated[index] = { ...updated[index], hasPhoto: true, photoName: file.name, analyzing: true, analysis: null, error: null };
      return { ...r, [key]: updated };
    });
    try {
      const { base64, mediaType } = await compressAndEncode(file);
      // Switch to gpt-4o only if any previous room already priced above £200
      const highValueDetected = allRows.some((r) => (r.entry.analysis?.suggested_price_gbp ?? 0) > 200);
      const res = await fetch("/api/analyze-room", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imageBase64: base64, mediaType, roomKey: key, roomIndex: index, useHighAccuracy: highValueDetected }) });
      const data = await res.json();
      setRooms((r) => {
        const updated = [...(r[key] || [])];
        updated[index] = data.success
          ? { ...updated[index], analyzing: false, analysis: data.analysis }
          : { ...updated[index], analyzing: false, error: data.error || "Analysis failed" };
        return { ...r, [key]: updated };
      });
    } catch {
      setRooms((r) => {
        const updated = [...(r[key] || [])];
        updated[index] = { ...updated[index], analyzing: false, error: "Could not reach AI service" };
        return { ...r, [key]: updated };
      });
    }
  }

  function handleSend() {
    if (!name || !email || !phone || !postcode || !city) return;
    const isAutoAccept = !!(cleaner && cleaner.autoAccept90 && TIERS && TIERS[selectedTierIdx].pct === 90);
    setAutoAccepted(isAutoAccept);
    setSent(true);
  }

  return (
    <main style={{ background: "#07111f", minHeight: "100vh", color: "white" }}>
      <div style={{ padding: "24px 30px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ maxWidth: "1100px", margin: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ fontSize: "28px", fontWeight: 800, textDecoration: "none", color: "white" }}>Clean<span style={{ color: "#57c7ff" }}>Connect</span></Link>
          <Link href="/cleaners" style={{ color: "#9fb0c1", textDecoration: "none", fontSize: "14px" }}>← Back to cleaners</Link>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "auto", padding: "50px 30px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "36px", alignItems: "start" }}>

          {/* Cleaner profile */}
          <div>
            <div style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "26px", padding: "36px", border: `1px solid rgba(${isCompany ? "245,158,11" : "34,197,94"},.2)`, marginBottom: "20px" }}>
              <div style={{ display: "flex", gap: "18px", alignItems: "center", marginBottom: "24px" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: `linear-gradient(135deg,${isCompany ? "#f59e0b,#d97706" : "#22c55e,#16a34a"})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "26px", flexShrink: 0 }}>
                  {cleaner.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: "22px" }}>{cleaner.name}</div>
                  <div style={{ color: "#9fb0c1", fontSize: "13px", marginTop: "4px" }}>{cleaner.city} · {cleaner.postcode}</div>
                  <span style={{ marginTop: "6px", display: "inline-block", padding: "3px 10px", borderRadius: "999px", background: `rgba(${isCompany ? "245,158,11" : "34,197,94"},.15)`, color: isCompany ? "#f59e0b" : "#22c55e", fontSize: "11px", fontWeight: 700 }}>
                    {isCompany ? "🏢 Company" : "🧑 Individual"}
                  </span>
                </div>
              </div>

              {cleaner.bio && <p style={{ color: "#c5d0dc", lineHeight: 1.8, marginBottom: "20px", fontSize: "14px" }}>{cleaner.bio}</p>}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  { label: "Base Rate", value: `£${cleaner.rate}/hr`, color: "#57c7ff" },
                  { label: "Coverage", value: `${cleaner.radius} miles`, color: "white" },
                  cleaner.rating ? { label: "Rating", value: `★ ${cleaner.rating}`, color: "#fbbf24" } : null,
                  cleaner.jobsCompleted !== undefined ? { label: "Jobs Done", value: `${cleaner.jobsCompleted}`, color: "white" } : null,
                ].filter(Boolean).map((s) => s && (
                  <div key={s.label} style={{ background: "rgba(255,255,255,.04)", borderRadius: "10px", padding: "12px 14px" }}>
                    <div style={{ color: "#9fb0c1", fontSize: "11px", marginBottom: "4px" }}>{s.label}</div>
                    <div style={{ fontWeight: 800, fontSize: "17px", color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {cleaner.autoAccept90 && (
              <div style={{ background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.25)", borderRadius: "14px", padding: "14px 18px", fontSize: "13px", color: "#22c55e", lineHeight: 1.6 }}>
                ✓ This cleaner auto-accepts at 90% price — select the 90% tier for instant confirmation.
              </div>
            )}
          </div>

          {/* Right panel */}
          <div>
            {!sent ? (
              <div style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "26px", padding: "36px", border: "1px solid rgba(255,255,255,.06)" }}>
                <h2 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "6px" }}>Book {cleaner.name.split(" ")[0]}</h2>
                <p style={{ color: "#9fb0c1", fontSize: "14px", marginBottom: "28px" }}>Tell us about your rooms — AI will price the job, then you choose your offer.</p>

                {/* Step 1: Room counts */}
                <div style={{ marginBottom: "28px" }}>
                  <label style={labelStyle}>Step 1 — Rooms to clean</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: "14px" }}>
                    {ROOM_TYPES.map(({ key, label }) => (
                      <div key={key} style={{ background: "rgba(255,255,255,.04)", borderRadius: "12px", padding: "14px", textAlign: "center" }}>
                        <div style={{ color: "#9fb0c1", fontSize: "11px", fontWeight: 700, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                          <button onClick={() => updateCount(key, counts[key] - 1)} style={{ width: "30px", height: "30px", borderRadius: "50%", border: "1px solid rgba(255,255,255,.15)", background: "rgba(255,255,255,.06)", color: "white", fontSize: "18px", cursor: "pointer" }}>−</button>
                          <span style={{ fontSize: "22px", fontWeight: 900, minWidth: "20px" }}>{counts[key]}</span>
                          <button onClick={() => updateCount(key, counts[key] + 1)} style={{ width: "30px", height: "30px", borderRadius: "50%", border: "none", background: "linear-gradient(135deg,#1ea7ff,#0077ff)", color: "white", fontSize: "18px", cursor: "pointer" }}>+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 2: Photo upload */}
                {totalRooms > 0 && (
                  <div style={{ marginBottom: "28px" }}>
                    <label style={labelStyle}>Step 2 — Upload room photos (AI pricing)</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {allRows.map(({ key, label, index, entry }, i) => (
                        <div key={`${key}-${index}`} style={{ background: "rgba(255,255,255,.03)", borderRadius: "14px", padding: "14px 18px", border: "1px solid rgba(255,255,255,.06)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ fontWeight: 600, fontSize: "14px", color: "#c5d0dc" }}>{i + 1}. {label} {index + 1}</div>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                              {entry.analyzing && <span style={{ color: "#9fb0c1", fontSize: "12px" }}>Analysing...</span>}
                              <input type="file" accept="image/*" style={{ display: "none" }} ref={(el) => { fileInputRef.current[`${key}-${index}`] = el; }} onChange={(e) => { if (e.target.files?.[0]) handlePhoto(key, index, e.target.files[0]); }} />
                              <button onClick={() => fileInputRef.current[`${key}-${index}`]?.click()} style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,.15)", background: entry.hasPhoto ? "rgba(30,167,255,.15)" : "rgba(255,255,255,.06)", color: entry.hasPhoto ? "#57c7ff" : "#9fb0c1", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}>
                                {entry.hasPhoto ? `✓ ${entry.photoName.slice(0, 14)}...` : "Upload Photo"}
                              </button>
                            </div>
                          </div>
                          {entry.analysis && (
                            <div style={{ marginTop: "10px", padding: "10px", background: "rgba(87,199,255,.06)", borderRadius: "10px", fontSize: "12px", color: "#9fb0c1", display: "flex", gap: "14px" }}>
                              <span>Risk: <strong style={{ color: "#57c7ff" }}>{entry.analysis.risk_level}</strong></span>
                              <span>Hours: <strong style={{ color: "white" }}>{entry.analysis.estimated_cleaning_hours}</strong></span>
                              <span>Price: <strong style={{ color: "#57c7ff" }}>£{entry.analysis.suggested_price_gbp}</strong></span>
                            </div>
                          )}
                          {entry.error && <div style={{ marginTop: "8px", fontSize: "12px", color: "#ef4444" }}>⚠ {entry.error} — using £30 fallback</div>}
                          {!entry.hasPhoto && <div style={{ marginTop: "6px", fontSize: "12px", color: "#9fb0c1" }}>No photo — priced at £30 (heavy clean assumed)</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Price tiers */}
                {totalRooms > 0 && !anyAnalyzing && TIERS && (
                  <div style={{ marginBottom: "28px" }}>
                    <label style={labelStyle}>Step 3 — Choose your price offer</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {TIERS.map((tier, idx) => {
                        const isDefault = tier.pct === 90;
                        const isAutoAcceptTier = cleaner.autoAccept90 && tier.pct === 90;
                        const isSelected = selectedTierIdx === idx;
                        return (
                          <button
                            key={tier.pct}
                            onClick={() => setSelectedTierIdx(idx)}
                            style={{ padding: "16px 20px", borderRadius: "12px", border: `2px solid ${isSelected ? "#57c7ff" : "rgba(255,255,255,.08)"}`, background: isSelected ? "rgba(87,199,255,.1)" : "rgba(255,255,255,.03)", color: "white", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                          >
                            <div>
                              <span style={{ fontWeight: isSelected ? 700 : 400 }}>
                                {tier.pct === 100 ? "Full price" : `${tier.pct}% of AI price`}
                              </span>
                              {isDefault && <span style={{ marginLeft: "8px", padding: "2px 8px", borderRadius: "999px", background: "rgba(87,199,255,.2)", color: "#57c7ff", fontSize: "11px", fontWeight: 700 }}>Default</span>}
                              {isAutoAcceptTier && <span style={{ marginLeft: "6px", padding: "2px 8px", borderRadius: "999px", background: "rgba(34,197,94,.2)", color: "#22c55e", fontSize: "11px", fontWeight: 700 }}>Auto-Accept</span>}
                            </div>
                            <span style={{ color: "#57c7ff", fontWeight: 900, fontSize: "18px" }}>£{tier.price}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div style={{ marginTop: "14px", background: "rgba(255,255,255,.03)", borderRadius: "12px", padding: "14px 18px", fontSize: "13px" }}>
                      {[
                        { l: `Job price (${TIERS[selectedTierIdx].pct}% tier)`, v: `£${chosenPrice}` },
                        { l: "Platform fee (5%)", v: `£${platformFee.toFixed(2)}` },
                        { l: "You pay", v: `£${clientPays.toFixed(2)}`, bold: true, color: "#57c7ff" },
                        { l: `${cleaner.name.split(" ")[0]} receives (after 7.5%)`, v: `£${cleanerReceives.toFixed(2)}`, color: "#22c55e" },
                      ].map((row) => (
                        <div key={row.l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,.04)", color: (row as { color?: string }).color || "#c5d0dc", fontWeight: (row as { bold?: boolean }).bold ? 800 : 400 }}>
                          <span>{row.l}</span><span>{row.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Contact */}
                {totalRooms > 0 && !anyAnalyzing && (
                  <>
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

                    <button onClick={handleSend} disabled={!TIERS} style={{ width: "100%", padding: "18px", borderRadius: "14px", border: "none", background: TIERS ? "linear-gradient(135deg,#1ea7ff,#0077ff)" : "rgba(255,255,255,.1)", color: "white", fontSize: "17px", fontWeight: 800, cursor: TIERS ? "pointer" : "not-allowed", opacity: TIERS ? 1 : 0.5 }}>
                      {TIERS ? `Send Offer — £${clientPays.toFixed(2)} total` : "Add rooms above to continue"}
                    </button>
                  </>
                )}

                {totalRooms === 0 && (
                  <div style={{ textAlign: "center", padding: "30px", color: "#9fb0c1", fontSize: "15px" }}>
                    Add rooms above to get an AI-powered price and send your offer.
                  </div>
                )}
              </div>
            ) : (
              <div style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "26px", padding: "50px 40px", border: "1px solid rgba(255,255,255,.06)", textAlign: "center" }}>
                <div style={{ fontSize: "60px", marginBottom: "20px" }}>{autoAccepted ? "✅" : "✉️"}</div>
                <h3 style={{ fontSize: "26px", fontWeight: 900, marginBottom: "12px" }}>
                  {autoAccepted ? "Auto-Accepted! Proceed to Payment" : "Offer Sent!"}
                </h3>
                <p style={{ color: "#9fb0c1", lineHeight: 1.8, marginBottom: "24px", maxWidth: "440px", margin: "0 auto 24px" }}>
                  {autoAccepted
                    ? `${cleaner.name} has pre-agreed to the 90% tier. Your offer of £${clientPays.toFixed(2)} is confirmed — you can now proceed to payment. Funds are held in escrow and released 24 hours after job completion.`
                    : `An email has been sent to ${cleaner.name} with your offer of £${clientPays.toFixed(2)}. Once accepted, you will be guided through secure payment. Funds held in escrow — released 24 hours after completion.`}
                </p>
                <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
                  <Link href="/cleaners" style={{ padding: "14px 28px", borderRadius: "12px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "white", textDecoration: "none", fontWeight: 700 }}>Browse More Cleaners</Link>
                  {autoAccepted && (
                    <button style={{ padding: "14px 28px", borderRadius: "12px", background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}>
                      Proceed to Payment →
                    </button>
                  )}
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
