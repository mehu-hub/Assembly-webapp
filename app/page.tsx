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
      </div>
  );
}
