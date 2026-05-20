import * as React from 'react';
import Link from 'next/link';
import { Package, Cpu, Archive, Wrench, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function WelcomePage() {
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
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight mb-6">
            Streamline your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Manufacturing</span> Process
          </h1>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            The all-in-one platform for modern hardware manufacturers. Track components, define product structures, and calculate assembly possibilities in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/auth?mode=signup">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 text-base">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth?mode=login">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base border-slate-200 hover:bg-slate-50">
                Sign In to Dashboard
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 border border-slate-200/50 bg-white/60 backdrop-blur-sm rounded-3xl shadow-sm mt-auto">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900">Everything you need to scale</h2>
              <p className="text-slate-500 mt-2">Powerful tools designed specifically for hardware assembly operations.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <Card key={i} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow bg-white">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                      <feature.icon size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Feature Spotlight Section */}
        <section className="py-16 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              <CheckCircle2 size={12} className="text-indigo-600" />
              <span>Production Optimization</span>
            </div>
            <h2 className="text-3.5xl font-bold tracking-tight text-slate-900 leading-tight">
              Optimize your warehouse and assembly workflows in one view
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Track manufacturing pipelines, resolve component bottlenecks before they occur, and analyze cost margins instantly with our smart bill-of-materials calculator.
            </p>
            <ul className="space-y-3">
              {[
                "Automatic component depletion tracking during assembly runs",
                "Detailed pricing calculations and margins per product configuration",
                "Advanced notifications when components drop below buffer stock levels"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative rounded-2xl border border-slate-200/60 bg-white/70 p-8 shadow-md backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Wrench size={16} className="text-indigo-600" />
              Assembly Calculator Preview
            </h4>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Selected Product</span>
                  <span>Assemblable Qty</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-800">Advanced IoT Module</span>
                  <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">42 Units</span>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-500">Component Requirements:</span>
                {[
                  { name: "Microprocessor v2", req: "1x", stock: "87 in stock", ok: true },
                  { name: "Bluetooth Transceiver", req: "1x", stock: "45 in stock", ok: true },
                  { name: "LED Status Ring", req: "2x", stock: "112 in stock", ok: true }
                ].map((comp, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-white border border-slate-100 shadow-sm">
                    <span className="text-slate-700">{comp.name} <span className="text-slate-400">({comp.req})</span></span>
                    <span className="text-[10px] font-semibold text-slate-500">{comp.stock}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
  );
}
