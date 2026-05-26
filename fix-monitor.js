const id = '6a14466cd56c378a5f5a05ff';

async function run() {
  const updateRes = await fetch(`http://localhost:3000/api/components/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Monitor 27" 144Hz', unit: 'pcs', description: '27 inch IPS gaming monitor 144Hz' })
  });
  console.log('Update component:', await updateRes.json());

  const invRes = await fetch('http://localhost:3000/api/inventory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      componentId: id,
      workshopQty: 5,
      storageQty: 10,
      unitPrice: 249.99
    })
  });
  console.log('Created inventory:', await invRes.json());
}

run();
