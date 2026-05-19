import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json();

    // 1. Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // 2. Find the pending payment
    const payment = await prisma.payment.findFirst({
      where: { razorpayOrderId: razorpay_order_id, userId: session.user.id },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // 3. Update payment to SUCCESS
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "SUCCESS",
      },
    });

    // 4. Update user subscription
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + 30); // +30 days

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        subscriptionStatus: "ACTIVE",
        planActivatedAt: payment.type === "ONBOARDING" ? now : undefined,
        planExpiresAt: expiresAt,
      },
    });

    return NextResponse.json({ success: true, type: payment.type });
  } catch (error) {
    console.error("VERIFY_PAYMENT_ERROR", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
