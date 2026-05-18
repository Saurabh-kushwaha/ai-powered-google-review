import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { businessId, overall, privateFeedback } = await request.json();

    if (!businessId || !overall) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        businessId,
        overallRating: overall,
        privateFeedback,
        sentiment: "NEGATIVE",
        isRedirectedToGoogle: false,
      }
    });

    return NextResponse.json({ success: true, feedback });
  } catch (error: unknown) {
    console.error("SAVE_FEEDBACK_ERROR", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
