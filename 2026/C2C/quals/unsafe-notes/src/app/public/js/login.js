import * as API from './api.js';

const loginForm = document.getElementById('loginForm');
const errorDiv = document.getElementById('error');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  try {
    await API.login(username, password);
    window.location.href = '/';
  } catch (error) {
    errorDiv.textContent = error.message;
    errorDiv.style.display = 'block';
  }
});
