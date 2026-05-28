import * as React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Cpu, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PromoSection() {
  return (
    <section className="mt-24 mb-12 relative overflow-hidden rounded-[2.5rem] mx-4 lg:mx-auto max-w-6xl shadow-2xl">
      {/* Deep, clean dark background */}
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e515_1px,transparent_1px),linear-gradient(to_bottom,#4f46e515_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Smooth glowing orbs for that premium feel */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="relative z-10 px-6 py-24 md:py-32 flex flex-col items-center text-center">
        {/* Subtle top badge */}
        <div className="inline-flex items-center justify-center p-3.5 bg-indigo-500/10 rounded-2xl mb-8 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
          <Cpu size={32} className="text-indigo-400" />
        </div>
        
        {/* Big confident headline */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 max-w-4xl leading-[1.15]">
          Ready to assemble the <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">future of hardware?</span>
        </h2>
        
        {/* Subtext */}
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
          Join modern manufacturing teams who are streamlining their production, eliminating stock-outs, and building better products with AMS.
        </p>
        
        {/* Call to action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth?mode=signup">
            <Button className="h-14 px-8 text-base bg-indigo-600 hover:bg-indigo-500 text-white border-0 rounded-xl shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95">
              Start Building for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/auth?mode=login">
            <Button variant="outline" className="h-14 px-8 text-base border-white/20 hover:bg-white/10 text-white bg-transparent rounded-xl transition-all hover:scale-105 active:scale-95">
              Sign In to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
