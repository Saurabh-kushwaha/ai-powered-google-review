import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, category, googleReviewUrl } = body;

    if (!name || !category || !googleReviewUrl) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Generate a random 6 character string for shortLinkId
    const shortLinkId = Math.random().toString(36).substring(2, 8).toUpperCase();

    const business = await prisma.business.create({
      data: {
        name,
        category,
        googleReviewUrl,
        shortLinkId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ message: "Business created", business }, { status: 201 });
  } catch (error: any) {
    console.error("BUSINESS_CREATE_ERROR", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const businesses = await prisma.business.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json(businesses);
  } catch (error: any) {
    console.error("BUSINESS_GET_ERROR", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
