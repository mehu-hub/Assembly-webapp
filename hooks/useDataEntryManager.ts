import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/toast';
import { ToastStatus } from '@/lib/types';

export const dataEntryFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
});

export type DataEntryFormValues = z.infer<typeof dataEntryFormSchema>;

export function useDataEntryManager() {
  const [entries, setEntries] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { addToast } = useToast();
  
  const form = useForm<DataEntryFormValues>({
    resolver: zodResolver(dataEntryFormSchema),
    defaultValues: { title: '', content: '', category: '' }
  });

  const fetchEntries = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/data-entry');
      const data = await res.json();
      if (Array.isArray(data)) setEntries(data);
    } catch (err) {
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleSave = React.useCallback(async (data: DataEntryFormValues) => {
    try {
      const res = await fetch('/api/data-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to save');
      
      addToast({ type: ToastStatus.SUCCESS, title: 'Success', message: 'Data saved successfully.' });
      form.reset();
      fetchEntries();
    } catch (err) {
      addToast({ type: ToastStatus.ERROR, title: 'Error', message: 'Failed to save data.' });
    }
  }, [addToast, form, fetchEntries]);

  const handleDelete = React.useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/data-entry/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete');
      addToast({ type: ToastStatus.SUCCESS, title: 'Deleted', message: 'Data entry removed.' });
      fetchEntries();
    } catch (err) {
      addToast({ type: ToastStatus.ERROR, title: 'Error', message: 'Failed to delete data entry.' });
    }
  }, [addToast, fetchEntries]);

  return {
    entries,
    isLoading,
    form,
    handleSave,
    handleDelete
  };
}
