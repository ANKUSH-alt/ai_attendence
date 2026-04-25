"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Camera, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Globe,
  Lock,
  Smartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">AI Attend</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How it works</a>
          <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold hover:text-primary transition-colors">Sign In</Link>
          <Link href="/register" className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8"
          >
            <Zap size={14} fill="currentColor" />
            <span>Next-Gen Attendance System</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-8"
          >
            Mark Attendance with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              Computer Vision Intelligence.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-xl text-muted-foreground leading-relaxed mb-12"
          >
            Say goodbye to roll calls. Our AI identifies every student in a single photo, 
            eliminating proxy and manual effort in seconds.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register" className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center justify-center gap-2 group">
              Start Your Free Trial
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto glass border px-8 py-4 rounded-2xl text-lg font-bold hover:bg-muted transition-all">
              Watch Demo
            </button>
          </motion.div>

          {/* Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 relative max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-white/10"
          >
            <div className="aspect-video relative bg-slate-900 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070" 
                alt="Classroom" 
                className="w-full h-full object-cover opacity-60"
              />
              {/* Fake AI Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="scan-line" />
                <div className="grid grid-cols-4 gap-12 w-full h-full p-20">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="border-2 border-emerald-500 rounded-lg relative h-24 animate-pulse">
                      <span className="absolute -top-6 left-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ID: {842 + i}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-white text-sm font-bold tracking-widest uppercase">AI Scanning Active</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful Features for Educators</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to automate attendance and focus on teaching.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                title: "One-Click Scan",
                desc: "Upload one classroom photo and let our AI handle the rest. Detect 50+ faces in milliseconds.",
                color: "text-blue-500"
              },
              {
                icon: TrendingUp,
                title: "Smart Analytics",
                desc: "Get insights into attendance trends, most absent students, and monthly percentages automatically.",
                color: "text-emerald-500"
              },
              {
                icon: Lock,
                title: "Anti-Proxy Engine",
                desc: "Liveness detection and confidence thresholds prevent proxy attendance using printed photos.",
                color: "text-rose-500"
              },
              {
                icon: Globe,
                title: "Cloud Sync",
                desc: "Access records from anywhere. Seamlessly sync between your mobile and desktop devices.",
                color: "text-violet-500"
              },
              {
                icon: Smartphone,
                title: "Mobile Friendly",
                desc: "Mark attendance right from your smartphone. No heavy hardware or cameras needed.",
                color: "text-amber-500"
              },
              {
                icon: Users,
                title: "Bulk Management",
                desc: "Easily manage thousands of students, classes, and sections with our intuitive dashboard.",
                color: "text-indigo-500"
              }
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="glass p-8 rounded-3xl border border-border/50 hover:border-primary/20 transition-all duration-300"
              >
                <div className={cn("w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6", f.color)}>
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-8">Attendance in 3 Simple Steps.</h2>
              <div className="space-y-10">
                {[
                  { step: "01", title: "Registration", desc: "Upload clear photos of your students once to train the AI model." },
                  { step: "02", title: "Capture & Upload", desc: "Take a classroom photo during the lecture and upload it via the dashboard." },
                  { step: "03", title: "Automated Records", desc: "AI recognizes students and marks attendance instantly. Export reports in one click." }
                ].map((s, i) => (
                  <div key={i} className="flex gap-6">
                    <span className="text-4xl font-black text-primary/20">{s.step}</span>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                      <p className="text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="w-full aspect-square bg-primary/5 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-3xl" />
              <div className="relative glass p-10 rounded-[40px] border shadow-2xl">
                <CheckCircle2 size={80} className="text-primary mb-8" />
                <div className="space-y-4">
                  <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-full opacity-50" />
                  <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full opacity-30" />
                </div>
                <div className="mt-12 flex items-center justify-between">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-800 bg-slate-300" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-primary">+120 Present</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto glass p-16 rounded-[48px] border shadow-2xl bg-gradient-to-br from-primary to-blue-700 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
          <h2 className="text-4xl md:text-5xl font-bold mb-8 relative z-10">Ready to transform your <br /> classroom management?</h2>
          <p className="text-blue-100 text-xl mb-12 relative z-10 opacity-90">Join 500+ institutes already using AI Attend to save hours every week.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link href="/register" className="w-full sm:w-auto bg-white text-primary px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl transition-all hover:scale-105 active:scale-95">
              Get Started for Free
            </Link>
            <button className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 px-10 py-5 rounded-2xl text-xl font-bold hover:bg-white/20 transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-white" size={20} />
            </div>
            <span className="font-bold">AI Attend</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2026 AI Intelligent Attendance System. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
            <a href="#" className="hover:text-primary">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
