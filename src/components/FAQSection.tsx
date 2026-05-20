"use client";
import { useState } from "react";

const faqs = [
  { q: "Can I switch between tiers at any time?", a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle. Upgrades are activated immediately." },
  { q: "Is there a free trial for premium plans?", a: "CleanConnect Plus offers a 30-day free trial. CleanConnect Platinum and Elite Partner offer a 14-day free trial. No credit card required to start." },
  { q: "What happens to my active jobs if I downgrade?", a: "All active jobs continue to completion under the terms they were booked. Changes to platform fees and features only apply to new bookings after the downgrade." },
  { q: "How does the escrow system work?", a: "Payment is held securely by CleanConnect from the moment you book. Funds are released to the cleaner only after you confirm the job is complete or after the 48-hour auto-release window." },
  { q: "Are cleaners background checked?", a: "All cleaners undergo identity verification and a standard background check. Premium Background Check add-on provides enhanced criminal record screening and full history details." },
  { q: "What is the cancellation policy?", a: "Cancellations made 24+ hours before a booking are fully refunded. Cancellations within 24 hours may incur a small fee to compensate the cleaner for reserved time." },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section style={{ padding: "90px 30px", background: "#0a1420" }}>
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
          Frequently Asked Questions
        </h2>
        <p style={{ fontSize: "20px", color: "#9fb0c1" }}>Everything you need to know about CleanConnect Premium</p>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{
            background: "#0d1727",
            borderRadius: "18px",
            marginBottom: "18px",
            border: "1px solid rgba(255,255,255,.06)",
            overflow: "hidden",
          }}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              style={{
                width: "100%",
                padding: "25px",
                fontSize: "19px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "transparent",
                border: "none",
                color: "white",
                textAlign: "left",
              }}
            >
              {faq.q}
              <span style={{ fontSize: "24px", transition: "transform 0.3s", transform: openIndex === i ? "rotate(45deg)" : "none", flexShrink: 0, marginLeft: "16px" }}>+</span>
            </button>
            {openIndex === i && (
              <div style={{ padding: "0 25px 25px", color: "#9fb0c1", lineHeight: 1.7 }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
