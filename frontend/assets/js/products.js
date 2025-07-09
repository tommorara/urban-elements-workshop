document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('product-list');

  try {
    const res = await fetch('/api/products');
    const products = await res.json();

    if (!Array.isArray(products)) {
      container.innerHTML = '<p>❌ Error: Unexpected response format.</p>';
      return;
    }

    if (products.length === 0) {
      container.innerHTML = '<p>No products available at the moment.</p>';
      return;
    }

    // Render each product
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
          <button class="order-btn">Order</button>
        </div>
      `;

      // Add order button click listener
      const orderBtn = card.querySelector('.order-btn');
      orderBtn.addEventListener('click', () => {
        document.getElementById('order-modal').classList.remove('hidden');
        document.getElementById('order-product').value = product.name;
      });

      container.appendChild(card);
    });

    // Modal logic
    const modal = document.getElementById('order-modal');
    const closeBtn = document.querySelector('.close-btn');

    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });

    // Handle form submit
    document.getElementById('order-form').addEventListener('submit', async (e) => {
      e.preventDefault();

      const order = {
        product: document.getElementById('order-product').value,
        name: document.getElementById('order-name').value,
        phone: document.getElementById('order-phone').value,
        email: document.getElementById('order-email').value,
        address: document.getElementById('order-address').value,
        quantity: parseInt(document.getElementById('order-quantity').value, 10),
      };

      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order),
        });

        if (!response.ok) throw new Error('Order submission failed');

        alert('✅ Order submitted successfully!');
        modal.classList.add('hidden');
        e.target.reset();
      } catch (error) {
        alert('❌ Failed to submit order.');
        console.error(error);
      }
    });

  } catch (err) {
    console.error('Error loading products:', err);
    container.innerHTML = '<p>❌ Failed to load products. Please try again later.</p>';
  }
});
 
