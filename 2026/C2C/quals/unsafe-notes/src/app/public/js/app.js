import * as API from './api.js';
import { sanitize } from 'https://cdn.jsdelivr.net/npm/domiso@0.1.1/+esm'
let notes = [];
const modal = document.getElementById('noteModal');
const noteForm = document.getElementById('noteForm');

async function checkAuth() {
  try {
    await API.checkAuth();
  } catch (error) {
    window.location.href = '/login';
  }
}

async function loadNotes() {
  try {
    notes = await API.getNotes();
    renderNotes();
  } catch (error) {
    console.error('Failed to load notes:', error);
  }
}

function renderNotes() {
  const notesList = document.getElementById('notesList');
  notesList.innerHTML = '';
  
  notes.forEach(note => {
    const noteCard = document.createElement('div');
    noteCard.className = 'note-card';
    noteCard.innerHTML = `
      <div class="note-header">
        <h2 class="note-title">${escapeHtml(note.title)}</h2>
        <div class="note-actions">
          <button class="btn btn-edit" onclick="editNote('${note.id}')">Edit</button>
          <button class="btn btn-delete" onclick="deleteNote('${note.id}')">Delete</button>
        </div>
      </div>
      <div class="note-content">${sanitize(note.content)}</div>
    `;
    notesList.appendChild(noteCard);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

window.openModal = function(note = null) {
  const modalTitle = document.getElementById('modalTitle');
  const noteId = document.getElementById('noteId');
  const titleInput = document.getElementById('title');
  const contentInput = document.getElementById('content');
  
  if (note) {
    modalTitle.textContent = 'Edit Note';
    noteId.value = note.id;
    titleInput.value = note.title;
    contentInput.value = note.content;
  } else {
    modalTitle.textContent = 'Add Note';
    noteId.value = '';
    titleInput.value = '';
    contentInput.value = '';
  }
  
  modal.classList.add('active');
};

window.closeModal = function() {
  modal.classList.remove('active');
};

window.editNote = async function(id) {
  const note = notes.find(n => n.id === id);
  if (note) {
    openModal(note);
  }
};

window.deleteNote = async function(id) {
  if (!confirm('Are you sure you want to delete this note?')) {
    return;
  }
  
  try {
    await API.deleteNote(id);
    await loadNotes();
  } catch (error) {
    alert('Failed to delete note: ' + error.message);
  }
};

window.logout = async function() {
  await API.logout();
  window.location.href = '/login';
};

noteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const noteId = document.getElementById('noteId').value;
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  
  try {
    if (noteId) {
      await API.updateNote(noteId, title, content);
    } else {
      await API.createNote(title, content);
    }
    
    closeModal();
    await loadNotes();
  } catch (error) {
    alert('Failed to save note: ' + error.message);
  }
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

checkAuth().then(() => loadNotes());
