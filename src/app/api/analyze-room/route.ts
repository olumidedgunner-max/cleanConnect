import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const PROMPT = `Analyse this room image and return ONLY a valid JSON object. No markdown, no explanation.

JSON structure:
{
  "room_type": "Kitchen | Bedroom | Living Room | Toilet/Bathroom | Play Room | Other",
  "cleanliness_score": 7,
  "clutter_score": 5,
  "estimated_cleaning_hours": 4,
  "risk_level": "Low | Moderate | High | Extreme",
  "suggested_price_gbp": 80,
  "recommended_cleaners": 1,
  "reasoning": "One sentence summary of room condition."
}

Pricing rules:
- Clean room (score 1-3): minimum 2 hours
- Moderate dirt (score 4-6): add 50% to base hours
- Heavy/Extreme dirt (score 7-10): minimum 4 hours
- Base hourly rate: £20
- suggested_price_gbp = estimated_cleaning_hours × 20, rounded to nearest 5
- recommended_cleaners: 1 for standard, 2 for large/heavy, 3 for extreme

Return ONLY the JSON. No other text.`;

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
    }

    const { imageBase64, mediaType, jobId, roomKey, roomIndex, useHighAccuracy } = await req.json();

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    let messages: OpenAI.Chat.ChatCompletionMessageParam[];
    let imageUrl: string | null = null;

    if (imageBase64 && mediaType) {
      // Upload compressed image to Supabase Storage
      const supabase = getSupabase();
      const fileName = `${Date.now()}-${roomKey ?? "room"}-${roomIndex ?? 0}.jpg`;
      const buffer = Buffer.from(imageBase64, "base64");

      const { data: uploadData } = await supabase.storage
        .from("room-photos")
        .upload(fileName, buffer, { contentType: mediaType, upsert: false });

      if (uploadData) {
        const { data: urlData } = supabase.storage.from("room-photos").getPublicUrl(uploadData.path);
        imageUrl = urlData.publicUrl;
      }

      messages = [
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: `data:${mediaType};base64,${imageBase64}`, detail: "low" } },
            { type: "text", text: PROMPT },
          ],
        },
      ];
    } else {
      // No image — assume heavily dirty room, minimum 4 hours
      messages = [
        {
          role: "user",
          content: `No image provided. Return JSON for a heavily dirty room with minimum 4 hours: ${PROMPT}`,
        },
      ];
    }

    // gpt-4o-mini for standard jobs; gpt-4o for dispute/high-value analysis
    const model = useHighAccuracy ? "gpt-4o" : "gpt-4o-mini";

    const response = await openai.chat.completions.create({
      model,
      max_tokens: 512,
      messages,
    });

    const text = response.choices[0]?.message?.content ?? "";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const analysis = JSON.parse(cleaned);

    // Save analysis to Supabase
    if (jobId || imageUrl) {
      const supabase = getSupabase();
      await supabase.from("analyses").insert({
        job_id: jobId ?? null,
        room_key: roomKey ?? null,
        room_index: roomIndex ?? null,
        image_url: imageUrl,
        room_type: analysis.room_type,
        cleanliness_score: analysis.cleanliness_score,
        clutter_score: analysis.clutter_score,
        estimated_cleaning_hours: analysis.estimated_cleaning_hours,
        risk_level: analysis.risk_level,
        suggested_price_gbp: analysis.suggested_price_gbp,
        recommended_cleaners: analysis.recommended_cleaners,
        reasoning: analysis.reasoning,
      });
    }

    return NextResponse.json({ success: true, analysis, imageUrl });
  } catch (error) {
    console.error("Room analysis error:", error);
    const msg = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
