// Handle register form submission
document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async function (e) {
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
        alert('An error occurred during registration.');
      }
    });
  }
});
