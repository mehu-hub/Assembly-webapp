import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/toast';
import { ToastStatus } from '@/lib/types';

export const componentsFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  unit: z.string().min(1, 'Unit is required'),
  description: z.string().optional(),
});

export type ComponentsFormValues = z.infer<typeof componentsFormSchema>;

export function useComponentsManager() {
  const [components, setComponents] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  
  const form = useForm<ComponentsFormValues>({
    resolver: zodResolver(componentsFormSchema),
    defaultValues: { name: '', unit: 'pcs', description: '' }
  });
  
  const { addToast } = useToast();

  const fetchComponents = React.useCallback(() => {
    setIsLoading(true);
    fetch('/api/components')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setComponents(data);
        setIsLoading(false);
      })
      .catch(() => {
        setComponents([]);
        setIsLoading(false);
      });
  }, []);

  React.useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  const resetForm = React.useCallback(() => {
    form.reset({ name: '', unit: 'pcs', description: '' });
    setEditingId(null);
  }, [form]);

  const handleEdit = React.useCallback((comp: any) => {
    setEditingId(comp.id);
    form.setValue('name', comp.name);
    form.setValue('unit', comp.unit);
    form.setValue('description', comp.description || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => form.setFocus('name'), 100);
  }, [form]);

  const handleSave = React.useCallback(async (data: ComponentsFormValues) => {
    const payload = { name: data.name, unit: data.unit, description: data.description };

    try {
      if (editingId) {
        const res = await fetch(`/api/components/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to update');
        addToast({ type: ToastStatus.SUCCESS, title: 'Updated', message: 'Component updated successfully.' });
      } else {
        const res = await fetch('/api/components', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to create');
        addToast({ type: ToastStatus.SUCCESS, title: 'Created', message: 'Component created successfully.' });
      }
      resetForm();
      fetchComponents();
    } catch (err) {
      addToast({ type: ToastStatus.ERROR, title: 'Error', message: 'Failed to save component.' });
    }
  }, [editingId, addToast, resetForm, fetchComponents]);

  const handleDelete = React.useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/components/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete');
      addToast({ type: ToastStatus.SUCCESS, title: 'Deleted', message: 'Component removed.' });
      fetchComponents();
    } catch (err) {
      addToast({ type: ToastStatus.ERROR, title: 'Error', message: 'Failed to delete component.' });
    }
  }, [addToast, fetchComponents]);

  return {
    components,
    isLoading,
    editingId,
    form,
    resetForm,
    handleEdit,
    handleSave,
    handleDelete
  };
}
