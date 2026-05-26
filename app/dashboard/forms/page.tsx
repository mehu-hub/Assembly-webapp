import { redirect } from 'next/navigation';
import { FormSection } from '@/lib/form-enums';

export default function FormsIndexPage() {
  redirect(`/dashboard/forms/${FormSection.Products}`);
}
