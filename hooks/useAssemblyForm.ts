import * as React from 'react';
import { useToast } from '@/components/ui/toast';
import { useSearchParams } from 'next/navigation';
import { ToastStatus } from '@/lib/types';

export function generateId(prefix: string) {
  return `${prefix}-` + String(Math.floor(Math.random() * 9000) + 1000);
}

export function useAssemblyForm() {
  const { addToast } = useToast();
  const searchParams = useSearchParams();
  const editId = searchParams.get('editId');

  const [productName, setProductName] = React.useState('');
  const [price, setPrice] = React.useState<string>('');
  const [error, setError] = React.useState('');

  const [componentsList, setComponentsList] = React.useState<any[]>([]);
  const [productsList, setProductsList] = React.useState<any[]>([]);

  const [assemblyParts, setAssemblyParts] = React.useState([
    { id: 'temp-initial', componentId: '', quantity: 1 }
  ]);

  React.useEffect(() => {
    fetch('/api/components').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setComponentsList(data);
      else { setComponentsList([]); setError(data.error || 'Failed to fetch components'); }
    }).catch(() => setComponentsList([]));

    fetch('/api/products').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setProductsList(data);
      else setProductsList([]);
    }).catch(() => setProductsList([]));

    if (editId) {
      fetch(`/api/products/${editId}`)
        .then(r => r.json())
        .then(productToEdit => {
          if (productToEdit && !productToEdit.error) {
            setProductName(productToEdit.name);
            setPrice(productToEdit.price !== undefined ? productToEdit.price.toString() : '');
            
            if (productToEdit.assemblyParts && productToEdit.assemblyParts.length > 0) {
              setAssemblyParts(productToEdit.assemblyParts.map((b: any) => ({
                id: generateId('temp'),
                componentId: b.componentId,
                quantity: b.quantity
              })));
            }
          }
        });
    }
  }, [editId]);

  function handleAddPart() {
    setAssemblyParts((prev) => [
      ...prev,
      { id: generateId('temp'), componentId: '', quantity: 1 }
    ]);
  }

  function handleRemovePart(id: string) {
    if (assemblyParts.length <= 1) return;
    setAssemblyParts((prev) => prev.filter((p) => p.id !== id));
  }

  function handlePartChange(id: string, field: 'componentId' | 'quantity', value: any) {
    setAssemblyParts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const name = productName.trim();
    if (!name) { setError('Product name is required.'); return; }

    const isDuplicate = productsList.some(
      (p) => p.name.toLowerCase() === name.toLowerCase() && p.id !== editId
    );
    if (isDuplicate) { setError('A product with this name already exists.'); return; }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) { setError('Please enter a valid price.'); return; }

    const hasEmptyComponent = assemblyParts.some((p) => !p.componentId);
    if (hasEmptyComponent) { setError('Please select a component for all rows.'); return; }

    const hasInvalidQty = assemblyParts.some((p) => p.quantity < 1);
    if (hasInvalidQty) { setError('Quantity must be at least 1 for all components.'); return; }

    const payload = {
      name,
      description: 'Assembled product',
      price: numPrice,
      assemblyParts: assemblyParts.map(p => ({
        componentId: p.componentId,
        quantity: Number(p.quantity)
      }))
    };

    try {
      if (editId) {
        const res = await fetch(`/api/products/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to update');
      } else {
        const res = await fetch(`/api/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to create');
      }

      addToast({
        type: ToastStatus.SUCCESS,
        title: editId ? 'Assembly Updated' : 'Assembly Created',
        message: `${name} and its components have been saved successfully.`,
      });

      if (!editId) {
        setProductName('');
        setPrice('');
        setAssemblyParts([{ id: generateId('temp'), componentId: '', quantity: 1 }]);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    }
  }

  return {
    editId,
    productName,
    setProductName,
    price,
    setPrice,
    error,
    setError,
    componentsList,
    assemblyParts,
    handleAddPart,
    handleRemovePart,
    handlePartChange,
    handleSubmit
  };
}
