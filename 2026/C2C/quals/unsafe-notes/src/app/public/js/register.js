import * as API from './api.js';

const registerForm = document.getElementById('registerForm');
const errorDiv = document.getElementById('error');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  if (username.length <= 5) {
    errorDiv.textContent = 'Username must be more than 6 characters';
    errorDiv.style.display = 'block';
    return;
  }
  
  if (password.length <= 5) {
    errorDiv.textContent = 'Password must be more than 6 characters';
    errorDiv.style.display = 'block';
    return;
  }
  
  try {
    await API.register(username, password);
    window.location.href = '/';
  } catch (error) {
    errorDiv.textContent = error.message;
    errorDiv.style.display = 'block';
  }
});
