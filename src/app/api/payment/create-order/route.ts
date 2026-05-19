import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Razorpay from "razorpay";

// Amounts in paise
const AMOUNTS = {
  ONBOARDING: 99900, // ₹999
  RENEWAL:    29900, // ₹299
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type } = await request.json() as { type: "ONBOARDING" | "RENEWAL" };

    if (!["ONBOARDING", "RENEWAL"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // Check Razorpay keys are configured
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes("XXXX")) {
      console.error("CREATE_ORDER_ERROR: Razorpay keys not configured in .env");
      return NextResponse.json(
        { error: "Payment gateway not configured. Add your Razorpay keys to .env" },
        { status: 503 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const amount = AMOUNTS[type];

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${session.user.id}_${Date.now()}`,
      notes: { userId: session.user.id, type },
    });

    // Persist a PENDING payment record (requires `npx prisma generate` to have been run)
    await prisma.payment.create({
      data: {
        userId: session.user.id,
        razorpayOrderId: order.id,
        amount,
        type,
        status: "PENDING",
      },
    });

    return NextResponse.json({ orderId: order.id, amount, currency: "INR" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("CREATE_ORDER_ERROR:", msg);

    if (msg.toLowerCase().includes("payment") || msg.toLowerCase().includes("unknown field")) {
      return NextResponse.json(
        { error: "Database schema is outdated. Stop the server, run `npx prisma generate`, then restart." },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: "Failed to create order", detail: msg }, { status: 500 });
  }
}
