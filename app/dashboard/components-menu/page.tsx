import React from 'react';
import { Cpu } from 'lucide-react';

export default function Page() {
  return (
    <div className="relative z-10 flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Cpu className="text-indigo-400" size={26} />
            Components Menu
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Select an option from the menu to continue.</p>
        </div>
      </div>
      <div className="p-8 border border-border rounded-xl bg-card text-center text-muted-foreground">
        This is the overview page for Components Menu. Use the navigation to access specific tools.
      </div>
    </div>
  );
}
