import * as React from 'react';

export function useProductStructure() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [liveProducts, setLiveProducts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  function fetchProducts() {
    setIsLoading(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLiveProducts(data);
        else setLiveProducts([]);
        setIsLoading(false);
      })
      .catch(() => {
        setLiveProducts([]);
        setIsLoading(false);
      });
  }

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = liveProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleDelete(id: string) {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setLiveProducts(liveProducts.filter(p => p.id !== id));
    setDeleteId(null);
  }

  return {
    searchTerm,
    setSearchTerm,
    isLoading,
    deleteId,
    setDeleteId,
    filteredProducts,
    handleDelete,
    reload: fetchProducts,
  };
}
