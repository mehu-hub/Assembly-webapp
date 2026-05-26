// Plain types for the SimpleForm component — no directives, safe for client + server imports.

export interface FormState {
  errors: Record<string, string>;
  success?: boolean;
  message?: string;
}

export const initialSimpleFormState: FormState = { errors: {} };
