'use client';

import * as React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Cpu, Hexagon } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-background border-t border-border mt-auto relative z-10">
      <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Side: Copyright Info */}
        <div className="order-3 md:order-1 text-center md:text-left">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Mehedi Hasan. All rights reserved.
          </p>
        </div>

        {/* Center: Brand Logo */}
        <div className="order-1 md:order-2 flex justify-center">
          <Link href="/" className="flex items-center gap-2 group" aria-label="Home">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-sm overflow-hidden">
              <Hexagon className="absolute text-foreground/20 w-5 h-5 rotate-90" strokeWidth={1.5} />
              <Cpu size={14} className="text-foreground relative z-10" />
            </div>
            <span className="text-sm font-bold tracking-tight text-foreground">
              AMS <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider ml-0.5">Assembly</span>
            </span>
          </Link>
        </div>

        {/* Right Side: Social Icons */}
        <div className="order-2 md:order-3 flex items-center justify-center gap-5 text-muted-foreground">
          <a 
            href="https://github.com/mehu-hub" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-all duration-150" 
            aria-label="GitHub"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
          <a 
            href="https://www.linkedin.com/in/mehedihasan-in/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-all duration-150" 
            aria-label="LinkedIn"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
          <a 
            href="https://www.facebook.com/mehedii.n.hasan/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-all duration-150" 
            aria-label="Facebook"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>
        </div>

      </div>
    </footer>
  );
}
