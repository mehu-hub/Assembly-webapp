'use client';

import * as React from 'react';
import { HelpCircle, ChevronDown, Wrench, Boxes } from 'lucide-react';
import { Card } from '@/components/ui/card';

const faqs = [
  {
    category: 'General',
    icon: HelpCircle,
    questions: [
      {
        q: 'What is the Assembly Management System (AMS)?',
        a: 'AMS is a powerful platform designed to help you manage hardware components, track inventory levels across storage and workshops, and streamline product assemblies. It provides a real-time overview of your manufacturing capabilities.'
      },
      {
        q: 'Who can access the administrative features?',
        a: 'Users with an "ADMIN" role have access to the full suite of features, including user management and destructive actions (like deleting products). Standard users have access to view and manage day-to-day operations.'
      }
    ]
  },
  {
    category: 'Components & Inventory',
    icon: Boxes,
    questions: [
      {
        q: 'How do I add a new component to the system?',
        a: 'You can add new components through the Components menu -> Component List. Once the base component is created, you can allocate its specific quantities to Storage or Workshop in the Inventory Manager.'
      },
      {
        q: "What's the difference between Workshop and Storage inventory?",
        a: 'Storage is generally used for bulk or long-term warehousing of components, while Workshop inventory represents items actively available on the assembly floor. AMS tracks both to give you a complete picture of your total stock.'
      },
      {
        q: 'Can I track component costs?',
        a: 'Yes, you can track the unit price of each component in the Inventory Manager or under the Stock menu. This helps the system calculate the total value of your stock and the estimated production cost of assembled products.'
      }
    ]
  },
  {
    category: 'Products & Assembly',
    icon: Wrench,
    questions: [
      {
        q: 'What is a Product Structure (BOM)?',
        a: 'A Product Structure, or Bill of Materials (BOM), defines the exact components and their respective quantities required to assemble a single unit of a final product.'
      },
      {
        q: 'How does the system calculate how many products I can assemble?',
        a: 'AMS automatically checks the required components in a product\'s structure against your current available inventory (Storage + Workshop). It identifies the "limiting component" (the part you have the least of relative to the requirement) to calculate the maximum possible assemblies.'
      }
    ]
  }
];

function FaqItem({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden transition-all duration-200 hover:border-indigo-500/30 shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 text-left transition-colors focus:outline-none"
      >
        <span className="font-semibold text-foreground text-sm sm:text-base">{q}</span>
        <ChevronDown size={18} className={`text-muted-foreground transition-transform duration-300 flex-shrink-0 ml-4 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
      </button>
      <div 
        className={`px-4 text-sm text-muted-foreground overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="pt-2 border-t border-border">
          {a}
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto py-8 relative z-10">
      
      {/* Title */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-300 dark:border-indigo-500/20 mb-6 shadow-xl shadow-indigo-500/10">
          <HelpCircle size={32} className="text-indigo-400" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
          Everything you need to know about the Assembly Management System. Learn how to manage your inventory, products, and assemblies effectively.
        </p>
      </div>

      {/* FAQ Categories */}
      <div className="flex flex-col gap-12 w-full">
        {faqs.map((category, idx) => (
          <div key={idx} className="flex flex-col gap-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-500/20">
                <category.icon size={20} className="text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-foreground">{category.category}</h2>
            </div>
            
            <div className="flex flex-col gap-3">
              {category.questions.map((item, qIdx) => (
                <FaqItem key={qIdx} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Contact Support Card */}
      <Card className="mt-16 w-full bg-gradient-to-br from-[#0f1117] to-[#0a0d14] border-border p-8 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        <h3 className="text-xl font-bold text-foreground mb-2 relative z-10">Still have questions?</h3>
        <p className="text-sm text-muted-foreground mb-6 relative z-10">Can't find the answer you're looking for? Please contact your system administrator.</p>
        <a href="mailto:support@assembly-system.test" className="relative z-10 inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black font-semibold rounded-lg shadow-lg hover:scale-105 active:scale-95 transition-all duration-200">
          Contact Support
        </a>
      </Card>
    </div>
  );
}
