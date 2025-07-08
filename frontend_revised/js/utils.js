// frontend_revised/js/utils.js

/**
 * Save JWT to localStorage
 * @param {string} token 
 */
function saveToken(token) {
  localStorage.setItem('jwt', token);
}

/**
 * Get JWT token from localStorage
 * @returns {string|null}
 */
function getToken() {
  return localStorage.getItem('jwt');
}

/**
 * Remove JWT token (e.g. on logout)
 */
function clearToken() {
  localStorage.removeItem('jwt');
}

/**
 * Generic fetch wrapper
 * @param {string} url - The endpoint
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @param {boolean} authRequired - Whether to include Authorization header
 * @returns {Promise<object>} - JSON response
 */
async function apiRequest(url, options = {}, authRequired = false) {
  const headers = options.headers || {
    'Content-Type': 'application/json'
  };

  if (authRequired) {
    const token = getToken();
    if (!token) throw new Error('Authentication token not found.');
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'API request failed');
  }

  return res.json();
}

/**
 * Show alert box (placeholder for fancier UI)
 * @param {string} message 
 */
function showAlert(message) {
  alert(message);
}

