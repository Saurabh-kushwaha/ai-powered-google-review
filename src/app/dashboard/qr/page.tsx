import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import QRCodeDisplay from "@/components/dashboard/QRCodeDisplay";

export default async function QRGeneratorPage() {
  const session = await getServerSession(authOptions);
  
  const business = await prisma.business.findFirst({
    where: {
      userId: session?.user?.id,
    },
  });

  if (!business) {
    redirect("/dashboard/business/new");
  }

  // Use the environment variable NEXTAUTH_URL or fallback to localhost
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const reviewLink = `${baseUrl}/r/${business.shortLinkId}`;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">QR Generator</h1>
        <p className="text-zinc-500">Download and print your QR code to start collecting reviews.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <QRCodeDisplay link={reviewLink} businessName={business.name} />
        
        <div className="space-y-4">
          <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            <h3 className="font-semibold mb-2">How it works</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>Customer scans the QR code.</li>
              <li>They answer a few quick questions.</li>
              <li>AI generates a professional review.</li>
              <li>They are redirected to Google to paste and submit.</li>
            </ol>
          </div>
          
          <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <h3 className="font-semibold mb-2">Short Link</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                readOnly 
                value={reviewLink}
                className="flex-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm"
              />
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              You can also share this link directly via SMS or email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
