import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import BusinessSettingsForm from "@/components/dashboard/BusinessSettingsForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Link as LinkIcon, Calendar } from "lucide-react";

export default async function BusinessSettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const business = await prisma.business.findFirst({
    where: {
      userId: session.user.id,
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
        <h1 className="text-3xl font-bold tracking-tight">Business Settings</h1>
        <p className="text-zinc-500">Manage your business profile and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Settings Form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5 text-blue-500" />
                Business Profile
              </CardTitle>
              <CardDescription>
                Update your business name, category, and where customers are redirected.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BusinessSettingsForm business={business} />
            </CardContent>
          </Card>
        </div>

        {/* Side Info Cards */}
        <div className="space-y-6">
          <Card className="bg-zinc-50 dark:bg-zinc-900/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-violet-500" />
                Your Short Link
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-white dark:bg-zinc-950 rounded-md border border-zinc-200 dark:border-zinc-800 break-all text-sm font-medium">
                {reviewLink}
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                This link is permanently assigned to your business ID: <span className="font-mono bg-zinc-200 dark:bg-zinc-800 px-1 rounded">{business.shortLinkId}</span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-50 dark:bg-zinc-900/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                System Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Registered</span>
                  <span className="font-medium">{business.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Status</span>
                  <span className="font-medium text-emerald-500">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
