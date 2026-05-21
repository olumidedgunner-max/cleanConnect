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

type AIAnalysis = {
  room_type: string;
  room_size: string;
  dirtiness_score: number;
  dirtiness_level: string;
  issues_detected: string[];
  base_hours: number;
  size_multiplier: number;
  dirt_multiplier: number;
  estimated_hours: number;
  hourly_rate: number;
  price: number;
  condition_summary: string;
};

type RoomEntry = {
  hasPhoto: boolean;
  photoName: string;
  analyzing: boolean;
  analysis: AIAnalysis | null;
  error: string | null;
};

type Rooms = Record<string, RoomEntry[]>;

function dirtColor(score: number) {
  if (score <= 3) return "#22c55e";
  if (score <= 6) return "#f59e0b";
  if (score <= 8) return "#ef4444";
  return "#7c2d12";
}

function dirtBg(score: number) {
  if (score <= 3) return "rgba(34,197,94,.1)";
  if (score <= 6) return "rgba(245,158,11,.1)";
  return "rgba(239,68,68,.1)";
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
        const added = Array.from({ length: next - existing.length }, () => ({ hasPhoto: false, photoName: "", analyzing: false, analysis: null, error: null }));
        return { ...r, [key]: [...existing, ...added] };
      }
      return { ...r, [key]: existing.slice(0, next) };
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

      const res = await fetch("/api/analyze-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mediaType }),
      });

      const data = await res.json();

      setRooms((r) => {
        const updated = [...(r[key] || [])];
        if (data.success) {
          updated[index] = { ...updated[index], analyzing: false, analysis: data.analysis };
        } else {
          updated[index] = { ...updated[index], analyzing: false, error: data.error || "Analysis failed" };
        }
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

  function compressAndEncode(file: File): Promise<{ base64: string; mediaType: string }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const MAX = 1200;
        let { width, height } = img;
        if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
        else if (height > MAX) { width = Math.round(width * MAX / height); height = MAX; }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
        URL.revokeObjectURL(url);
        resolve({ base64: dataUrl.split(",")[1], mediaType: "image/jpeg" });
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  const allRows: Array<{ key: string; label: string; index: number; entry: RoomEntry }> = [];
  ROOM_TYPES.forEach(({ key, label }) => {
    (rooms[key] || []).forEach((entry, index) => allRows.push({ key, label, index, entry }));
  });

  const totalRooms = Object.values(counts).reduce((a, b) => a + b, 0);

  // Calculate totals from AI analysis or fallback
  const subtotal = allRows.reduce((sum, { entry }) => {
    if (entry.analysis) return sum + entry.analysis.price;
    return sum + 30; // fallback heavy rate
  }, 0);
  const platformFee = Math.round(subtotal * 0.05 * 100) / 100;
  const total = Math.round((subtotal + platformFee) * 100) / 100;

  const allAnalyzed = allRows.length > 0 && allRows.every((r) => r.entry.analysis !== null || (r.entry.hasPhoto && r.entry.error !== null) || !r.entry.hasPhoto);
  const anyAnalyzing = allRows.some((r) => r.entry.analyzing);

  function handleSubmit() {
    if (!email || !phone || !postcode || !city) return;
    const conditions: Record<string, string> = {};
    allRows.forEach(({ key, index, entry }) => {
      const level = entry.analysis?.dirtiness_level?.toLowerCase() || "none";
      conditions[`${key}-${index}`] = level === "light" ? "moderate" : level === "heavy" || level === "extreme" ? "none" : "medium";
    });
    addJob({ rooms: ROOM_TYPES.filter(({ key }) => counts[key] > 0).map(({ key, label }) => ({ type: label, count: counts[key] })), totalRooms, subtotal, total, email, phone, postcode: postcode.toUpperCase(), city, conditions });
    setSubmitted(true);
  }

  const card = { background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "26px", padding: "36px", border: "1px solid rgba(255,255,255,.06)", marginBottom: "36px" };

  return (
    <section style={{ padding: "90px 30px", maxWidth: "1100px", margin: "auto" }}>
      <h2 style={{ fontSize: "46px", fontWeight: 900, marginBottom: "12px" }}>Post a Clean Job</h2>
      <p style={{ color: "#9fb0c1", fontSize: "18px", lineHeight: 1.7, marginBottom: "50px", maxWidth: "700px" }}>
        Tell us your rooms, upload photos and <strong style={{ color: "#57c7ff" }}>Claude AI</strong> will analyse each room — detecting dirtiness, estimating hours, and pricing fairly. Each room priced at £20/hr base.
      </p>

      {/* Step 1 */}
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

      {/* Step 2 — AI Photo Analysis */}
      {totalRooms > 0 && (
        <div style={card}>
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "8px" }}>Step 2 — Upload photos for AI pricing</h3>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ background: "rgba(87,199,255,.1)", border: "1px solid rgba(87,199,255,.25)", borderRadius: "10px", padding: "8px 14px", fontSize: "13px", color: "#57c7ff", fontWeight: 600 }}>
                🤖 Claude AI analyses each photo
              </div>
              <p style={{ color: "#9fb0c1", fontSize: "14px" }}>No photo = £30/hr (heavy clean assumed). Photos unlock fair AI pricing.</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {allRows.map(({ key, label, index, entry }, i) => (
              <div key={`${key}-${index}`} style={{ background: "rgba(255,255,255,.03)", borderRadius: "18px", padding: "20px", border: "1px solid rgba(255,255,255,.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: entry.analysis ? "16px" : "0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ background: "rgba(30,167,255,.15)", borderRadius: "10px", padding: "6px 14px", fontSize: "13px", color: "#57c7ff", fontWeight: 700 }}>{i + 1}</div>
                    <div style={{ fontWeight: 700, fontSize: "16px" }}>{label} {index + 1}</div>
                  </div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    {entry.analyzing && (
                      <div style={{ color: "#9fb0c1", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ display: "inline-block", width: "14px", height: "14px", border: "2px solid #57c7ff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                        Claude AI analysing...
                      </div>
                    )}
                    <input type="file" accept="image/*" style={{ display: "none" }} ref={(el) => { fileInputRef.current[`${key}-${index}`] = el; }} onChange={(e) => { if (e.target.files?.[0]) handlePhoto(key, index, e.target.files[0]); }} />
                    <button onClick={() => fileInputRef.current[`${key}-${index}`]?.click()} style={{ padding: "8px 18px", borderRadius: "10px", border: "1px solid rgba(255,255,255,.15)", background: entry.hasPhoto ? "rgba(30,167,255,.15)" : "rgba(255,255,255,.06)", color: entry.hasPhoto ? "#57c7ff" : "#9fb0c1", fontSize: "13px", cursor: "pointer", fontWeight: 600 }}>
                      {entry.hasPhoto ? `✓ ${entry.photoName.slice(0, 16)}...` : "Upload Photo"}
                    </button>
                  </div>
                </div>

                {/* AI Analysis Result */}
                {entry.analysis && (
                  <div style={{ background: dirtBg(entry.analysis.dirtiness_score), border: `1px solid ${dirtColor(entry.analysis.dirtiness_score)}40`, borderRadius: "14px", padding: "18px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px", marginBottom: "14px" }}>
                      <div>
                        <div style={{ color: "#9fb0c1", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Room Type</div>
                        <div style={{ fontWeight: 700, fontSize: "15px" }}>{entry.analysis.room_type}</div>
                      </div>
                      <div>
                        <div style={{ color: "#9fb0c1", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Size</div>
                        <div style={{ fontWeight: 700, fontSize: "15px" }}>{entry.analysis.room_size}</div>
                      </div>
                      <div>
                        <div style={{ color: "#9fb0c1", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Dirt Score</div>
                        <div style={{ fontWeight: 900, fontSize: "18px", color: dirtColor(entry.analysis.dirtiness_score) }}>{entry.analysis.dirtiness_score}/10 — {entry.analysis.dirtiness_level}</div>
                      </div>
                      <div>
                        <div style={{ color: "#9fb0c1", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>AI Price</div>
                        <div style={{ fontWeight: 900, fontSize: "20px", color: "#57c7ff" }}>£{entry.analysis.price}</div>
                        <div style={{ color: "#9fb0c1", fontSize: "11px" }}>{entry.analysis.estimated_hours}hrs × £20</div>
                      </div>
                    </div>
                    {entry.analysis.issues_detected.length > 0 && (
                      <div style={{ marginBottom: "10px" }}>
                        <span style={{ color: "#9fb0c1", fontSize: "12px", marginRight: "8px" }}>Issues:</span>
                        {entry.analysis.issues_detected.map((issue) => (
                          <span key={issue} style={{ display: "inline-block", margin: "2px 4px", padding: "3px 10px", borderRadius: "999px", background: "rgba(255,255,255,.08)", fontSize: "12px", color: "#c5d0dc" }}>{issue}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ color: "#9fb0c1", fontSize: "13px", fontStyle: "italic" }}>"{entry.analysis.condition_summary}"</div>
                    <div style={{ marginTop: "10px", display: "flex", gap: "16px", fontSize: "12px", color: "#9fb0c1" }}>
                      <span>Base: {entry.analysis.base_hours}hr</span>
                      <span>Size ×{entry.analysis.size_multiplier}</span>
                      <span>Dirt ×{entry.analysis.dirt_multiplier}</span>
                      <span>= {entry.analysis.estimated_hours}hrs</span>
                    </div>
                  </div>
                )}

                {entry.error && (
                  <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.25)", borderRadius: "12px", padding: "12px 16px", fontSize: "13px", color: "#ef4444", marginTop: "8px" }}>
                    ⚠ AI analysis unavailable: {entry.error} — using £30/hr heavy clean rate.
                  </div>
                )}

                {!entry.hasPhoto && (
                  <div style={{ color: "#9fb0c1", fontSize: "13px", marginTop: "8px" }}>No photo uploaded — will be priced at £30/hr (heavy clean assumed).</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3 — Price Summary */}
      {totalRooms > 0 && !anyAnalyzing && (
        <div style={card}>
          <h3 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "24px" }}>Step 3 — Price Summary</h3>
          <div style={{ maxWidth: "500px" }}>
            {allRows.map(({ label, index, entry }, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.05)", color: "#c5d0dc", fontSize: "14px" }}>
                <span>{label} {index + 1} {entry.analysis ? `(${entry.analysis.dirtiness_level}, ${entry.analysis.estimated_hours}hrs)` : "(no photo, 1hr)"}</span>
                <span style={{ fontWeight: 700 }}>£{entry.analysis ? entry.analysis.price : 30}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.05)", color: "#c5d0dc", fontSize: "14px" }}>
              <span>Platform fee (5%)</span>
              <span style={{ fontWeight: 700 }}>£{platformFee.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "18px 0", fontSize: "24px", fontWeight: 900 }}>
              <span>Total</span>
              <span style={{ color: "#57c7ff" }}>£{total.toFixed(2)}</span>
            </div>
            <div style={{ background: "rgba(30,167,255,.08)", border: "1px solid rgba(30,167,255,.2)", borderRadius: "14px", padding: "16px", fontSize: "13px", color: "#9fb0c1", lineHeight: 1.6 }}>
              The cleaner pays a <strong style={{ color: "#57c7ff" }}>7.5% matching fee</strong> from their payout. Funds held in escrow until you confirm completion.
            </div>
          </div>
        </div>
      )}

      {/* Step 4 — Contact */}
      {totalRooms > 0 && !anyAnalyzing && (
        <div style={card}>
          <h3 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "8px" }}>Step 4 — Contact & Location</h3>
          <p style={{ color: "#9fb0c1", fontSize: "14px", marginBottom: "24px" }}>Just email, phone, postcode and city for now. Full address is collected securely at the Stripe payment step.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div><label style={labelStyle}>Email Address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={inputStyle} /></div>
            <div><label style={labelStyle}>Phone Number</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+44 7700 000000" style={inputStyle} /></div>
            <div><label style={labelStyle}>Postcode</label><input type="text" value={postcode} onChange={(e) => setPostcode(e.target.value)} placeholder="SW1A 1AA" style={inputStyle} /></div>
            <div><label style={labelStyle}>City</label><input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="London" style={inputStyle} /></div>
          </div>
        </div>
      )}

      {totalRooms > 0 && !anyAnalyzing && !submitted && (
        <button onClick={handleSubmit} style={{ padding: "20px 50px", borderRadius: "16px", border: "none", background: "linear-gradient(135deg,#1ea7ff,#0077ff)", color: "white", fontSize: "18px", fontWeight: 800, cursor: "pointer", width: "100%" }}>
          Post Job — £{total.toFixed(2)} (held in escrow)
        </button>
      )}

      {anyAnalyzing && totalRooms > 0 && (
        <div style={{ textAlign: "center", padding: "20px", color: "#9fb0c1", fontSize: "16px" }}>
          🤖 Claude AI is analysing your room photos... please wait
        </div>
      )}

      {submitted && (
        <div style={{ background: "rgba(30,167,255,.1)", border: "1px solid rgba(30,167,255,.3)", borderRadius: "20px", padding: "30px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✓</div>
          <h3 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "10px" }}>Job Posted!</h3>
          <p style={{ color: "#9fb0c1", lineHeight: 1.7 }}>Your job is live in {city} ({postcode.toUpperCase()}). Once a cleaner accepts, you complete ID verification and payment via Stripe. Your full address stays private until escrow is funded.</p>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
