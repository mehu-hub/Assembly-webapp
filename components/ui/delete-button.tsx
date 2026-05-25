'use client';

import * as React from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeleteButtonProps {
  onConfirm: () => void;
  className?: string;
}

export function DeleteButton({ onConfirm, className }: DeleteButtonProps) {
  const [isConfirming, setIsConfirming] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isConfirming) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsConfirming(false);
      onConfirm();
    } else {
      setIsConfirming(true);
      timeoutRef.current = setTimeout(() => {
        setIsConfirming(false);
      }, 3000);
    }
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <button 
      onClick={handleClick}
      className={cn(
        "p-2 rounded-lg transition-all duration-300 flex items-center overflow-hidden",
        isConfirming 
          ? "bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse" 
          : "text-slate-500 hover:text-red-400 hover:bg-red-500/10",
        className
      )}
    >
      <div className={cn(
        "flex items-center transition-all duration-300",
        isConfirming ? "gap-2" : "gap-0"
      )}>
        {isConfirming ? (
          <AlertCircle size={16} className="animate-bounce" />
        ) : (
          <Trash2 size={16} className="group-hover:rotate-12 transition-transform" />
        )}
        <span className={cn(
          "text-xs font-bold whitespace-nowrap overflow-hidden transition-all duration-300",
          isConfirming ? "w-16 opacity-100" : "w-0 opacity-0"
        )}>
          Confirm?
        </span>
      </div>
    </button>
  );
}
