'use client';

import * as React from 'react';
import Link from 'next/link';
import { Package, Cpu, Archive, Wrench, ArrowRight, CheckCircle2, HardDrive, Monitor, Zap, Server, MemoryStick, CircuitBoard, Fan, Power, Shield, TrendingUp, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { useAuth } from '@/lib/auth-context';

export default function WelcomePage() {
  const { user } = useAuth();
  const features = [
    { icon: Package, title: 'Product Management', desc: 'Define complex product structures and manage product catalogs seamlessly.' },
    { icon: Cpu, title: 'Component Tracking', desc: 'Real-time tracking of individual components across your workshop and storage.' },
    { icon: Archive, title: 'Smart Inventory', desc: 'Automated low-stock alerts and comprehensive inventory valuation.' },
    { icon: Wrench, title: 'Assembly Calculator', desc: 'Instantly calculate how many products can be built with current stock.' },
  ];

  return (
    <div className="relative z-10 flex flex-col flex-1">
        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight mb-6">
            Streamline your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Manufacturing</span> Process
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The all-in-one platform for modern hardware manufacturers. Track components, define product structures, and calculate assembly possibilities in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/auth?mode=signup">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 h-12 px-8 text-base shadow-lg shadow-indigo-900/40">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth?mode=login">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base border-white/10 hover:bg-white/5 text-slate-300 hover:text-white">
                Sign In to Dashboard
              </Button>
            </Link>
          </div>

          {/* Minimal Animated Tech Graphic */}
          <div className="relative mt-20 mb-8 w-full max-w-3xl mx-auto h-48 sm:h-64 flex items-center justify-center">
            {/* Center glowing orb */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
            </div>
            
            {/* Center CPU element */}
            <div className="relative z-20 w-20 h-20 sm:w-24 sm:h-24 bg-[#0f1117]/90 backdrop-blur-md border border-indigo-500/30 rounded-2xl shadow-xl flex items-center justify-center animate-bounce" style={{ animationDuration: '4s' }}>
              <Cpu size={40} className="text-indigo-400" />
              <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-2xl animate-ping" style={{ animationDuration: '3s' }}></div>
            </div>

            {/* Floating Components */}
            {/* Top Left */}
            <div className="absolute z-10 left-[10%] sm:left-[20%] top-[10%] w-12 h-12 sm:w-16 sm:h-16 bg-[#0f1117] border border-white/8 rounded-xl shadow-lg flex items-center justify-center animate-bounce" style={{ animationDuration: '5s', animationDelay: '0.5s' }}>
              <HardDrive size={24} className="text-slate-400" />
            </div>
            
            {/* Top Right */}
            <div className="absolute z-10 right-[10%] sm:right-[20%] top-[20%] w-12 h-12 sm:w-16 sm:h-16 bg-[#0f1117] border border-white/8 rounded-xl shadow-lg flex items-center justify-center animate-bounce" style={{ animationDuration: '6s', animationDelay: '1s' }}>
              <Server size={24} className="text-emerald-400" />
            </div>

            {/* Bottom Left */}
            <div className="absolute z-10 left-[20%] sm:left-[25%] bottom-[10%] w-12 h-12 sm:w-16 sm:h-16 bg-[#0f1117] border border-white/8 rounded-xl shadow-lg flex items-center justify-center animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}>
              <Monitor size={24} className="text-blue-400" />
            </div>

            {/* Bottom Right */}
            <div className="absolute z-10 right-[15%] sm:right-[25%] bottom-[15%] w-12 h-12 sm:w-16 sm:h-16 bg-[#0f1117] border border-white/8 rounded-xl shadow-lg flex items-center justify-center animate-bounce" style={{ animationDuration: '5.5s', animationDelay: '2s' }}>
              <Zap size={24} className="text-amber-400" />
            </div>

            {/* Connecting Lines (Simulated with absolute divs) */}
            <div className="absolute top-1/2 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent z-0"></div>
            <div className="absolute left-1/2 top-[20%] bottom-[20%] w-px bg-gradient-to-b from-transparent via-indigo-200 to-transparent z-0"></div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 border border-white/6 bg-[#0f1117]/80 backdrop-blur-sm rounded-3xl shadow-sm mt-auto">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">Everything you need to scale</h2>
              <p className="text-slate-500 mt-2">Powerful tools designed specifically for hardware assembly operations.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <Card key={i} className="border-white/6 shadow-sm hover:shadow-indigo-500/10 hover:shadow-md transition-shadow bg-[#0a0d14]">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
                      <feature.icon size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Conditional Logged In Welcome Section */}
        {user && (
          <section className="py-12 mt-12 bg-[#0f1117]/80 border border-white/6 rounded-3xl p-8 backdrop-blur-sm shadow-sm">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back, {user.name}!</h2>
            <p className="text-slate-500 mb-6 text-sm">Quick actions and shortcuts to manage your assembly workspace:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-white/6 bg-white/5 shadow-sm hover:shadow transition-shadow">
                <h4 className="text-sm font-semibold text-slate-200 mb-1">Add Components</h4>
                <p className="text-xs text-slate-500">Manage workshop and storage inventory</p>
              </div>
              <div className="p-4 rounded-xl border border-white/6 bg-white/5 shadow-sm hover:shadow transition-shadow">
                <h4 className="text-sm font-semibold text-slate-200 mb-1">Run Calculations</h4>
                <p className="text-xs text-slate-500">Calculate assemblable product quotas</p>
              </div>
              <div className="p-4 rounded-xl border border-white/6 bg-white/5 shadow-sm hover:shadow transition-shadow">
                <h4 className="text-sm font-semibold text-slate-200 mb-1">Check Reports</h4>
                <p className="text-xs text-slate-500">Generate BOM and pricing sheets</p>
              </div>
            </div>
          </section>
        )}
        {/* Client Reviews Section */}
        <section className="py-16 mt-16 border-t border-white/6">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-white">What Our Users Say</h2>
              <p className="text-slate-500 mt-1 text-sm">Real feedback from teams streamlining their assembly lines.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote: "AMS has completely changed how we track IoT component stock. We haven't run out of microchips once since deploying it.",
                  author: "Sarah K.",
                  role: "Head of Operations at IoT Labs",
                  rating: 5
                },
                {
                  quote: "The assembly calculator is a lifesaver. Being able to instantly tell our sales team how many units we can build is incredible.",
                  author: "David M.",
                  role: "Production Lead at BuildCorp",
                  rating: 5
                },
                {
                  quote: "Simple, clean, and focus-driven. Integrating our bill of materials structure took less than an afternoon.",
                  author: "Elena R.",
                  role: "Hardware Engineer at Flextronics",
                  rating: 5
                }
              ].map((review, i) => (
                <Card key={i} className="border-white/6 bg-[#0f1117]/90 shadow-sm backdrop-blur-sm">
                  <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div>
                      {/* Star rating */}
                      <div className="flex gap-0.5 mb-3 text-amber-400 text-sm">
                        {Array.from({ length: review.rating }).map((_, idx) => (
                          <span key={idx}>★</span>
                        ))}
                      </div>
                      <p className="text-sm text-slate-400 italic leading-relaxed mb-4">
                        "{review.quote}"
                      </p>
                    </div>
                    <div className="border-t border-white/6 pt-3 mt-auto">
                      <h4 className="text-xs font-semibold text-slate-200">{review.author}</h4>
                      <p className="text-[10px] text-slate-500">{review.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROMO SECTION: Featured Component Categories ── */}
        <section className="mt-20 mb-0 relative overflow-hidden">
          {/* Dark background with grid pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] rounded-3xl" />
          {/* Glow accents */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 px-8 py-16">
            {/* Section Header */}
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-widest mb-5">
                <Cpu size={12} />
                Powered by Precision Engineering
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                Built for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">Hardware Era</span>
              </h2>
              <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
                Every chip, board, and cable — tracked, structured, and optimized. AMS brings factory-level control to your assembly workflow.
              </p>
            </div>

            {/* PC Part Category Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-14">
              {[
                { icon: Cpu,          label: 'Processors',   desc: 'Intel · AMD', color: 'from-blue-500 to-cyan-500',    glow: 'bg-blue-500/10'   },
                { icon: MemoryStick,  label: 'Memory',       desc: 'DDR4 · DDR5', color: 'from-purple-500 to-violet-500', glow: 'bg-purple-500/10' },
                { icon: HardDrive,    label: 'Storage',      desc: 'SSD · NVMe',  color: 'from-emerald-500 to-teal-500', glow: 'bg-emerald-500/10'},
                { icon: CircuitBoard, label: 'Motherboards', desc: 'ATX · mITX',  color: 'from-orange-500 to-amber-500', glow: 'bg-orange-500/10' },
                { icon: Fan,          label: 'Cooling',      desc: 'Air · AIO',   color: 'from-sky-500 to-blue-500',     glow: 'bg-sky-500/10'    },
                { icon: Power,        label: 'Power',        desc: 'ATX · SFX',   color: 'from-red-500 to-rose-500',     glow: 'bg-red-500/10'    },
              ].map((cat) => (
                <div key={cat.label}
                  className={`group relative ${cat.glow} border border-white/5 rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-white/20 hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden`}
                >
                  {/* Icon with gradient */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <cat.icon size={22} className="text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-white text-sm font-bold leading-tight">{cat.label}</p>
                    <p className="text-slate-500 text-[10px] mt-0.5 font-mono">{cat.desc}</p>
                  </div>
                  {/* Subtle shine on hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none" />
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-14" />

            {/* Two-column feature detail */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Feature List */}
              <div>
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Why AMS?</p>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-6 leading-snug">
                  Full visibility into every <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">component in your line</span>
                </h3>
                <div className="flex flex-col gap-4">
                  {[
                    { icon: Shield,    title: 'Zero Stock-Outs',       desc: 'Smart alerts warn you before any component runs critically low.'   },
                    { icon: TrendingUp,title: 'Real-Time Build Counts', desc: 'Know exactly how many units you can assemble — right now.'         },
                    { icon: CircuitBoard, title: 'BOM Intelligence',   desc: 'Hierarchical bill-of-materials with per-product component mapping.' },
                    { icon: Zap,        title: 'Instant Calculations',  desc: 'Assembly capacity computed on the fly from live inventory data.'   },
                  ].map((f) => (
                    <div key={f.title} className="flex items-start gap-4 group/feat">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center group-hover/feat:bg-indigo-500/25 transition-colors duration-200">
                        <f.icon size={18} className="text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold mb-0.5">{f.title}</p>
                        <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Spec / Stat Cards */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '7+',    label: 'Component Types',   sub: 'CPU, RAM, SSD & more',   color: 'text-indigo-400', border: 'border-indigo-500/20' },
                  { value: '100%',  label: 'Stock Visibility',  sub: 'Workshop & storage',      color: 'text-emerald-400',border: 'border-emerald-500/20'},
                  { value: '∞',     label: 'BOM Structures',    sub: 'Unlimited product depth', color: 'text-purple-400', border: 'border-purple-500/20' },
                  { value: '<1s',   label: 'Calc Speed',        sub: 'Live assembly data',      color: 'text-amber-400',  border: 'border-amber-500/20'  },
                ].map((stat) => (
                  <div key={stat.label}
                    className={`bg-white/5 border ${stat.border} rounded-2xl p-5 hover:bg-white/8 transition-colors duration-200`}
                  >
                    <p className={`text-3xl font-extrabold ${stat.color} mb-1 font-mono`}>{stat.value}</p>
                    <p className="text-white text-xs font-bold mb-0.5">{stat.label}</p>
                    <p className="text-slate-500 text-[10px] leading-tight">{stat.sub}</p>
                  </div>
                ))}

                {/* CTA mini card spanning 2 cols */}
                <div className="col-span-2 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-white font-bold text-sm mb-0.5">Ready to assemble?</p>
                    <p className="text-slate-400 text-xs">Start tracking your components today — it's free.</p>
                  </div>
                  <Link href="/auth?mode=signup" className="flex-shrink-0">
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors duration-150 shadow-lg shadow-indigo-900/50">
                      Get Started
                      <ChevronRight size={14} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom decorative tech tags */}
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap items-center justify-center gap-3">
              {['LGA1700', 'DDR5-6000', 'PCIe 5.0', 'M.2 NVMe', 'ATX 3.0', '80+ Platinum', 'ARGB', 'ECC Memory', 'Dual-Socket'].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-white/5 border border-white/8 rounded-full text-slate-500 text-[10px] font-mono hover:text-slate-300 hover:border-white/20 transition-colors duration-150 cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
  );
}
