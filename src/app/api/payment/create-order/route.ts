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
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json() as { type: "ONBOARDING" | "RENEWAL" };
  const { type } = body;

  if (!["ONBOARDING", "RENEWAL"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  // Check Razorpay keys are configured
  const keyId = process.env.RAZORPAY_KEY_ID ?? "";
  const keySecret = process.env.RAZORPAY_KEY_SECRET ?? "";

  if (!keyId || keyId.includes("XXXX") || !keySecret || keySecret.includes("XXXX")) {
    return NextResponse.json(
      { error: "Payment gateway not configured", step: "env_check", keyIdSet: !!keyId },
      { status: 503 }
    );
  }

  // Step 1: Create Razorpay order
  let orderId: string;
  let amount: number;
  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    amount = AMOUNTS[type];
    const receipt = `r_${session.user.id.slice(-8)}_${Date.now()}`.slice(0, 40);
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt,
      notes: { userId: session.user.id, type },
    });
    orderId = order.id;
  } catch (err: unknown) {
    const detail = err instanceof Error ? err.message : JSON.stringify(err);
    console.error("CREATE_ORDER_RAZORPAY_ERROR:", detail);
    return NextResponse.json(
      { error: "Razorpay order creation failed", step: "razorpay", detail },
      { status: 500 }
    );
  }

  // Step 2: Persist to DB
  try {
    await prisma.payment.create({
      data: {
        userId: session.user.id,
        razorpayOrderId: orderId,
        amount,
        type,
        status: "PENDING",
      },
    });
  } catch (err: unknown) {
    const detail = err instanceof Error ? err.message : JSON.stringify(err);
    console.error("CREATE_ORDER_DB_ERROR:", detail);
    return NextResponse.json(
      { error: "Database error — run `npx prisma generate` and redeploy", step: "prisma", detail },
      { status: 503 }
    );
  }

  return NextResponse.json({ orderId, amount, currency: "INR" });
}
