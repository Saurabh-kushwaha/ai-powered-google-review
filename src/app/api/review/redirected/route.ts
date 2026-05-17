import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { businessId } = await request.json();

    if (!businessId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find the latest positive feedback for this business in the last hour and mark it redirected
    // (Assuming simple sequential flow for MVP)
    const latestFeedback = await prisma.feedback.findFirst({
      where: {
        businessId,
        sentiment: "POSITIVE",
        isRedirectedToGoogle: false,
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    if (latestFeedback) {
      await prisma.feedback.update({
        where: { id: latestFeedback.id },
        data: { isRedirectedToGoogle: true }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("REDIRECT_LOG_ERROR", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
