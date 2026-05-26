'use server';

import { z } from 'zod';
import { type FormState as SimpleFormState } from '@/lib/simple-form-types';

const formSchema = z.object({
  name:    z.string().min(2, "Name must be at least 2 characters long."),
  email:   z.string().email("Please enter a valid email address."),
  message: z.string().min(5, "Message must be at least 5 characters long.")
});

export async function submitSimpleForm(
  prevState: SimpleFormState,
  formData: FormData,
): Promise<SimpleFormState> {
  const parsed = formSchema.safeParse({
    name:    formData.get('name') as string,
    email:   formData.get('email') as string,
    message: formData.get('message') as string,
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    parsed.error.issues.forEach(issue => {
      const key = String(issue.path[0]);
      errors[key] = issue.message;
    });
    return { errors };
  }

  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: "Form submitted successfully!", errors: {} };
}
