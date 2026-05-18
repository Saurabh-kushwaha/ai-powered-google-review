import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, TrendingUp, Users, ScanLine, Star, MessageSquare } from "lucide-react";
import { OverviewChart } from "@/components/dashboard/OverviewChart";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const business = await prisma.business.findFirst({
    where: {
      userId: session?.user?.id,
    },
  });

  if (!business) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
            <PlusCircle className="w-8 h-8 text-zinc-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">No business added yet</h2>
          <p className="text-zinc-500 max-w-sm mx-auto">
            Add your business details to generate your first QR code and start collecting AI-powered reviews.
          </p>
          <Link href="/dashboard/business/new" className={buttonVariants({ className: "mt-4" })}>
            Add Business
          </Link>
        </div>
      </div>
    );
  }

  // Fetch real statistics
  const totalScans = await prisma.scanEvent.count({
    where: { businessId: business.id }
  });

  const generatedReviews = await prisma.feedback.count({
    where: {
      businessId: business.id,
      sentiment: "POSITIVE",
      isRedirectedToGoogle: true,
    }
  });

  const privateFeedbacks = await prisma.feedback.count({
    where: {
      businessId: business.id,
      sentiment: "NEGATIVE"
    }
  });

  const conversionRate = totalScans > 0 ? Math.round((generatedReviews / totalScans) * 100) : 0;

  // Fetch recent activity
  const recentFeedbacks = await prisma.feedback.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  // Fetch chart data (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const scansLast7Days = await prisma.scanEvent.findMany({
    where: {
      businessId: business.id,
      createdAt: { gte: sevenDaysAgo }
    }
  });

  const reviewsLast7Days = await prisma.feedback.findMany({
    where: {
      businessId: business.id,
      createdAt: { gte: sevenDaysAgo },
      sentiment: "POSITIVE",
      isRedirectedToGoogle: true,
    }
  });

  // Group data by day
  const chartData = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    const nextD = new Date(d);
    nextD.setDate(nextD.getDate() + 1);

    const dayName = dayNames[d.getDay()];

    const scansForDay = scansLast7Days.filter((s: { createdAt: Date }) => s.createdAt.getTime() >= d.getTime() && s.createdAt.getTime() < nextD.getTime()).length;
    const reviewsForDay = reviewsLast7Days.filter((r: { createdAt: Date }) => r.createdAt.getTime() >= d.getTime() && r.createdAt.getTime() < nextD.getTime()).length;

    chartData.push({
      name: dayName,
      scans: scansForDay,
      reviews: reviewsForDay
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-zinc-500">Overview of your review performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <ScanLine className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalScans}</div>
            <p className="text-xs text-zinc-500">QR code scans</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews Generated</CardTitle>
            <Star className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{generatedReviews}</div>
            <p className="text-xs text-zinc-500">5-star AI reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Private Feedbacks</CardTitle>
            <Users className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{privateFeedbacks}</div>
            <p className="text-xs text-zinc-500">Negative reviews intercepted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-zinc-500">Scans to reviews</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={chartData} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest customer feedback.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentFeedbacks.length === 0 ? (
                <div className="flex items-center justify-center h-[200px] text-zinc-500 text-sm">
                  No activity yet.
                </div>
              ) : (
                recentFeedbacks.map((fb) => (
                  <div key={fb.id} className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${fb.sentiment === 'POSITIVE' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {fb.sentiment === 'POSITIVE' ? <Star className="w-4 h-4 fill-current" /> : <MessageSquare className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {fb.sentiment === 'POSITIVE' ? '5-Star Review Generated' : 'Private Feedback Received'}
                      </p>
                      <p className="text-sm text-zinc-500 line-clamp-2">
                        {fb.sentiment === 'POSITIVE' ? fb.aiGeneratedReview : fb.privateFeedback}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {new Date(fb.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
