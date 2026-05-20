import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { pdf } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/billing/InvoicePDF";
import React from "react";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { paymentId } = await params;

  // Fetch payment — only owner can download their own invoice
  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, userId: session.user.id, status: "SUCCESS" },
  });

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });

  const invoiceNumber = `INV-${payment.createdAt.getFullYear()}-${String(
    payment.createdAt.getMonth() + 1
  ).padStart(2, "0")}-${payment.id.slice(-6).toUpperCase()}`;

  // @react-pdf/renderer v4 — use pdf().toBuffer()
  const buffer = await pdf(
    React.createElement(InvoicePDF, {
      invoiceNumber,
      payment: {
        id: payment.id,
        razorpayPaymentId: payment.razorpayPaymentId ?? "—",
        amount: payment.amount,
        type: payment.type,
        status: payment.status,
        createdAt: payment.createdAt.toISOString(),
      },
      user: {
        name: user?.name ?? "Customer",
        email: user?.email ?? "",
      },
    })
  ).toBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoiceNumber}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
