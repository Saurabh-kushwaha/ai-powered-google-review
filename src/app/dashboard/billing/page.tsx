"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  CheckCircle2, XCircle, Clock, CreditCard,
  Loader2, RefreshCw, Receipt, AlertTriangle, Download,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Payment {
  id: string;
  amount: number;
  type: string;
  status: string;
  razorpayPaymentId: string | null;
  createdAt: string;
}

interface BillingData {
  subscriptionStatus: string;
  planActivatedAt: string | null;
  planExpiresAt: string | null;
  payments: Payment[];
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open(): void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
  handler: (r: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  modal?: { ondismiss?: () => void };
}

function StatusBadge({ status }: { status: string }) {
  if (status === "ACTIVE")
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium"><CheckCircle2 className="w-3.5 h-3.5" /> Active</span>;
  if (status === "EXPIRED")
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium"><XCircle className="w-3.5 h-3.5" /> Expired</span>;
  return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium"><Clock className="w-3.5 h-3.5" /> Free</span>;
}

function daysLeft(dateStr: string | null) {
  if (!dateStr) return 0;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function BillingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [data, setData] = useState<BillingData | null>(null);
  const [fetching, setFetching] = useState(true);
  const [renewLoading, setRenewLoading] = useState(false);

  const fetchBilling = async () => {
    setFetching(true);
    const res = await fetch("/api/billing");
    if (res.ok) setData(await res.json());
    setFetching(false);
  };

  useEffect(() => { fetchBilling(); }, []);

  const loadRazorpayScript = (): Promise<boolean> =>
    new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) return resolve(true);
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleRenew = async () => {
    setRenewLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) { toast.error("Payment gateway unavailable."); return; }

      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "RENEWAL" }),
      });

      const { orderId, amount } = await res.json();
      if (!orderId) { toast.error("Could not create order."); return; }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount,
        currency: "INR",
        name: "ReviewQR AI",
        description: "Monthly Renewal — ₹299",
        order_id: orderId,
        prefill: { name: session?.user?.name ?? "", email: session?.user?.email ?? "" },
        theme: { color: "#18181b" },
        handler: async (response) => {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          if (verifyRes.ok) {
            toast.success("Subscription renewed for 30 days! ✅");
            router.refresh();
            fetchBilling();
          } else {
            toast.error("Verification failed. Contact support.");
          }
          setRenewLoading(false);
        },
        modal: { ondismiss: () => setRenewLoading(false) },
      };

      new window.Razorpay(options).open();
    } catch {
      toast.error("Something went wrong.");
      setRenewLoading(false);
    }
  };

  const days = daysLeft(data?.planExpiresAt ?? null);
  const isExpiringSoon = days > 0 && days <= 5;

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-zinc-500 mt-1">Manage your subscription and payment history.</p>
      </div>

      {fetching ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        </div>
      ) : (
        <>
          {/* Status card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Subscription Status</CardTitle>
                  <CardDescription>Your current plan and expiry.</CardDescription>
                </div>
                <StatusBadge status={data?.subscriptionStatus ?? "FREE"} />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    label: "Plan",
                    value: data?.subscriptionStatus === "FREE" ? "Free (Unactivated)" : "ReviewQR AI",
                  },
                  {
                    label: "Activated On",
                    value: data?.planActivatedAt
                      ? new Date(data.planActivatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                      : "—",
                  },
                  {
                    label: "Renews / Expires",
                    value: data?.planExpiresAt
                      ? new Date(data.planExpiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                      : "—",
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs text-zinc-500 mb-1">{label}</p>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{value}</p>
                  </div>
                ))}
              </div>

              {/* Expiry warning */}
              {isExpiringSoon && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 text-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  Your subscription expires in <strong>{days} day{days !== 1 ? "s" : ""}</strong>. Renew now to avoid interruption.
                </div>
              )}

              {data?.subscriptionStatus === "EXPIRED" && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-sm">
                  <XCircle className="w-5 h-5 shrink-0" />
                  Your subscription has expired. Renew to regain full access.
                </div>
              )}

              {/* Renewal section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-800 dark:to-zinc-900 text-white">
                <div>
                  <p className="font-semibold text-lg">Renew for ₹299 / month</p>
                  <p className="text-zinc-400 text-sm mt-0.5">Extend your access by 30 days.</p>
                </div>
                <Button
                  onClick={handleRenew}
                  disabled={renewLoading}
                  className="bg-white text-zinc-900 hover:bg-zinc-100 gap-2 shrink-0"
                >
                  {renewLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Renew Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment history */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" /> Payment History
              </CardTitle>
              <CardDescription>Your last 10 transactions.</CardDescription>
            </CardHeader>
            <CardContent>
              {!data?.payments?.length ? (
                <div className="flex flex-col items-center justify-center h-32 text-zinc-400 gap-2">
                  <CreditCard className="w-8 h-8" />
                  <p className="text-sm">No payments yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-zinc-500 border-b border-zinc-100 dark:border-zinc-800">
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Type</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Payment ID</th>
                        <th className="pb-3 font-medium">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {data.payments.map((p) => (
                        <tr key={p.id}>
                          <td className="py-3 text-zinc-600 dark:text-zinc-400">
                            {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${p.type === "ONBOARDING" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"}`}>
                              {p.type === "ONBOARDING" ? "Onboarding" : "Renewal"}
                            </span>
                          </td>
                          <td className="py-3 font-medium">₹{(p.amount / 100).toFixed(0)}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${p.status === "SUCCESS" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : p.status === "FAILED" ? "bg-red-100 dark:bg-red-900/30 text-red-600" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 text-zinc-400 font-mono text-xs truncate max-w-[120px]">
                            {p.razorpayPaymentId ?? "—"}
                          </td>
                          <td className="py-3">
                            {p.status === "SUCCESS" && (
                              <a
                                href={`/api/billing/invoice/${p.id}`}
                                download
                                className="inline-flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                              >
                                <Download className="w-3.5 h-3.5" />
                                PDF
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
