'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, Box, Layers, Calculator, Zap, Shield, 
  Cpu, HardDrive, Server, PackageCheck, BarChart3, ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { PromoSection } from '@/components/PromoSection';

export default function WelcomePage() {
  const { user } = useAuth();

  return (
    <div className="relative z-10 flex flex-col flex-1">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-4">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-8">
          <Zap size={14} className="text-amber-500" /> The Future of Manufacturing
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6">
          Assembly Management, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500">Perfected.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Take absolute control of your hardware production. Track millions of components, design infinite-depth BOMs, and calculate live manufacturing capacity instantly.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20 relative z-10">
          <Link href="/auth?mode=signup">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-8 text-base shadow-xl shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 rounded-xl">
              Start Building for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/auth?mode=login">
            <Button size="lg" variant="outline" className="h-14 px-8 text-base border-border hover:bg-muted text-foreground hover:scale-105 transition-all rounded-xl">
              Sign In to Dashboard
            </Button>
          </Link>
        </div>

        {/* Dashboard Mockup Image */}
        <div className="relative w-full max-w-5xl mx-auto rounded-2xl border border-white/10 shadow-2xl shadow-indigo-900/40 bg-card overflow-hidden group perspective-1000">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <Image 
            src="/ams-dashboard.png" 
            alt="AMS Dashboard Interface" 
            width={1200} 
            height={675}
            className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
            priority
          />
        </div>
      </section>

      {/* 2. BENTO BOX CAPABILITIES */}
      <section className="py-24 bg-card/50 border-y border-border backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-[100px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Command every aspect of production</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Everything you need to scale your hardware business from prototype to mass production.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Card 1 */}
            <div className="md:col-span-2 bg-gradient-to-br from-card to-muted border border-border rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 group-hover:bg-indigo-500/20 transition-colors" />
              <Layers className="text-indigo-500 mb-6" size={40} />
              <h3 className="text-2xl font-bold text-foreground mb-3">Infinite BOM Hierarchies</h3>
              <p className="text-muted-foreground max-w-md text-base leading-relaxed">
                Define the DNA of your products. Create complex, multi-level Bill of Materials (BOM) linking thousands of components together with perfect precision.
              </p>
            </div>

            {/* Small Card 1 */}
            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow group">
              <Box className="text-emerald-500 mb-6" size={40} />
              <h3 className="text-xl font-bold text-foreground mb-3">Live Stock Sync</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Monitor your workshop and storage locations. Know exactly what you have down to the last resistor.
              </p>
            </div>

            {/* Small Card 2 */}
            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow group">
              <Calculator className="text-amber-500 mb-6" size={40} />
              <h3 className="text-xl font-bold text-foreground mb-3">Instant Math</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our calculator instantly checks current stock against your BOMs to tell you exactly how many units you can build right now.
              </p>
            </div>

            {/* Large Card 2 */}
            <div className="md:col-span-2 bg-gradient-to-br from-card to-indigo-50/50 dark:to-indigo-950/20 border border-border rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow group overflow-hidden relative">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/4 group-hover:bg-purple-500/20 transition-colors" />
              <BarChart3 className="text-purple-500 mb-6" size={40} />
              <h3 className="text-2xl font-bold text-foreground mb-3">Manufacturing Analytics</h3>
              <p className="text-muted-foreground max-w-md text-base leading-relaxed">
                Generate instant reports on inventory value, component shortages, and cost-of-goods-sold (COGS) to keep your supply chain lean and profitable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WORKFLOW / HOW IT WORKS */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">From raw materials to finished goods</h2>
            <p className="text-muted-foreground text-lg">A seamless workflow designed for hardware engineers, not accountants.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent" />

            {[
              { step: '01', icon: HardDrive, title: 'Input Components', desc: 'Log your raw parts, microchips, and hardware into the AMS inventory system.' },
              { step: '02', icon: Layers, title: 'Map Structures', desc: 'Visually map out how those components come together to form your final product.' },
              { step: '03', icon: PackageCheck, title: 'Assemble & Ship', desc: 'Execute builds. AMS automatically deducts the raw components from your stock.' }
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-card border border-border rounded-2xl flex items-center justify-center shadow-lg mb-6 relative group hover:-translate-y-2 transition-transform duration-300">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-md">
                    {item.step}
                  </div>
                  <item.icon size={36} className="text-indigo-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm max-w-[250px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. STATS / TRUST */}
      <section className="py-20 bg-indigo-600 dark:bg-indigo-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            {[
              { value: '50M+', label: 'Components Tracked' },
              { value: '99.9%', label: 'Inventory Accuracy' },
              { value: '0', label: 'Surprise Stock-Outs' },
              { value: '10K+', label: 'Products Shipped' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-200">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-indigo-200 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PROMO / CTA */}
      <PromoSection />

    </div>
  );
}
