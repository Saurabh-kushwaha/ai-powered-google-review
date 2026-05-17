"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, QrCode } from "lucide-react";
import Sidebar from "./Sidebar";
import Link from "next/link";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex md:hidden items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-md flex items-center justify-center">
          <QrCode className="w-5 h-5 text-white dark:text-zinc-900" />
        </div>
        <span className="font-bold tracking-tight">ReviewQR AI</span>
      </Link>
      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
          <Menu className="w-6 h-6" />
          <span className="sr-only">Toggle navigation</span>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar className="border-none" onClose={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
