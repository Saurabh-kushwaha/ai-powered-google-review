import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import prisma from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Check subscription — redirect FREE users to payment
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { subscriptionStatus: true },
    });

    if (user?.subscriptionStatus === "FREE") {
      redirect("/onboarding/payment");
    }
  } catch {
    // Prisma client may not have been regenerated yet — skip gate
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Mobile Navigation Header */}
      <MobileNav />
      
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
