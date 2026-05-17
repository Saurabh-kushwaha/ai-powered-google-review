"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QrCode, Star, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 overflow-hidden font-sans">
      {/* Navbar */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <QrCode className="w-6 h-6" />
            ReviewQR AI
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-zinc-600 transition-colors">Login</Link>
            <Button asChild size="sm" className="rounded-full px-6">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-sm font-medium mb-4 border border-zinc-200 dark:border-zinc-800"
          >
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            Introducing AI-Powered Reviews
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight"
          >
            Turn every customer into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">5-star reviewer</span>.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            Frictionless QR codes. Instant AI-generated reviews. Smart negative feedback protection. Boost your local business ranking on autopilot.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button asChild size="lg" className="rounded-full px-8 text-base h-14 group">
              <Link href="/register">
                Start for free <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8 text-base h-14">
              View Demo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Product Preview Mockup */}
      <section className="px-6 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="max-w-5xl mx-auto relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-violet-500/10 blur-3xl -z-10 rounded-full transform -translate-y-1/2"></div>
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
            <div className="flex-1 p-12 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-4">Customer scans. AI writes. They post.</h3>
              <p className="text-zinc-500 mb-6">Writing a review is hard. We make it 1-click easy. Customers answer 4 simple questions and Gemini AI writes a professional review for them to paste on Google.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 font-medium"><CheckCircle className="w-5 h-5 text-blue-500" /> Frictionless Mobile UX</li>
                <li className="flex items-center gap-3 font-medium"><CheckCircle className="w-5 h-5 text-blue-500" /> Multiple Tone Options</li>
                <li className="flex items-center gap-3 font-medium"><CheckCircle className="w-5 h-5 text-blue-500" /> Auto-copy to Clipboard</li>
              </ul>
            </div>
            <div className="flex-1 bg-zinc-100 dark:bg-zinc-950 p-8 flex items-center justify-center border-l border-zinc-200 dark:border-zinc-800">
              <div className="w-[280px] h-[580px] bg-white dark:bg-zinc-900 rounded-[2.5rem] border-8 border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden relative">
                {/* Mobile App Mockup */}
                <div className="p-6 h-full flex flex-col">
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full mx-auto mb-4 mt-8 flex items-center justify-center text-2xl">🍽️</div>
                  <h4 className="text-center font-bold text-lg mb-2">Rate your experience</h4>
                  <div className="flex justify-center gap-1 mb-8">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-4 mt-auto mb-4 border border-zinc-100 dark:border-zinc-800 shadow-sm text-sm italic">
                    "Absolutely loved the food! The service was incredibly fast and the ambience was perfect for a Sunday brunch. Highly recommend!"
                  </div>
                  <Button className="w-full rounded-full mt-auto mb-2 bg-blue-600 hover:bg-blue-700 text-white">Copy & Go to Google</Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to grow your reputation</h2>
            <p className="text-zinc-500">Built for modern businesses who want to leverage AI for local SEO dominance.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-emerald-500" />}
              title="Negative Feedback Protection"
              description="Intercept bad reviews. Customers who rate under 4 stars are diverted to a private feedback form instead of Google."
            />
            <FeatureCard 
              icon={<TrendingUp className="w-6 h-6 text-blue-500" />}
              title="Analytics Dashboard"
              description="Track scan events, conversion rates, and sentiment analysis to understand your customer satisfaction."
            />
            <FeatureCard 
              icon={<QrCode className="w-6 h-6 text-violet-500" />}
              title="Custom QR Generation"
              description="Generate beautifully branded QR codes ready to print and place on tables, counters, or receipts."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-center">
        <div className="flex items-center justify-center gap-2 font-bold text-lg mb-4">
          <QrCode className="w-5 h-5" />
          ReviewQR AI
        </div>
        <p className="text-zinc-500 text-sm">© 2026 ReviewQR AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-900 rounded-xl flex items-center justify-center mb-6 border border-zinc-100 dark:border-zinc-800">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-zinc-500 leading-relaxed">{description}</p>
    </div>
  );
}
