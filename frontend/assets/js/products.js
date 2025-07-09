document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('product-list');

  try {
    const res = await fetch('/api/products');
    const products = await res.json();

    if (!Array.isArray(products)) {
      container.innerHTML = '<p>⚠️ Error: Unexpected response format.</p>';
      return;
    }

    if (products.length === 0) {
      container.innerHTML = '<p>No products available at the moment.</p>';
      return;
    }

    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';

      card.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}" class="product-image" />
        <div class="product-details">
          <h2>${product.name}</h2>
          <p><strong>Description:</strong> ${product.description}</p>
          <p><strong>Category:</strong> ${product.category}</p>
          <p><strong>Materials:</strong> ${Array.isArray(product.material) ? product.material.join(', ') : product.material}</p>
          <p class="price">Ksh ${product.price.toLocaleString()}</p>
        </div>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error('Error loading products:', err);
    container.innerHTML = '<p>❌ Failed to load products. Please try again later.</p>';
  }
});

