import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReviewFlow from "@/components/review/ReviewFlow";

export default async function CustomerReviewPage({ params }: { params: Promise<{ shortLinkId: string }> }) {
  const resolvedParams = await params;
  const business = await prisma.business.findUnique({
    where: {
      shortLinkId: resolvedParams.shortLinkId,
    },
  });

  if (!business) {
    notFound();
  }

  // Log scan event asynchronously (we don't await it to not block the render)
  prisma.scanEvent.create({
    data: {
      businessId: business.id,
      deviceType: "UNKNOWN", // We can parse user-agent if needed, or pass from client
    }
  }).catch(console.error);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center p-4">
      <div className="w-full max-w-md mt-8">
        <ReviewFlow business={business} />
      </div>
    </div>
  );
}
