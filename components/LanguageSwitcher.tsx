'use client';

import * as React from 'react';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const params = useParams();
  const currentLang = params?.lang || 'en';

  const redirectPath = (locale: string) => {
    if (!pathname) return `/${locale}`;
    const segments = pathname.split('/');
    if (segments[1] === 'en' || segments[1] === 'lt') {
      segments[1] = locale;
    } else {
      segments.splice(1, 0, locale);
    }
    return segments.join('/') || '/';
  };

  return (
    <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
      <Link 
        href={redirectPath('en')}
        className={`px-2 py-1 text-xs font-bold rounded-md transition-colors ${currentLang === 'en' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
      >
        EN
      </Link>
      <Link 
        href={redirectPath('lt')}
        className={`px-2 py-1 text-xs font-bold rounded-md transition-colors ${currentLang === 'lt' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
      >
        LT
      </Link>
    </div>
  );
}
