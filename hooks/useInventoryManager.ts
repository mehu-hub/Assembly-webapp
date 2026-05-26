import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/toast';
import { ToastStatus } from '@/lib/types';

export const inventoryFormSchema = z.object({
  componentId: z.string().min(1, 'Component is required'),
  workshopQty: z.coerce.number().min(0, 'Must be 0 or more'),
  storageQty: z.coerce.number().min(0, 'Must be 0 or more'),
  unitPrice: z.coerce.number().min(0, 'Must be 0 or more'),
});

export type InventoryFormValues = z.infer<typeof inventoryFormSchema>;

export function useInventoryManager() {
  const [inventory, setInventory] = React.useState<any[]>([]);
  const [components, setComponents] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  
  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryFormSchema) as any,
    defaultValues: { componentId: '', workshopQty: 0, storageQty: 0, unitPrice: 0 }
  });
  
  const { addToast } = useToast();

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [invRes, compRes] = await Promise.all([
        fetch('/api/inventory'),
        fetch('/api/components')
      ]);
      const invData = await invRes.json();
      const compData = await compRes.json();
      
      if (Array.isArray(invData)) setInventory(invData);
      if (Array.isArray(compData)) setComponents(compData);
    } catch (e) {
      setInventory([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetForm = React.useCallback(() => {
    form.reset({ componentId: '', workshopQty: 0, storageQty: 0, unitPrice: 0 });
    setEditingId(null);
  }, [form]);

  const handleEdit = React.useCallback((inv: any) => {
    setEditingId(inv.id);
    form.setValue('componentId', inv.componentId);
    form.setValue('workshopQty', inv.workshopQty);
    form.setValue('storageQty', inv.storageQty);
    form.setValue('unitPrice', inv.unitPrice);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => form.setFocus('componentId'), 100);
  }, [form]);

  const handleSave = React.useCallback(async (data: InventoryFormValues) => {
    try {
      if (editingId) {
        const res = await fetch(`/api/inventory/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to update');
        addToast({ type: ToastStatus.SUCCESS, title: 'Updated', message: 'Inventory updated successfully.' });
      } else {
        const res = await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to create');
        addToast({ type: ToastStatus.SUCCESS, title: 'Created', message: 'Inventory created successfully.' });
      }
      resetForm();
      fetchData();
    } catch (err) {
      addToast({ type: ToastStatus.ERROR, title: 'Error', message: 'Failed to save inventory.' });
    }
  }, [editingId, addToast, resetForm, fetchData]);

  const handleDelete = React.useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete');
      addToast({ type: ToastStatus.SUCCESS, title: 'Deleted', message: 'Inventory removed.' });
      fetchData();
    } catch (err) {
      addToast({ type: ToastStatus.ERROR, title: 'Error', message: 'Failed to delete inventory.' });
    }
  }, [addToast, fetchData]);

  return {
    inventory,
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
