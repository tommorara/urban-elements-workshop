// assets/js/global.js

window.addEventListener('DOMContentLoaded', async () => {
  try {
    const [headerRes, footerRes] = await Promise.all([
      fetch('partials/header.html'),
      fetch('partials/footer.html')
    ]);

    const headerHtml = await headerRes.text();
    const footerHtml = await footerRes.text();

    document.getElementById('global-header').innerHTML = headerHtml;
    document.getElementById('global-footer').innerHTML = footerHtml;

    setupGlobalUI();
  } catch (err) {
    console.error('❌ Failed to load header/footer partials:', err);
  }
});

function setupGlobalUI() {
  // Modal toggles
  function toggleAuthModal(show = true) {
    document.getElementById('auth-overlay')?.classList.toggle('hidden', !show);
    switchToLogin();
  }

  function toggleCustomModal(show = true) {
    document.getElementById('custom-order-modal')?.classList.toggle('hidden', !show);
  }

  function switchToLogin() {
    document.getElementById('login-form-wrapper')?.classList.remove('hidden');
    document.getElementById('register-form-wrapper')?.classList.add('hidden');
  }

  function switchToRegister() {
    document.getElementById('register-form-wrapper')?.classList.remove('hidden');
    document.getElementById('login-form-wrapper')?.classList.add('hidden');
  }

  // Make available globally
  window.toggleAuthModal = toggleAuthModal;
  window.toggleCustomModal = toggleCustomModal;
  window.switchToLogin = switchToLogin;
  window.switchToRegister = switchToRegister;

  // Navigation login/logout logic
  const token = localStorage.getItem('token');
  const authLinks = document.getElementById('auth-links');
  const accountLink = document.getElementById('account-link');

  if (authLinks) {
    if (token) {
      authLinks.innerHTML = `<a href="#" id="logout-link">Logout</a>`;
      document.getElementById('logout-link')?.addEventListener('click', () => {
        localStorage.removeItem('token');
        location.reload();
      });
      if (accountLink) accountLink.classList.remove('hidden');
    } else {
      authLinks.innerHTML = `<a href="#" onclick="toggleAuthModal(true)">Login</a>`;
      if (accountLink) accountLink.classList.add('hidden');
    }
  }

  // Custom order button
  document.getElementById('open-custom-order')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.getItem('token') ? toggleCustomModal(true) : toggleAuthModal(true);
  });

  // Login form
  document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        toggleAuthModal(false);
        location.reload();
      } else {
        alert(data.message || 'Login failed');
      }
    } catch {
      alert('Login error');
    }
  });

  // Register form
  document.getElementById('register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        toggleAuthModal(false);
        location.reload();
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch {
      alert('Registration error');
    }
  });

  // Custom order form
  document.getElementById('custom-order-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return toggleAuthModal(true);

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('material', document.getElementById('material').value);
    const image = document.getElementById('referenceImage').files[0];
    if (image) formData.append('image', image);

    try {
      const res = await fetch('/api/custom-orders', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      document.getElementById('custom-message').innerText = res.ok
        ? '✅ Custom order submitted successfully!'
        : '❌ ' + (data.message || 'Error submitting order.');
      if (res.ok) e.target.reset();
    } catch {
      document.getElementById('custom-message').innerText = '❌ Failed to connect to server.';
    }
  });
}
