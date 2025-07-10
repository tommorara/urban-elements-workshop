// Toggle modal visibility
function toggleAuthModal(show = true) {
  const overlay = document.getElementById('auth-overlay');
  if (!overlay) return;
  overlay.classList.toggle('hidden', !show);
  switchToLogin(); // Default to login view
}

// Switch between login and register views
function switchToRegister() {
  document.getElementById('login-form-wrapper')?.classList.add('hidden');
  document.getElementById('register-form-wrapper')?.classList.remove('hidden');
}

function switchToLogin() {
  document.getElementById('register-form-wrapper')?.classList.add('hidden');
  document.getElementById('login-form-wrapper')?.classList.remove('hidden');
}

// Update navbar UI based on login state
function updateNavUI(forceLoggedIn = null) {
  const token = localStorage.getItem('token');
  const isLoggedIn = forceLoggedIn || !!token;
  const navList = document.querySelector('.nav ul');

  if (!navList) return;

  // Remove any existing Logout link first
  const existingLogout = document.getElementById('logout-link');
  if (existingLogout) {
    existingLogout.parentElement?.remove();
  }

  if (isLoggedIn) {
    const logoutLi = document.createElement('li');
    logoutLi.innerHTML = `<a href="#" id="logout-link">Logout</a>`;
    navList.appendChild(logoutLi);

    document.getElementById('logout-link').addEventListener('click', () => {
      localStorage.removeItem('token');
      updateNavUI(false);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const customLink = document.querySelector('a[href="custom.html"]') || document.getElementById('open-custom-order');
  const closeBtns = document.querySelectorAll('.auth-close, .close-btn');

  // Close modal buttons
  closeBtns.forEach(btn => btn.addEventListener('click', () => toggleAuthModal(false)));

  // Login submit
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        toggleAuthModal(false);
        updateNavUI(true);
      } else {
        alert(data.message || 'Login failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Login request failed.');
    }
  });

  // Register submit
  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        toggleAuthModal(false);
        updateNavUI(true);
      } else {
        alert(data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Registration request failed.');
    }
  });

  // Intercept "Custom Orders" link if not logged in
  customLink?.addEventListener('click', (e) => {
    const token = localStorage.getItem('token');
    if (!token) {
      e.preventDefault();
      toggleAuthModal(true);
    }
  });

  updateNavUI();
});
