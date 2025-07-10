document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('product-list');
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

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

    // Render product cards
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

      card.querySelector('.order-btn').addEventListener('click', () => {
        if (!token) {
          toggleAuthModal(true); // show login/register modal
          return;
        }

        // Show order modal and autofill
        document.getElementById('order-modal').classList.remove('hidden');
        document.getElementById('order-product').value = product.name;

        // Autofill and hide name/email for logged-in users
        if (user) {
          document.getElementById('order-name').value = user.name;
          document.getElementById('order-email').value = user.email;
          document.getElementById('order-name-wrapper').style.display = 'none';
          document.getElementById('order-email-wrapper').style.display = 'none';
        } else {
          document.getElementById('order-name').value = '';
          document.getElementById('order-email').value = '';
          document.getElementById('order-name-wrapper').style.display = 'block';
          document.getElementById('order-email-wrapper').style.display = 'block';
        }
      });

      container.appendChild(card);
    });

    // Modal close
    const modal = document.getElementById('order-modal');
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    window.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });

    // Submit order
    document.getElementById('order-form').addEventListener('submit', async (e) => {
      e.preventDefault();

      const payload = {
        product: document.getElementById('order-product').value,
        phone: document.getElementById('order-phone').value,
        address: document.getElementById('order-address').value,
        quantity: parseInt(document.getElementById('order-quantity').value, 10),
      };

      // Add name/email for guests
      if (!token || !user) {
        payload.name = document.getElementById('order-name').value;
        payload.email = document.getElementById('order-email').value;
      }

      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          alert('❌ ' + (data.message || 'Order submission failed.'));
          return;
        }

        alert('✅ Order submitted successfully!');
        modal.classList.add('hidden');
        e.target.reset();
      } catch (err) {
        console.error('Submit error:', err);
        alert('❌ Failed to connect to server.');
      }
    });

  } catch (err) {
    console.error('Error loading products:', err);
    container.innerHTML = '<p>❌ Failed to load products. Please try again later.</p>';
  }
});
