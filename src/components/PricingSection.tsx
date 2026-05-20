"use client";
import { useState } from "react";

const clientPlans = [
  {
    label: "Free Forever",
    title: "Basic",
    price: "£0",
    period: "/month",
    note: "Perfect to get started",
    featured: false,
    platinum: false,
    cta: "Get Started Free",
    ctaStyle: "secondary",
    features: [
      "Standard job posting",
      "AI pricing estimates",
      "Basic escrow protection",
      "Access to verified cleaners",
      "5% platform fee",
      "24-48h response time",
      "Basic photo verification",
    ],
  },
  {
    label: "Best Value",
    title: "Plus",
    price: "£14",
    period: ".99/mo",
    note: "Or £143.88/year (save 20%)",
    featured: true,
    platinum: false,
    badge: "MOST POPULAR",
    cta: "Start 30-Day Free Trial",
    ctaStyle: "orange",
    features: [
      "Everything in Basic, plus:",
      "Priority job visibility",
      "Advanced AI room analysis",
      "Reduced fee: 3.5%",
      "Same-day booking guarantee",
      "Unlimited job postings",
      "Premium support (12h response)",
      "Save up to 10 favorite cleaners",
      "Scheduling assistant",
    ],
  },
  {
    label: "Elite Experience",
    title: "Platinum",
    price: "£39",
    period: ".99/mo",
    note: "Or £383.88/year (save 20%)",
    featured: false,
    platinum: true,
    cta: "Start 14-Day Free Trial",
    ctaStyle: "purple",
    features: [
      "Everything in Plus, plus:",
      "Zero platform fees",
      "Dedicated account manager",
      "24/7 VIP support line",
      "4-hour emergency guarantee",
      "Unlimited property management",
      "White-glove concierge service",
      "Premium insurance coverage",
      "Video consultation pre-booking",
      "Custom cleaning protocols",
    ],
  },
];

const cleanerPlans = [
  {
    label: "Free Forever",
    title: "Cleaner",
    price: "£0",
    period: "/month",
    note: "Start earning today",
    featured: false,
    platinum: false,
    cta: "Join Free",
    ctaStyle: "secondary",
    features: [
      "Access to job board",
      "Basic profile listing",
      "Standard verification badge",
      "12% platform commission",
      "Payment within 48 hours",
      "Basic dispute support",
    ],
  },
  {
    label: "Professional",
    title: "Pro Cleaner",
    price: "£24",
    period: ".99/mo",
    note: "Or £239.88/year (save 20%)",
    featured: true,
    platinum: false,
    badge: "MOST POPULAR",
    cta: "Start 30-Day Free Trial",
    ctaStyle: "orange",
    features: [
      "Everything in Cleaner, plus:",
      "Featured profile placement",
      "Reduced commission: 8%",
      "Instant job notifications",
      "Payment within 24 hours",
      "Set premium rates",
      "Client analytics dashboard",
      "Marketing toolkit",
      "Insurance discount partnership",
    ],
  },
  {
    label: "Maximum Earnings",
    title: "Elite Partner",
    price: "£79",
    period: ".99/mo",
    note: "Or £767.88/year (save 20%)",
    featured: false,
    platinum: true,
    cta: "Start 14-Day Free Trial",
    ctaStyle: "purple",
    features: [
      "Everything in Pro, plus:",
      "0% commission — Keep 100%",
      "Exclusive Platinum client access",
      "Same-day payment option",
      "Dedicated success manager",
      "£500 monthly job guarantee",
      "Team/contractor management",
      "API calendar integration",
      "White-label client app",
      "Marketing co-promotion",
    ],
  },
];

function PlanCard({ plan }: { plan: typeof clientPlans[0] }) {
  const border = plan.platinum
    ? "2px solid #c084fc"
    : plan.featured
    ? "2px solid #ff9500"
    : "2px solid rgba(255,255,255,.06)";

  const shadow = plan.platinum
    ? "0 0 60px rgba(192,132,252,.25)"
    : plan.featured
    ? "0 0 60px rgba(255,149,0,.25)"
    : "none";

  const ctaBg =
    plan.ctaStyle === "orange"
      ? "linear-gradient(135deg,#ff9500,#ff6b00)"
      : plan.ctaStyle === "purple"
      ? "linear-gradient(135deg,#c084fc,#7c3aed)"
      : "rgba(255,255,255,.08)";

  const ctaBorder = plan.ctaStyle === "secondary" ? "1px solid rgba(255,255,255,.1)" : "none";

  return (
    <div style={{
      background: "linear-gradient(180deg,#0d1727,#101d30)",
      borderRadius: "26px",
      padding: "38px",
      border,
      boxShadow: shadow,
      position: "relative",
      flex: "1",
      minWidth: "300px",
      maxWidth: "380px",
    }}>
      {plan.badge && (
        <div style={{
          position: "absolute",
          top: "-15px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(135deg,#ff9500,#ff6b00)",
          padding: "8px 24px",
          borderRadius: "20px",
          fontSize: "13px",
          fontWeight: 800,
          letterSpacing: "1px",
          whiteSpace: "nowrap",
        }}>
          {plan.badge}
        </div>
      )}
      <div style={{ fontSize: "15px", color: "#9fb0c1", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "12px" }}>
        {plan.label}
      </div>
      <div style={{ fontSize: "36px", fontWeight: 900, marginBottom: "20px" }}>{plan.title}</div>
      <div style={{ marginBottom: "30px" }}>
        <div style={{ fontSize: "56px", fontWeight: 900, lineHeight: 1 }}>
          {plan.price}<span style={{ fontSize: "24px", color: "#9fb0c1", fontWeight: 600 }}>{plan.period}</span>
        </div>
        <div style={{ color: "#9fb0c1", fontSize: "14px", marginTop: "8px" }}>{plan.note}</div>
      </div>
      <ul style={{ listStyle: "none", marginBottom: "35px" }}>
        {plan.features.map((f, i) => (
          <li key={i} style={{
            padding: "14px 0",
            borderBottom: i < plan.features.length - 1 ? "1px solid rgba(255,255,255,.05)" : "none",
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            color: "#c5d0dc",
            lineHeight: 1.6,
          }}>
            <span style={{ color: "#57c7ff", fontWeight: 900, fontSize: "18px", minWidth: "20px" }}>✓</span>
            {f}
          </li>
        ))}
      </ul>
      <button style={{
        width: "100%",
        padding: "18px",
        fontSize: "17px",
        fontWeight: 800,
        borderRadius: "14px",
        border: ctaBorder,
        cursor: "pointer",
        background: ctaBg,
        color: "white",
      }}>
        {plan.cta}
      </button>
    </div>
  );
}

export default function PricingSection() {
  const [isClients, setIsClients] = useState(true);
  const plans = isClients ? clientPlans : cleanerPlans;

  return (
    <section style={{ padding: "90px 30px", maxWidth: "1400px", margin: "auto" }}>
      <div style={{ textAlign: "center", marginBottom: "70px" }}>
        <h2 style={{
          fontSize: "56px",
          fontWeight: 900,
          marginBottom: "18px",
          background: "linear-gradient(135deg,#57c7ff,#1ea7ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          Choose Your Premium Tier
        </h2>
        <p style={{ fontSize: "20px", color: "#9fb0c1", maxWidth: "700px", margin: "auto", lineHeight: 1.6 }}>
          Whether you&apos;re a client seeking elite service or a cleaner growing your business, we have the perfect plan.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginBottom: "50px" }}>
        <span style={{ fontSize: "18px", fontWeight: 700 }}>For Clients</span>
        <div
          onClick={() => setIsClients(!isClients)}
          style={{
            position: "relative",
            width: "140px",
            height: "50px",
            background: "#1a2738",
            borderRadius: "30px",
            cursor: "pointer",
            border: "2px solid #2a3f5f",
          }}
        >
          <div style={{
            position: "absolute",
            width: "70px",
            height: "46px",
            background: "linear-gradient(135deg,#1ea7ff,#0077ff)",
            borderRadius: "28px",
            top: 0,
            left: isClients ? 0 : "68px",
            transition: "left 0.3s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            fontWeight: 700,
          }}>
            {isClients ? "Clients" : "Cleaners"}
          </div>
        </div>
        <span style={{ fontSize: "18px", fontWeight: 700 }}>For Cleaners</span>
        <div style={{
          background: "rgba(255,149,0,.15)",
          border: "1px solid rgba(255,149,0,.4)",
          padding: "6px 14px",
          borderRadius: "20px",
          color: "#ff9500",
          fontSize: "14px",
          fontWeight: 700,
        }}>
          Save 20% annually
        </div>
      </div>

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", justifyContent: "center" }}>
        {plans.map((plan) => (
          <PlanCard key={plan.title} plan={plan} />
        ))}
      </div>
    </section>
  );
}
