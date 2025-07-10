// Handle login form submission
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
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
        alert('An error occurred during login.');
      }
    });
  }
});
