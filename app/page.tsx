'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowRight, Layers, Zap, Package,
  Server, Monitor, CheckCircle2, AlertCircle, XCircle,
  BarChart3, ShieldCheck, HardDrive, Star, ChevronRight, Cpu
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';

const orbitComponents = [
  {
    id: 'cpu', short: 'CPU', name: 'Intel Core i9-14900K',
    icon: Cpu, stock: 42, status: 'in-stock' as const,
    dot: 'bg-emerald-500', iconColor: 'text-blue-500 dark:text-blue-400',
    ring: 'border-blue-200 dark:border-blue-500/40', bg: 'bg-blue-50 dark:bg-blue-500/10',
    desc: 'The brain of your build. AMS tracks CPU stock per location and alerts you before a build is blocked.',
    usedIn: ['Gaming PC', 'Workstation'],
  },
  {
    id: 'gpu', short: 'GPU', name: 'NVIDIA RTX 4090',
    icon: Monitor, stock: 8, status: 'low-stock' as const,
    dot: 'bg-amber-500', iconColor: 'text-purple-500 dark:text-purple-400',
    ring: 'border-purple-200 dark:border-purple-500/40', bg: 'bg-purple-50 dark:bg-purple-500/10',
    desc: 'Low stock warning! AMS flags this component and recalculates how many full units can still be assembled.',
    usedIn: ['Gaming PC'],
  },
  {
    id: 'ram', short: 'RAM', name: 'DDR5 32GB Kit',
    icon: Server, stock: 150, status: 'in-stock' as const,
    dot: 'bg-emerald-500', iconColor: 'text-emerald-500 dark:text-emerald-400',
    ring: 'border-emerald-200 dark:border-emerald-500/40', bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    desc: 'Fully stocked. AMS ensures the BOM specifies the exact kit count needed and tracks kits, not sticks.',
    usedIn: ['Gaming PC', 'Workstation', 'Server'],
  },
  {
    id: 'ssd', short: 'SSD', name: 'NVMe M.2 2TB',
    icon: HardDrive, stock: 0, status: 'out-of-stock' as const,
    dot: 'bg-red-500', iconColor: 'text-red-500 dark:text-red-400',
    ring: 'border-red-200 dark:border-red-500/40', bg: 'bg-red-50 dark:bg-red-500/10',
    desc: 'Out of stock — assembly halted. AMS prevents you from starting a build you cannot finish.',
    usedIn: ['Gaming PC', 'Workstation'],
  },
  {
    id: 'psu', short: 'PSU', name: '850W Gold PSU',
    icon: Zap, stock: 35, status: 'in-stock' as const,
    dot: 'bg-emerald-500', iconColor: 'text-amber-500 dark:text-amber-400',
    ring: 'border-amber-200 dark:border-amber-500/40', bg: 'bg-amber-50 dark:bg-amber-500/10',
    desc: 'Power supply stocked and matched to products via BOM. AMS validates wattage specs per product.',
    usedIn: ['Gaming PC', 'Workstation'],
  },
  {
    id: 'mobo', short: 'MOBO', name: 'Z790 Motherboard',
    icon: Layers, stock: 22, status: 'in-stock' as const,
    dot: 'bg-emerald-500', iconColor: 'text-indigo-500 dark:text-indigo-400',
    ring: 'border-indigo-200 dark:border-indigo-500/40', bg: 'bg-indigo-50 dark:bg-indigo-500/10',
    desc: 'The backbone of every build. AMS maps which products use this board and shows live build capacity.',
    usedIn: ['Gaming PC', 'Workstation'],
  },
];

export default function WelcomePage() {
  const [selected, setSelected] = React.useState(0);
  const comp = orbitComponents[selected];
  if (!comp) return null;

  return (
    <div className="relative z-10 flex flex-col flex-1">

      {/* ── 1. HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-20 overflow-hidden flex flex-col items-center text-center px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-8">
          <Zap size={13} className="text-amber-500" /> The Future of Manufacturing
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6">
          Assembly Management,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500">Perfected.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Take full control of your hardware production. Track components, design multi-level BOMs, and calculate live assembly capacity — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
          <Link href="/auth?mode=signup" className={buttonVariants({ size: 'lg', className: 'bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-8 text-base shadow-xl shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 rounded-xl' })}>
            Start Building for Free <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link href="/auth?mode=login" className={buttonVariants({ size: 'lg', variant: 'outline', className: 'h-14 px-8 text-base border-border hover:bg-muted text-foreground hover:scale-105 transition-all rounded-xl' })}>
            Sign In to Dashboard
          </Link>
        </div>
      </section>

      {/* ── 2. ORBIT COMPONENT VISUALIZER ───────────────────────────── */}
      <section className="py-20 px-4 overflow-hidden">
        <style>{`
          @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes spin-slow-r { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
          @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
          @keyframes ping-slow { 0% { transform:scale(1); opacity:.5; } 100% { transform:scale(1.7); opacity:0; } }
          .ring-spin   { animation: spin-slow   24s linear infinite; }
          .ring-spin-r { animation: spin-slow-r 18s linear infinite; }
          .hub-float   { animation: float 4s ease-in-out infinite; }
          .hub-ping    { animation: ping-slow 2.2s ease-out infinite; }
        `}</style>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Every component. Fully tracked.</h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto">
              Tap any part to see how AMS manages it — from stock levels to assembly capacity.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/* Orbit visualizer */}
            <div className="relative w-[320px] h-[320px] flex-shrink-0 mx-auto lg:mx-0">
              {/* Outer orbit ring */}
              <div className="ring-spin absolute inset-0 rounded-full border border-dashed border-border/50" />
              {/* Inner orbit ring */}
              <div className="ring-spin-r absolute inset-[45px] rounded-full border border-dashed border-indigo-500/20" />
              {/* Ambient glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-24 h-24 rounded-full bg-indigo-500/15 blur-3xl" />
              </div>
              {/* Center hub */}
              <div className="hub-float absolute inset-0 flex items-center justify-center z-20">
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-2xl shadow-indigo-500/40 border border-white/10">
                  <div className="hub-ping absolute inset-0 rounded-2xl border-2 border-indigo-400/50" />
                  <Cpu size={28} className="text-white relative z-10" />
                </div>
              </div>

              {/* Component nodes */}
              {orbitComponents.map((c, i) => {
                const angle = (360 / orbitComponents.length) * i - 90;
                const r = 128;
                const rad = (angle * Math.PI) / 180;
                const x = Math.round(Math.cos(rad) * r);
                const y = Math.round(Math.sin(rad) * r);
                const isActive = selected === i;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelected(i)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
                    style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                    aria-label={c.name}
                  >
                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 shadow-md
                      ${isActive ? `${c.bg} ${c.ring} scale-115 shadow-lg` : 'bg-card border-border hover:scale-110 hover:border-muted-foreground/30'}`}>
                      <c.icon size={22} className={isActive ? c.iconColor : 'text-muted-foreground'} />
                    </div>
                    <span className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${isActive ? c.iconColor : 'text-muted-foreground'}`}>
                      {c.short}
                    </span>
                    <span className={`absolute top-0.5 right-0.5 w-2 h-2 rounded-full border border-card ${c.dot}`} />
                  </button>
                );
              })}
            </div>

            {/* Detail panel */}
            <div className="flex-1 min-w-0">
              <div className={`p-7 rounded-3xl border transition-colors duration-300 ${comp.bg} ${comp.ring}`}>
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-xl ${comp.bg} border ${comp.ring}`}>
                    <comp.icon size={28} className={comp.iconColor} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Component</p>
                    <h3 className="text-xl font-extrabold text-foreground">{comp.name}</h3>
                  </div>
                </div>

                {/* Status row */}
                <div className="flex items-center gap-3 mb-6">
                  {comp.status === 'in-stock'     && <><CheckCircle2 size={16} className="text-emerald-500" /><span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">In Stock</span></>}
                  {comp.status === 'low-stock'    && <><AlertCircle  size={16} className="text-amber-500"  /><span className="text-sm font-semibold text-amber-600 dark:text-amber-400">Low Stock — Alert Active</span></>}
                  {comp.status === 'out-of-stock' && <><XCircle      size={16} className="text-red-500"    /><span className="text-sm font-semibold text-red-600 dark:text-red-400">Out of Stock — Assembly Halted</span></>}
                  <span className="ml-auto font-mono text-2xl font-extrabold text-foreground">{comp.stock}</span>
                  <span className="text-xs text-muted-foreground">units</span>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{comp.desc}</p>

                {/* Used in */}
                <div className="mb-6">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Used in Products</p>
                  <div className="flex flex-wrap gap-2">
                    {comp.usedIn.map(p => (
                      <span key={p} className="px-2.5 py-1 bg-background border border-border rounded-lg text-xs font-semibold text-foreground">{p}</span>
                    ))}
                  </div>
                </div>

                <Link href="/auth?mode=signup" className={buttonVariants({ className: `w-full rounded-xl h-11 text-white ${comp.status === 'out-of-stock' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}` })}>
                  Track This Component <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. CORE FEATURES ─────────────────────────────────────────── */}
      <section className="py-20 border-t border-border bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Everything you need to ship faster</h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto">Four powerful tools, one unified platform — built for hardware teams of every size.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { icon: Package, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-500/15', title: 'Product Management', desc: 'Define products with unlimited component depth. Your entire catalog, structured and searchable.' },
              { icon: HardDrive, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/15', title: 'Inventory Tracking', desc: 'Monitor workshop and storage stock in real time. Get alerted before you run out — not after.' },
              { icon: BarChart3, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-500/15', title: 'Manufacturing Reports', desc: 'Generate instant BOM reports, shortage summaries, and cost-of-goods data on demand.' },
              { icon: ShieldCheck, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-500/15', title: 'Role-Based Access', desc: 'Admins control orders and inventory. Users browse, order, and track — all with secure auth.' },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-5 p-6 bg-card border border-border rounded-2xl hover:shadow-md transition-shadow duration-200 group">
                <div className={`${f.bg} ${f.color} p-3 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                  <f.icon size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ──────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Up and running in three steps</h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto">No onboarding calls. No complex setup. Just log in and start managing.</p>
          </div>
          <div className="relative">
            <div className="absolute left-7 top-8 bottom-8 w-px bg-gradient-to-b from-indigo-500/40 via-purple-500/20 to-transparent hidden sm:block" />
            <div className="flex flex-col gap-8">
              {[
                { step: '01', title: 'Add your components', badge: 'Inventory', desc: 'Enter your raw parts — CPUs, resistors, frames, batteries — into the AMS inventory. Assign them to your workshop or storage locations.' },
                { step: '02', title: 'Build your product structures', badge: 'Products', desc: 'Define which components go into each finished product. Create hierarchical BOMs that reflect exactly how your hardware is assembled.' },
                { step: '03', title: 'Calculate, order & ship', badge: 'Assembly', desc: 'AMS tells you instantly how many units you can build. Users place orders; admins confirm them and stock adjusts automatically.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-6 relative">
                  <div className="flex-shrink-0 w-14 h-14 bg-card border border-border rounded-2xl flex items-center justify-center shadow-sm z-10">
                    <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">{item.step}</span>
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{item.badge}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. TESTIMONIALS ──────────────────────────────────────────── */}
      <section className="py-20 border-t border-border bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Teams that build smarter</h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto">From startups to workshops — AMS helps teams eliminate waste and build with confidence.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { quote: "We used to run out of GPUs mid-build constantly. AMS's stock alerts mean we've had zero unexpected halts in six months.", name: 'Sarah K.', role: 'Head of Operations, IoT Labs' },
              { quote: "The assembly calculator alone saves our sales team hours every week. We know our capacity instantly — no spreadsheets needed.", name: 'David M.', role: 'Production Lead, BuildCorp' },
              { quote: "Setting up our BOM for a 47-component product took under an hour. The interface is incredibly intuitive for engineers.", name: 'Elena R.', role: 'Hardware Engineer, Flextronics' },
            ].map((t, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => <Star key={s} size={14} className="text-amber-500 fill-amber-500" />)}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div className="border-t border-border pt-3">
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FINAL CTA ─────────────────────────────────────────────── */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-8 py-20 text-center shadow-2xl">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e510_1px,transparent_1px),linear-gradient(to_bottom,#4f46e510_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5 max-w-3xl mx-auto leading-tight">
                Ready to take control of your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">assembly line?</span>
              </h2>
              <p className="text-slate-300 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                Join manufacturing teams who have eliminated stock-outs, reduced errors, and started shipping faster with AMS.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/auth?mode=signup" className={buttonVariants({ className: 'h-13 px-8 py-3.5 text-base bg-indigo-600 hover:bg-indigo-500 text-white border-0 rounded-xl shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95' })}>
                  Create Your Free Account <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="/auth?mode=login" className={buttonVariants({ variant: 'outline', className: 'h-13 px-8 py-3.5 text-base border-white/20 hover:bg-white/10 text-white bg-transparent rounded-xl transition-all hover:scale-105 active:scale-95' })}>
                  Sign In to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
