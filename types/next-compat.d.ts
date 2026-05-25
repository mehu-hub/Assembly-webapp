/**
 * Standalone `tsc --noEmit` compatibility shim for Next.js 16.
 *
 * Next.js resolves these modules through its custom TypeScript plugin
 * (the `"plugins": [{ "name": "next" }]` entry in tsconfig.json), which
 * only runs inside the IDE language service and the Next.js compiler.
 *
 * When running `tsc --noEmit` directly, TypeScript falls back to the
 * 6-byte stub files in `node_modules/next/` which have no exports,
 * producing TS2306 "not a module" errors.
 *
 * These ambient declarations satisfy standalone TSC without affecting
 * runtime or IDE behaviour (the real plugin types take precedence there).
 */

export {};

declare module 'next/navigation' {
  export interface AppRouterInstance {
    push(href: string, options?: { scroll?: boolean }): void;
    replace(href: string, options?: { scroll?: boolean }): void;
    back(): void;
    forward(): void;
    refresh(): void;
    prefetch(href: string): void;
  }
  export function useRouter(): AppRouterInstance;
  export function usePathname(): string;
  export function useSearchParams(): {
    get(key: string): string | null;
    getAll(key: string): string[];
    has(key: string): boolean;
    toString(): string;
    entries(): IterableIterator<[string, string]>;
    keys(): IterableIterator<string>;
    values(): IterableIterator<string>;
  };
  export function redirect(url: string, type?: 'replace' | 'push'): never;
  export function permanentRedirect(url: string): never;
  export function notFound(): never;
}

declare module 'next/font/google' {
  interface FontOptions {
    subsets?: string[];
    variable?: string;
    weight?: string | string[];
    style?: string | string[];
    display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
    preload?: boolean;
    fallback?: string[];
    adjustFontFallback?: boolean;
  }
  interface FontResult {
    className: string;
    style: { fontFamily: string; fontWeight?: number; fontStyle?: string };
    variable: string;
  }
  type FontFn = (options: FontOptions) => FontResult;
  export const Inter: FontFn;
  export const Roboto: FontFn;
  export const Outfit: FontFn;
  export const Montserrat: FontFn;
  export const Poppins: FontFn;
  export const Open_Sans: FontFn;
  export const Source_Code_Pro: FontFn;
  export const JetBrains_Mono: FontFn;
}
