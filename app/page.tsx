'use client';

import * as React from 'react';
import Link from 'next/link';
import { Package, Cpu, Archive, Wrench, ArrowRight, CheckCircle2, HardDrive, Monitor, Zap, Server } from 'lucide-react';
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

          {/* Minimal Animated Tech Graphic */}
          <div className="relative mt-20 mb-8 w-full max-w-3xl mx-auto h-48 sm:h-64 flex items-center justify-center">
            {/* Center glowing orb */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
            </div>
            
            {/* Center CPU element */}
            <div className="relative z-20 w-20 h-20 sm:w-24 sm:h-24 bg-white/90 backdrop-blur-md border border-indigo-200 rounded-2xl shadow-xl flex items-center justify-center animate-bounce" style={{ animationDuration: '4s' }}>
              <Cpu size={40} className="text-indigo-600" />
              <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-2xl animate-ping" style={{ animationDuration: '3s' }}></div>
            </div>

            {/* Floating Components */}
            {/* Top Left */}
            <div className="absolute z-10 left-[10%] sm:left-[20%] top-[10%] w-12 h-12 sm:w-16 sm:h-16 bg-white border border-slate-200 rounded-xl shadow-lg flex items-center justify-center animate-bounce" style={{ animationDuration: '5s', animationDelay: '0.5s' }}>
              <HardDrive size={24} className="text-slate-500" />
            </div>
            
            {/* Top Right */}
            <div className="absolute z-10 right-[10%] sm:right-[20%] top-[20%] w-12 h-12 sm:w-16 sm:h-16 bg-white border border-slate-200 rounded-xl shadow-lg flex items-center justify-center animate-bounce" style={{ animationDuration: '6s', animationDelay: '1s' }}>
              <Server size={24} className="text-emerald-500" />
            </div>

            {/* Bottom Left */}
            <div className="absolute z-10 left-[20%] sm:left-[25%] bottom-[10%] w-12 h-12 sm:w-16 sm:h-16 bg-white border border-slate-200 rounded-xl shadow-lg flex items-center justify-center animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}>
              <Monitor size={24} className="text-blue-500" />
            </div>

            {/* Bottom Right */}
            <div className="absolute z-10 right-[15%] sm:right-[25%] bottom-[15%] w-12 h-12 sm:w-16 sm:h-16 bg-white border border-slate-200 rounded-xl shadow-lg flex items-center justify-center animate-bounce" style={{ animationDuration: '5.5s', animationDelay: '2s' }}>
              <Zap size={24} className="text-amber-500" />
            </div>

            {/* Connecting Lines (Simulated with absolute divs) */}
            <div className="absolute top-1/2 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent z-0"></div>
            <div className="absolute left-1/2 top-[20%] bottom-[20%] w-px bg-gradient-to-b from-transparent via-indigo-200 to-transparent z-0"></div>
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

        {/* Conditional Logged In Welcome Section */}
        {user && (
          <section className="py-12 mt-12 bg-white/60 border border-slate-200/50 rounded-3xl p-8 backdrop-blur-sm shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back, {user.name}!</h2>
            <p className="text-slate-500 mb-6 text-sm">Quick actions and shortcuts to manage your assembly workspace:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow transition-shadow">
                <h4 className="text-sm font-semibold text-slate-800 mb-1">Add Components</h4>
                <p className="text-xs text-slate-400">Manage workshop and storage inventory</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow transition-shadow">
                <h4 className="text-sm font-semibold text-slate-800 mb-1">Run Calculations</h4>
                <p className="text-xs text-slate-400">Calculate assemblable product quotas</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow transition-shadow">
                <h4 className="text-sm font-semibold text-slate-800 mb-1">Check Reports</h4>
                <p className="text-xs text-slate-400">Generate BOM and pricing sheets</p>
              </div>
            </div>
          </section>
        )}
        {/* Client Reviews Section */}
        <section className="py-16 mt-16 border-t border-slate-200/50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-slate-900">What Our Users Say</h2>
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
                <Card key={i} className="border-slate-100 bg-white/85 shadow-sm backdrop-blur-sm">
                  <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div>
                      {/* Star rating */}
                      <div className="flex gap-0.5 mb-3 text-amber-500 text-sm">
                        {Array.from({ length: review.rating }).map((_, idx) => (
                          <span key={idx}>★</span>
                        ))}
                      </div>
                      <p className="text-sm text-slate-600 italic leading-relaxed mb-4">
                        "{review.quote}"
                      </p>
                    </div>
                    <div className="border-t border-slate-100 pt-3 mt-auto">
                      <h4 className="text-xs font-semibold text-slate-800">{review.author}</h4>
                      <p className="text-[10px] text-slate-400">{review.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
  );
}
