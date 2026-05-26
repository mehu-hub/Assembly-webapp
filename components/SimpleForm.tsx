'use client';

import React, { useActionState } from 'react';
import { submitSimpleForm } from '@/lib/actions';
import { type FormState, initialSimpleFormState } from '@/lib/simple-form-types';
import { Loader2 } from 'lucide-react';

export default function SimpleForm({ title }: { title: string }) {
  const [state, formAction, pending] = useActionState(submitSimpleForm, initialSimpleFormState);

  return (
    <div className="mt-8 p-6 border border-border rounded-xl bg-card shadow-sm text-left w-full max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-foreground">{title} Data Form</h3>
      <form action={formAction} className="flex flex-col gap-4">

        {/* Name */}
        <div>
          <label htmlFor={`${title}-name`} className="block text-sm font-medium text-muted-foreground mb-1">Name</label>
          <input
            id={`${title}-name`}
            name="name"
            type="text"
            placeholder="John Doe"
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
          {state.errors.name && (
            <p className="text-red-500 text-xs font-medium mt-1">{state.errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor={`${title}-email`} className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
          <input
            id={`${title}-email`}
            name="email"
            type="text"
            placeholder="john@example.com"
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
          {state.errors.email && (
            <p className="text-red-500 text-xs font-medium mt-1">{state.errors.email}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label htmlFor={`${title}-message`} className="block text-sm font-medium text-muted-foreground mb-1">Message</label>
          <textarea
            id={`${title}-message`}
            name="message"
            rows={3}
            placeholder="Enter your message..."
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow resize-none"
          />
          {state.errors.message && (
            <p className="text-red-500 text-xs font-medium mt-1">{state.errors.message}</p>
          )}
        </div>

        {/* Success banner */}
        {state.success && state.message && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
            {state.message}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {pending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Data'
          )}
        </button>
      </form>
    </div>
  );
}
