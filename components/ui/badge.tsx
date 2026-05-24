import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-white/5 text-slate-300',
        success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
        warning: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
        danger: 'border-red-500/20 bg-red-500/10 text-red-400',
        info: 'border-indigo-500/20 bg-indigo-500/10 text-indigo-400',
        outline: 'border-white/10 text-slate-300 bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export function StockBadge({ qty }: { qty: number }) {
  if (qty <= 3) return <Badge variant="danger">Low Stock ({qty})</Badge>;
  if (qty <= 8) return <Badge variant="warning">Limited ({qty})</Badge>;
  return <Badge variant="success">In Stock ({qty})</Badge>;
}

export { Badge, badgeVariants };
