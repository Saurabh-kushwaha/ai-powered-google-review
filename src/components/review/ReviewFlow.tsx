"use client";
import Image from "next/image";

import { useState } from "react";
import { Business } from "@prisma/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2, Copy, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type Step = "OVERALL" | "DETAILED" | "GENERATING" | "RESULT" | "PRIVATE_FEEDBACK" | "THANKS";

const CATEGORY_ICONS: Record<string, string> = {
  // Values from new-business form (lowercase)
  restaurant: "🍽️",
  hotel: "🏨",
  salon: "💇",
  clinic: "🏥",
  retail: "🛍️",
  // Values from settings form (saved as uppercase, lowercased by getCategoryIcon)
  service: "🤝",
  healthcare: "🏥",
  beauty: "💅",
  other: "🏪",
  // Extra aliases
  cafe: "☕",
  bakery: "🥐",
  bar: "🍸",
  spa: "💆",
  gym: "🏋️",
  hospital: "🏥",
  pharmacy: "💊",
  dentist: "🦷",
  school: "🏫",
  bank: "🏦",
  grocery: "🛒",
  supermarket: "🛒",
  automotive: "🚗",
  garage: "🔧",
  laundry: "👕",
  pet: "🐾",
  travel: "✈️",
  tech: "💻",
};

function getCategoryIcon(category?: string | null): string {
  if (!category) return "🏪";
  const key = category.toLowerCase().trim();
  // Exact match first
  if (CATEGORY_ICONS[key]) return CATEGORY_ICONS[key];
  // Partial match (handles things like "fast food restaurant")
  for (const [k, icon] of Object.entries(CATEGORY_ICONS)) {
    if (key.includes(k) || k.includes(key)) return icon;
  }
  return "🏪";
}

/** Category-specific rating dimensions shown in the DETAILED step */
const CATEGORY_QUESTIONS: Record<string, { key: string; label: string; emoji: string }[]> = {
  restaurant: [
    { key: "food",        label: "Food Quality",    emoji: "🍽️" },
    { key: "service",     label: "Service Speed",   emoji: "⚡" },
    { key: "ambience",    label: "Ambience",         emoji: "✨" },
    { key: "cleanliness", label: "Cleanliness",      emoji: "🧹" },
  ],
  hotel: [
    { key: "rooms",       label: "Room Comfort",    emoji: "🛏️" },
    { key: "cleanliness", label: "Cleanliness",      emoji: "🧹" },
    { key: "service",     label: "Staff Service",   emoji: "🤝" },
    { key: "value",       label: "Value for Money", emoji: "💰" },
  ],
  retail: [
    { key: "products",    label: "Product Range",   emoji: "📦" },
    { key: "staff",       label: "Staff Helpfulness",emoji: "🤝" },
    { key: "cleanliness", label: "Store Cleanliness",emoji: "🧹" },
    { key: "value",       label: "Value for Money", emoji: "💰" },
  ],
  beauty: [
    { key: "skill",       label: "Skill & Expertise",emoji: "✂️" },
    { key: "service",     label: "Staff Friendliness",emoji: "😊" },
    { key: "cleanliness", label: "Cleanliness",      emoji: "🧹" },
    { key: "value",       label: "Value for Money", emoji: "💰" },
  ],
  healthcare: [
    { key: "care",        label: "Quality of Care", emoji: "❤️" },
    { key: "staff",       label: "Staff Attitude",  emoji: "😊" },
    { key: "wait",        label: "Wait Time",        emoji: "⏳" },
    { key: "cleanliness", label: "Cleanliness",      emoji: "🧹" },
  ],
  service: [
    { key: "quality",     label: "Work Quality",    emoji: "⭐" },
    { key: "communication",label: "Communication",  emoji: "💬" },
    { key: "timeliness",  label: "Timeliness",       emoji: "⏱️" },
    { key: "value",       label: "Value for Money", emoji: "💰" },
  ],
  // ── New categories ──────────────────────────────────────────────────────────
  cafe: [
    { key: "drinks",      label: "Drinks Quality",  emoji: "☕" },
    { key: "food",        label: "Food Quality",    emoji: "🥐" },
    { key: "ambience",    label: "Ambience",         emoji: "✨" },
    { key: "value",       label: "Value for Money", emoji: "💰" },
  ],
  bakery: [
    { key: "food",        label: "Baked Goods Quality", emoji: "🥐" },
    { key: "freshness",   label: "Freshness",        emoji: "🌟" },
    { key: "service",     label: "Staff Friendliness",emoji: "😊" },
    { key: "value",       label: "Value for Money", emoji: "💰" },
  ],
  bar: [
    { key: "drinks",      label: "Drinks Quality",  emoji: "🍸" },
    { key: "service",     label: "Bartender Service",emoji: "⚡" },
    { key: "ambience",    label: "Atmosphere",       emoji: "✨" },
    { key: "value",       label: "Value for Money", emoji: "💰" },
  ],
  grocery: [
    { key: "products",    label: "Product Variety", emoji: "🛒" },
    { key: "freshness",   label: "Freshness",        emoji: "🌿" },
    { key: "cleanliness", label: "Store Cleanliness",emoji: "🧹" },
    { key: "value",       label: "Value for Money", emoji: "💰" },
  ],
  gym: [
    { key: "equipment",   label: "Equipment Quality",emoji: "🏋️" },
    { key: "cleanliness", label: "Cleanliness",      emoji: "🧹" },
    { key: "staff",       label: "Staff & Trainers", emoji: "💪" },
    { key: "value",       label: "Value for Money", emoji: "💰" },
  ],
  pharmacy: [
    { key: "stock",       label: "Stock Availability",emoji: "💊" },
    { key: "staff",       label: "Staff Knowledge",  emoji: "😊" },
    { key: "wait",        label: "Wait Time",         emoji: "⏳" },
    { key: "value",       label: "Value for Money",  emoji: "💰" },
  ],
  dentist: [
    { key: "care",        label: "Quality of Care",  emoji: "🦷" },
    { key: "staff",       label: "Staff Attitude",   emoji: "😊" },
    { key: "wait",        label: "Wait Time",         emoji: "⏳" },
    { key: "cleanliness", label: "Cleanliness",       emoji: "🧹" },
  ],
  automotive: [
    { key: "quality",     label: "Work Quality",     emoji: "🔧" },
    { key: "timeliness",  label: "Timeliness",        emoji: "⏱️" },
    { key: "communication",label: "Communication",   emoji: "💬" },
    { key: "value",       label: "Value for Money",  emoji: "💰" },
  ],
  pet: [
    { key: "care",        label: "Pet Care Quality", emoji: "🐾" },
    { key: "staff",       label: "Staff Friendliness",emoji: "😊" },
    { key: "cleanliness", label: "Cleanliness",       emoji: "🧹" },
    { key: "value",       label: "Value for Money",  emoji: "💰" },
  ],
  tech: [
    { key: "products",    label: "Product Range",    emoji: "💻" },
    { key: "staff",       label: "Staff Knowledge",  emoji: "🤝" },
    { key: "service",     label: "After-Sales Service",emoji: "⭐" },
    { key: "value",       label: "Value for Money",  emoji: "💰" },
  ],
  travel: [
    { key: "service",     label: "Service Quality",  emoji: "✈️" },
    { key: "communication",label: "Communication",   emoji: "💬" },
    { key: "value",       label: "Value for Money",  emoji: "💰" },
    { key: "experience",  label: "Overall Experience",emoji: "🌍" },
  ],
  school: [
    { key: "teaching",    label: "Teaching Quality", emoji: "📚" },
    { key: "staff",       label: "Staff Attitude",   emoji: "😊" },
    { key: "facilities",  label: "Facilities",        emoji: "🏫" },
    { key: "value",       label: "Value for Money",  emoji: "💰" },
  ],
  bank: [
    { key: "service",     label: "Customer Service", emoji: "🤝" },
    { key: "wait",        label: "Wait Time",         emoji: "⏳" },
    { key: "digital",     label: "Digital Services", emoji: "📱" },
    { key: "trust",       label: "Trustworthiness",  emoji: "🔒" },
  ],
};

const DEFAULT_QUESTIONS = [
  { key: "quality",     label: "Overall Quality",  emoji: "⭐" },
  { key: "service",     label: "Customer Service", emoji: "🤝" },
  { key: "cleanliness", label: "Cleanliness",      emoji: "🧹" },
  { key: "value",       label: "Value for Money", emoji: "💰" },
];

function getQuestions(category?: string | null) {
  if (!category) return DEFAULT_QUESTIONS;
  const key = category.toLowerCase().trim();
  if (CATEGORY_QUESTIONS[key]) return CATEGORY_QUESTIONS[key];
  for (const [k, qs] of Object.entries(CATEGORY_QUESTIONS)) {
    if (key.includes(k) || k.includes(key)) return qs;
  }
  return DEFAULT_QUESTIONS;
}

export default function ReviewFlow({ business }: { business: Business }) {
  const [step, setStep] = useState<Step>("OVERALL");
  const [overall, setOverall] = useState(0);
  const [details, setDetails] = useState<Record<string, number>>({});
  const [tone, setTone] = useState("friendly");
  const [privateFeedback, setPrivateFeedback] = useState("");
  const [generatedReview, setGeneratedReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOverallSelect = (rating: number) => {
    setOverall(rating);
    if (rating >= 4) {
      setStep("DETAILED");
    } else {
      setStep("PRIVATE_FEEDBACK");
    }
  };

  const handleDetailSelect = (category: string, rating: number) => {
    setDetails(prev => ({ ...prev, [category]: rating }));
  };

  const submitPositive = async () => {
    setStep("GENERATING");
    try {
      const res = await fetch("/api/review/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: business.id, overall, details, tone })
      });
      const data = await res.json();
      if (res.ok) {
        setGeneratedReview(data.reviewText);
        setStep("RESULT");
      } else {
        toast.error("Failed to generate review.");
        setStep("DETAILED");
      }
    } catch {
      toast.error("An error occurred.");
      setStep("DETAILED");
    }
  };

  const submitNegative = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/review/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: business.id, overall, privateFeedback })
      });
      setStep("THANKS");
    } catch {
      toast.error("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyAndRedirect = async () => {
    try {
      await navigator.clipboard.writeText(generatedReview);
      toast.success("Copied to clipboard!");
      
      // Update stats to show redirection happened
      await fetch("/api/review/redirected", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: business.id })
      });

      // Redirect to Google Review URL
      if (business.googleReviewUrl) {
        window.location.href = business.googleReviewUrl;
      }
    } catch {
      toast.error("Failed to copy text.");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {step === "OVERALL" && (
        <motion.div key="overall" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-2xl">
                {business.logoUrl ? (
                  <Image src={business.logoUrl} alt="Logo" width={64} height={64} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-3xl" role="img" aria-label={business.category ?? "business"}>
                    {getCategoryIcon(business.category)}
                  </span>
                )}
              </div>
              <CardTitle className="text-2xl">Rate your experience</CardTitle>
              <CardDescription>How was your visit to {business.name}?</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center gap-2 pb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleOverallSelect(star)}
                  className="p-2 transition-transform hover:scale-110 active:scale-95"
                >
                  <Star className={`w-10 h-10 ${overall >= star ? "fill-yellow-400 text-yellow-400" : "text-zinc-300 dark:text-zinc-700"}`} />
                </button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === "PRIVATE_FEEDBACK" && (
        <motion.div key="private" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          <Card>
            <CardHeader>
              <CardTitle>We&apos;re sorry to hear that</CardTitle>
              <CardDescription>Please let us know how we can improve.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="What went wrong during your visit?" 
                rows={4}
                value={privateFeedback}
                onChange={(e) => setPrivateFeedback(e.target.value)}
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={submitNegative} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      {step === "THANKS" && (
        <motion.div key="thanks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          <Card className="text-center py-8">
            <CardContent className="space-y-4 flex flex-col items-center">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
              <CardTitle>Thank you for your feedback</CardTitle>
              <CardDescription>We will use your comments to improve our service.</CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === "DETAILED" && (
        <motion.div key="detailed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          <Card>
            <CardHeader>
              <CardTitle>Awesome! Tell us more</CardTitle>
              <CardDescription>Help us craft the perfect review for you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {getQuestions(business.category).map((cat) => (
                <div key={cat.key} className="flex items-center justify-between gap-4">
                  <span className="font-medium text-sm flex items-center gap-2">
                    <span className="text-lg">{cat.emoji}</span>
                    {cat.label}
                  </span>
                  <div className="flex gap-1 shrink-0">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => handleDetailSelect(cat.key, star)}>
                        <Star className={`w-6 h-6 ${(details[cat.key] ?? 0) >= star ? "fill-yellow-400 text-yellow-400" : "text-zinc-200 dark:text-zinc-800"}`} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <span className="font-medium text-sm block mb-2">Review Tone</span>
                <div className="flex gap-2">
                  {["friendly", "professional", "short"].map((t) => (
                    <Button 
                      key={t} 
                      variant={tone === t ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTone(t)}
                      className="capitalize"
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={submitPositive}>
                Generate My Review ✨
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      {step === "GENERATING" && (
        <motion.div key="generating" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          <Card className="text-center py-12">
            <CardContent className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <CardTitle>Writing your review...</CardTitle>
              <CardDescription>Our AI is crafting the perfect response.</CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === "RESULT" && (
        <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          <Card>
            <CardHeader>
              <CardTitle>Your Review is Ready!</CardTitle>
              <CardDescription>Copy this text and paste it on Google.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-md text-sm italic">
                &quot;{generatedReview}&quot;
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button className="w-full gap-2 py-6 text-md font-semibold" onClick={copyAndRedirect}>
                <Copy className="w-5 h-5" /> Copy & Go to Google
              </Button>
              <Button variant="ghost" size="sm" onClick={submitPositive}>
                Regenerate
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
