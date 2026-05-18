"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { QrCode, Star, ShieldCheck, ArrowRight, CheckCircle, Zap, Globe, MessageSquare, BarChart3, Lock } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-50 overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* Premium Background: Dotted Grid + Glowing Auras */}
      <div className="fixed inset-0 pointer-events-none -z-10 flex justify-center">
        {/* Dotted Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Intense Animated Glowing Orbs */}
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-600/30 dark:bg-blue-600/20 blur-[120px] animate-blob mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-violet-600/30 dark:bg-violet-600/20 blur-[120px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen" />
      </div>

      {/* Navbar */}
      <nav className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 border-b",
        scrolled 
          ? "bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 shadow-sm py-2" 
          : "bg-transparent border-transparent py-4"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-xl tracking-tighter">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-lg">
              <QrCode className="w-5 h-5 text-white dark:text-black" />
            </div>
            ReviewQR
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors">Log in</Link>
            <Link href="/register" className={cn(buttonVariants({ size: "sm" }), "rounded-full px-6 shadow-xl shadow-black/5 dark:shadow-white/5 font-semibold")}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-6 relative">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          
          {/* Floating UI Elements (Hero Orbits) */}
          <motion.div 
            animate={{ y: [0, -15, 0], rotate: [0, -2, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="hidden lg:flex absolute -left-12 top-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-2xl items-center gap-4 backdrop-blur-md"
          >
            <div className="flex -space-x-2">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400 drop-shadow-md" />)}
            </div>
            <div className="h-2 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="hidden lg:flex absolute -right-4 top-32 bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-3 shadow-2xl backdrop-blur-xl"
          >
            <QrCode className="w-16 h-16 text-zinc-800 dark:text-zinc-200" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900/80 backdrop-blur-md text-sm font-semibold mb-8 border border-zinc-200 dark:border-zinc-800 shadow-sm text-zinc-700 dark:text-zinc-300"
          >
            <SparklesIcon className="w-4 h-4 text-blue-500" />
            AI-Powered Customer Feedback
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl font-black tracking-tighter max-w-5xl mx-auto leading-[1.05]"
          >
            Turn every scan into a <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-indigo-500 to-violet-600 drop-shadow-sm">5-star review</span>.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed font-medium mt-8"
          >
            Frictionless QR codes. Instant AI-generated drafts. Smart negative feedback interception. Dominate your local SEO on autopilot.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10"
          >
            <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "rounded-full px-10 text-base h-14 group shadow-2xl shadow-blue-500/25 w-full sm:w-auto font-semibold")}>
              Start generating reviews <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Button variant="outline" size="lg" className="rounded-full px-8 text-base h-14 w-full sm:w-auto bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-md border-zinc-200 dark:border-zinc-800 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900">
              View Demo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Infinite Scrolling Marquee */}
      <section className="py-12 border-y border-zinc-200/50 dark:border-zinc-800/50 bg-white/30 dark:bg-zinc-950/30 backdrop-blur-md overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-zinc-50 dark:from-[#0a0a0a] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-zinc-50 dark:from-[#0a0a0a] to-transparent z-10" />
        <p className="text-center text-xs font-bold text-zinc-400 dark:text-zinc-600 mb-8 uppercase tracking-widest relative z-20">Trusted by modern local businesses</p>
        
        <div className="flex w-max animate-marquee space-x-16 px-8 items-center opacity-70 grayscale">
          {/* Double the content for seamless infinite scroll */}
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex space-x-16 items-center">
              <div className="text-2xl font-bold flex items-center gap-3"><Globe className="w-7 h-7"/> Joe&apos;s Cafe</div>
              <div className="text-2xl font-bold flex items-center gap-3"><Zap className="w-7 h-7"/> Elite Fitness</div>
              <div className="text-2xl font-bold flex items-center gap-3"><Star className="w-7 h-7"/> The Grand Hotel</div>
              <div className="text-2xl font-bold flex items-center gap-3"><ShieldCheck className="w-7 h-7"/> Metro Clinic</div>
              <div className="text-2xl font-bold flex items-center gap-3"><MessageSquare className="w-7 h-7"/> Pure Salon</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3D Interactive Product Preview Mockup */}
      <section className="px-6 py-40 relative z-10 perspective-1000">
        <motion.div 
          style={{ y }}
          className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent -z-10" 
        />
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
              Writing reviews is hard.<br/>
              <span className="text-zinc-400">We made it 1-click easy.</span>
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium max-w-lg">
              Customers simply answer a quick 5-star rating scale. Gemini AI instantly drafts a tailored, professional review based on their sentiment, ready to be pasted directly onto Google.
            </p>
            
            <ul className="space-y-4 pt-4">
              {[
                "Frictionless Mobile-First UX",
                "AI understands context and sentiment",
                "Direct redirect to your Google Page"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-4 font-semibold text-lg text-zinc-800 dark:text-zinc-200">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  {text}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Isometric Phone Mockup */}
          <motion.div 
            initial={{ opacity: 0, rotateY: 20, rotateX: 10, scale: 0.9 }}
            whileInView={{ opacity: 1, rotateY: -5, rotateX: 5, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex-1 relative"
          >
            {/* Massive Glowing shadow for 3D effect */}
            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full transform translate-y-10 scale-90" />
            
            <div className="w-[320px] mx-auto h-[640px] bg-white dark:bg-[#0a0a0a] rounded-[3.5rem] border-[14px] border-zinc-200 dark:border-zinc-800 shadow-2xl relative z-10 transform-gpu overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
              <div className="absolute top-0 inset-x-0 h-7 bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 rounded-b-3xl w-40 mx-auto z-20" />
              
              <div className="p-6 h-full flex flex-col pt-16 relative bg-zinc-50 dark:bg-zinc-950">
                <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
                  ☕
                </div>
                <h4 className="text-center font-bold text-xl mb-2">Central Perk Cafe</h4>
                <p className="text-center text-sm text-zinc-500 mb-8 font-medium">How was your experience today?</p>
                
                <div className="flex justify-center gap-2 mb-8">
                  {[1,2,3,4,5].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0.2, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + (i * 0.15), type: "spring" }}
                    >
                      <Star className="w-9 h-9 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.5, type: "spring" }}
                  className="bg-white dark:bg-zinc-900 rounded-2xl p-5 mt-auto mb-6 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-blue-500/5 relative"
                >
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center border-4 border-zinc-50 dark:border-zinc-950 shadow-lg">
                    <SparklesIcon className="w-4 h-4 text-white" />
                  </div>
                  <TypewriterText text="Absolutely loved the coffee! The service was incredibly fast and the ambience was perfect for a Sunday morning. Highly recommend!" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 3.5 }}
                >
                  <Button className="w-full rounded-2xl h-14 bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-white font-bold text-lg shadow-lg">
                    Copy & Go to Google
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Box Features Grid */}
      <section className="py-32 relative z-10 bg-white dark:bg-[#0a0a0a] border-t border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">Dominate local search.</h2>
            <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium">Built for modern businesses who want to leverage AI to capture perfect 5-star reviews while intercepting unhappy customers.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">
            {/* Feature 1 (Spans 2 columns) */}
            <div className="md:col-span-2 relative overflow-hidden bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10 group hover:border-emerald-500/50 transition-colors">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-emerald-500/20 transition-colors" />
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 border border-emerald-200/50 dark:border-emerald-800/50">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight">Negative Protection</h3>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md">
                  Intercept bad reviews before they hit Google. Customers who rate under 4 stars are automatically diverted to a private feedback form, saving your public reputation.
                </p>
              </div>
            </div>

            {/* Feature 2 (Spans 1 column) */}
            <div className="relative overflow-hidden bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10 group hover:border-violet-500/50 transition-colors">
              <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[60px] translate-y-1/3 translate-x-1/3 group-hover:bg-violet-500/20 transition-colors" />
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6 border border-violet-200/50 dark:border-violet-800/50">
                  <QrCode className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">Custom QR Codes</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Generate beautifully branded, downloadable QR codes ready to print and place on tables.
                </p>
              </div>
            </div>

            {/* Feature 3 (Spans 3 columns) */}
            <div className="md:col-span-3 relative overflow-hidden bg-zinc-900 dark:bg-zinc-900 border border-zinc-800 rounded-3xl p-10 group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex-1">
                  <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-6 border border-blue-500/30">
                    <BarChart3 className="w-7 h-7" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 tracking-tight text-white">Live Dashboard Analytics</h3>
                  <p className="text-lg text-zinc-400 max-w-xl">
                    Track scan events, conversion rates, and sentiment analysis in real-time. Understand your customer satisfaction with beautiful interactive Recharts graphs.
                  </p>
                </div>
                
                {/* Dashboard Mockup Snippet inside Bento */}
                <div className="hidden lg:block w-[400px] h-[200px] bg-[#0a0a0a] rounded-2xl border border-zinc-800 p-6 shadow-2xl relative overflow-hidden">
                  <div className="flex justify-between items-end h-full pt-8">
                    {[40, 65, 45, 85, 55, 95, 75].map((h, i) => (
                      <div key={i} className="w-8 bg-blue-500 rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="absolute top-4 left-6 right-6 flex justify-between items-center border-b border-zinc-800 pb-2">
                    <span className="text-zinc-400 text-sm font-medium">Conversion Rate</span>
                    <span className="text-white font-bold">84%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Massive Bottom CTA Banner */}
      <section className="px-6 py-32 relative z-10">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-zinc-900 to-black dark:from-white dark:to-zinc-200 rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl">
          {/* Intense Glow behind CTA */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/30 via-transparent to-transparent opacity-60" />
          
          <h2 className="text-5xl md:text-7xl font-black mb-6 text-white dark:text-black tracking-tighter relative z-10">
            Ready to boost your ranking?
          </h2>
          <p className="text-xl md:text-2xl text-zinc-400 dark:text-zinc-600 mb-12 max-w-3xl mx-auto relative z-10 font-medium">
            Join hundreds of local businesses capturing 5-star reviews on autopilot. Setup takes less than 2 minutes. No credit card required.
          </p>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "rounded-full px-12 text-lg h-16 bg-white text-black hover:bg-zinc-100 dark:bg-black dark:text-white dark:hover:bg-zinc-900 shadow-2xl font-bold")}>
              Get Started for Free
            </Link>
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-500 mt-4 sm:mt-0">
              <Lock className="w-4 h-4" /> Secure, 1-click Google setup
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-200/50 dark:border-zinc-800/50 relative z-10 bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
            <div className="w-6 h-6 bg-black dark:bg-white rounded flex items-center justify-center">
              <QrCode className="w-3 h-3 text-white dark:text-black" />
            </div>
            ReviewQR
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-zinc-500">
            <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Contact</Link>
          </div>
          <p className="text-zinc-400 text-sm font-medium">© 2026 ReviewQR AI.</p>
        </div>
      </footer>
    </div>
  );
}

// Sparkle Icon Helper
function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}

// Helper component for typing effect in mockup
function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [text, started]);

  return (
    <motion.div 
      onViewportEnter={() => {
        setTimeout(() => setStarted(true), 1500); // Wait for stars to fill
      }}
      className="text-sm font-medium italic text-zinc-700 dark:text-zinc-300 min-h-[80px]"
    >
      &quot;{displayedText}{displayedText.length < text.length && started ? <span className="animate-pulse">|</span> : ""}&quot;
    </motion.div>
  );
}
