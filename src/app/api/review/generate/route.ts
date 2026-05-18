import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    const { businessId, overall, details, tone } = await request.json();

    if (!businessId || !overall) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const business = await prisma.business.findUnique({
      where: { id: businessId }
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    // Call Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    let reviewText = "Had a great time here! Highly recommended.";

    if (apiKey && apiKey !== "your-gemini-api-key") {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Write a Google review for a ${business.category || 'business'} named "${business.name}".
      The overall rating is ${overall} out of 5 stars.
      Specific ratings (out of 5):
      - Food: ${details?.food || 'N/A'}
      - Service: ${details?.service || 'N/A'}
      - Ambience: ${details?.ambience || 'N/A'}
      - Cleanliness: ${details?.cleanliness || 'N/A'}
      
      The tone should be ${tone || 'friendly'}.
      Do not include any hashtags or placeholders. Make it sound natural and authentic. Keep it under 3 sentences.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (response.text) {
        reviewText = response.text.trim().replace(/^["']|["']$/g, '');
      }
    } else {
      // Fallback if no API key
      reviewText = `Absolutely loved my experience at ${business.name}! The service was fantastic and the food was exactly what I was looking for. I would definitely come back again.`;
    }

    // Save Feedback record
    await prisma.feedback.create({
      data: {
        businessId,
        overallRating: overall,
        foodRating: details?.food || null,
        serviceRating: details?.service || null,
        ambienceRating: details?.ambience || null,
        aiGeneratedReview: reviewText,
        toneUsed: tone,
        sentiment: "POSITIVE",
      }
    });

    return NextResponse.json({ reviewText });
  } catch (error: unknown) {
    console.error("GENERATE_REVIEW_ERROR", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
