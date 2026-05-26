import * as React from 'react';
import Link from 'next/link';
import { Cpu, MemoryStick, HardDrive, CircuitBoard, Fan, Power, Shield, TrendingUp, Zap, ChevronRight } from 'lucide-react';

export function PromoSection() {
  return (
    <section className="mt-20 mb-0 relative overflow-hidden">
      {/* Dark background with grid pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl" />
      <div className="absolute inset-0 bg-grid-pattern bg-[size:32px_32px] rounded-3xl" />
      {/* Glow accents */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 px-8 py-16">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-200 dark:bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-widest mb-5">
            <Cpu size={12} />
            Powered by Precision Engineering
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Built for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">Hardware Era</span>
          </h2>
          <p className="text-slate-300 text-base max-w-xl mx-auto leading-relaxed">
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
            <div key={cat.label} className={`group relative ${cat.glow} border border-white/10 rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-white/20 hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden`}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                <cat.icon size={22} className="text-white" />
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-bold leading-tight">{cat.label}</p>
                <p className="text-slate-300 text-[10px] mt-0.5 font-mono">{cat.desc}</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-14" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
                    <p className="text-slate-300 text-xs leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '7+',    label: 'Component Types',   sub: 'CPU, RAM, SSD & more',   color: 'text-indigo-400', border: 'border-indigo-500/20' },
              { value: '100%',  label: 'Stock Visibility',  sub: 'Workshop & storage',      color: 'text-emerald-400',border: 'border-emerald-500/20'},
              { value: '∞',     label: 'BOM Structures',    sub: 'Unlimited product depth', color: 'text-purple-400', border: 'border-purple-500/20' },
              { value: '<1s',   label: 'Calc Speed',        sub: 'Live assembly data',      color: 'text-amber-400',  border: 'border-amber-500/20'  },
            ].map((stat) => (
              <div key={stat.label} className={`bg-white/5 border ${stat.border} rounded-2xl p-5 hover:bg-white/10 transition-colors duration-200`}>
                <p className={`text-3xl font-extrabold ${stat.color} mb-1 font-mono`}>{stat.value}</p>
                <p className="text-white text-xs font-bold mb-0.5">{stat.label}</p>
                <p className="text-slate-300 text-[10px] leading-tight">{stat.sub}</p>
              </div>
            ))}

            <div className="col-span-2 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-white font-bold text-sm mb-0.5">Ready to assemble?</p>
                <p className="text-slate-300 text-xs">Start tracking your components today — it's free.</p>
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

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-3">
          {['LGA1700', 'DDR5-6000', 'PCIe 5.0', 'M.2 NVMe', 'ATX 3.0', '80+ Platinum', 'ARGB', 'ECC Memory', 'Dual-Socket'].map((tag) => (
            <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-300 text-[10px] font-mono hover:text-white hover:border-white/20 transition-colors duration-150 cursor-default">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
