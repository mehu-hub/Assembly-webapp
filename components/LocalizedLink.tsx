'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export function LocalizedLink({ href, children, ...props }: React.ComponentProps<typeof Link>) {
  const params = useParams();
  const lang = params?.lang || 'en';
  
  let localizedHref = href;
  if (typeof href === 'string' && href.startsWith('/')) {
    localizedHref = `/${lang}${href === '/' ? '' : href}`;
  }

  return (
    <Link href={localizedHref} {...props}>
      {children}
    </Link>
  );
}
