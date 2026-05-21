import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const PROMPT = `Analyse this room image and return ONLY a valid JSON object with no extra text, markdown, or explanation.

Use exactly this JSON structure:
{
  "room_type": "Kitchen | Bedroom | Living Room | Toilet / Bathroom | Play Room | Other",
  "room_size": "Small | Medium | Large | Very Large",
  "dirtiness_score": 7,
  "dirtiness_level": "Light | Moderate | Heavy | Extreme",
  "issues_detected": ["list", "of", "issues", "found"],
  "base_hours": 2,
  "size_multiplier": 1.5,
  "dirt_multiplier": 2,
  "estimated_hours": 6,
  "hourly_rate": 20,
  "price": 120,
  "condition_summary": "One sentence describing the room condition."
}

Pricing rules you MUST follow:
- base_hours: Kitchen=2, Toilet/Bathroom=1.5, Living Room=1.5, Bedroom=1, Play Room=1, Other=1
- size_multiplier: Small=1, Medium=1.5, Large=2, Very Large=2.5
- dirt_multiplier: dirtiness_score 1-3 = 1, score 4-6 = 1.5, score 7-8 = 2, score 9-10 = 3
- estimated_hours = base_hours × size_multiplier × dirt_multiplier
- price = estimated_hours × 20
- Round price to nearest 5

Issues to look for: clutter, stains, rubbish, dirty dishes, mould, dust, grease, laundry, bathroom stains, general mess.

Return ONLY the JSON object. No other text.`;

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mediaType } = await req.json();

    if (!imageBase64 || !mediaType) {
      return NextResponse.json({ error: "imageBase64 and mediaType are required" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
                data: imageBase64,
              },
            },
            { type: "text", text: PROMPT },
          ],
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    // Strip any markdown code fences if present
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const analysis = JSON.parse(cleaned);

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error("Room analysis error:", error);
    const msg = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
