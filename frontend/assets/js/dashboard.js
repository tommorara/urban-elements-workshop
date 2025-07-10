document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login to access the dashboard.');
    window.location.href = 'login.html';
    return;
  }

  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });

  // Tab switching
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(tab => tab.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });

  // Handle Custom Order Form Submission
  const orderForm = document.getElementById('customOrderForm');
  const orderMessage = document.getElementById('orderMessage');

  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(orderForm);

    try {
      const res = await fetch('/api/custom-requests', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        orderMessage.innerHTML = `<p style="color:green;">Order submitted successfully!</p>`;
        orderForm.reset();
      } else {
        orderMessage.innerHTML = `<p style="color:red;">${data.message || 'Error submitting order'}</p>`;
      }

    } catch (err) {
      console.error(err);
      orderMessage.innerHTML = `<p style="color:red;">Server error. Please try again.</p>`;
    }
  });

  // Fetch and show user's orders
  async function loadOrders() {
    try {
      const res = await fetch('/api/custom-requests/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const orders = await res.json();

      const tableBody = document.querySelector('#ordersTable tbody');
      tableBody.innerHTML = '';

      orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${order._id}</td>
          <td>${order.itemName}</td>
          <td>${order.status}</td>
          <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        `;
        tableBody.appendChild(row);
      });

    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  }

  loadOrders();
});

