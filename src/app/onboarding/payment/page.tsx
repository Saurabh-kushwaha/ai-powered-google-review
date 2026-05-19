"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { CheckCircle2, Loader2, QrCode, Zap, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
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
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open(): void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const FEATURES = [
  "AI-powered Google review generation",
  "Custom QR code for your business",
  "Real-time analytics dashboard",
  "Negative review interception",
  "Unlimited customer scans",
  "Priority support",
];

export default function OnboardingPaymentPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  const handlePay = async () => {
    setLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load payment gateway. Check your internet connection.");
        return;
      }

      // Create order
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "ONBOARDING" }),
      });

      const { orderId, amount } = await res.json();
      if (!res.ok || !orderId) {
        toast.error("Could not create payment order.");
        return;
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount,
        currency: "INR",
        name: "ReviewQR AI",
        description: "One-time Onboarding Fee",
        order_id: orderId,
        prefill: {
          name: session?.user?.name ?? "",
          email: session?.user?.email ?? "",
        },
        theme: { color: "#18181b" },
        handler: async (response: RazorpayResponse) => {
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
            toast.success("Payment successful! Welcome to ReviewQR AI 🎉");
            router.push("/dashboard");
          } else {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold">
            <QrCode className="w-3.5 h-3.5" /> ReviewQR AI
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
            One step away from<br />growing your reviews 🚀
          </h1>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            Activate your account to start collecting AI-powered Google reviews and intercepting negative feedback.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Features card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-6">
            <div>
              <h2 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50 mb-1">What you get</h2>
              <p className="text-sm text-zinc-500">Everything included in your plan.</p>
            </div>
            <ul className="space-y-3">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              {[
                { icon: Shield, text: "Secure payment" },
                { icon: Star, text: "Trusted by 500+ businesses" },
                { icon: Zap, text: "Instant activation" },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Icon className="w-3.5 h-3.5" /> {text}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing card */}
          <div className="bg-zinc-900 dark:bg-zinc-800 rounded-2xl p-8 text-white flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <p className="text-zinc-400 text-sm mb-1">One-time onboarding fee</p>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold">₹999</span>
                  <span className="text-zinc-400 mb-1.5 text-sm">one time</span>
                </div>
              </div>

              <div className="h-px bg-zinc-700" />

              <div>
                <p className="text-zinc-400 text-sm mb-1">Then, monthly maintenance</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold">₹299</span>
                  <span className="text-zinc-400 mb-1 text-sm">/ month</span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">Renew anytime from your billing dashboard.</p>
              </div>

              <div className="bg-zinc-800 dark:bg-zinc-700/50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between text-zinc-300">
                  <span>Onboarding fee</span><span>₹999</span>
                </div>
                <div className="flex justify-between text-zinc-400 text-xs">
                  <span>GST (18%)</span><span>₹179.82</span>
                </div>
                <div className="h-px bg-zinc-700 my-1" />
                <div className="flex justify-between font-semibold text-white">
                  <span>Total today</span><span>₹999</span>
                </div>
                <p className="text-xs text-zinc-500">* GST included in pricing</p>
              </div>
            </div>

            <div className="space-y-3 mt-8">
              <Button
                className="w-full h-12 text-base font-semibold bg-white text-zinc-900 hover:bg-zinc-100 dark:bg-white dark:text-zinc-900"
                onClick={handlePay}
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Processing...</>
                ) : (
                  "Pay ₹999 & Activate Account"
                )}
              </Button>
              <p className="text-xs text-zinc-500 text-center">
                Powered by Razorpay · UPI, Cards, NetBanking accepted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
