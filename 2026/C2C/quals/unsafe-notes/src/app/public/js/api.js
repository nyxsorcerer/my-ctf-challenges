async function fetchAPI(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  
  return data;
}

export async function register(username, password) {
  return fetchAPI('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
}

export async function login(username, password) {
  return fetchAPI('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
}

export async function logout() {
  return fetchAPI('/api/auth/logout', { method: 'POST' });
}

export async function checkAuth() {
  try {
    return await fetchAPI('/api/auth/me');
  } catch (error) {
    throw new Error("Need to Login");
  }
}

export async function getNotes() {
  return fetchAPI('/api/notes');
}

export async function getNote(id) {
  return fetchAPI(`/api/notes/${id}`);
}

export async function createNote(title, content) {
  return fetchAPI('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content })
  });
}

export async function updateNote(id, title, content) {
  return fetchAPI(`/api/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content })
  });
}

export async function deleteNote(id) {
  return fetchAPI(`/api/notes/${id}`, { method: 'DELETE' });
}
