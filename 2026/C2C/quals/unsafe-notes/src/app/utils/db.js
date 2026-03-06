const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_FILE = path.join(__dirname, '../data/db.json');

function loadDB() {
  if (!fs.existsSync(path.dirname(DB_FILE))) {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  }
  
  if (!fs.existsSync(DB_FILE)) {
    const initialDB = { users: Object.create(null), notes: Object.create(null) };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2));
    return initialDB;
  }
  
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  
  if (!Object.getPrototypeOf(db.users) || Object.getPrototypeOf(db.users) !== Object.prototype) {
    db.users = Object.create(null);
  }
  
  if (!Object.getPrototypeOf(db.notes) || Object.getPrototypeOf(db.notes) !== Object.prototype) {
    db.notes = Object.create(null);
  }
  
  return db;
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function createUser(username, password) {
  const db = loadDB();
  if (db.users[username]) {
    return null;
  }
  db.users[username] = Object.create(null);
  db.users[username].password = password;
  saveDB(db);
  return true;
}

function findUser(username) {
  const db = loadDB();
  return db.users[username] || null;
}

function createNote(username, title, content) {
  const db = loadDB();
  const id = crypto.randomUUID();
  const note = Object.create(null);
  note.id = id;
  note.username = username;
  note.title = title;
  note.content = content;
  db.notes[id] = note;
  saveDB(db);
  return db.notes[id];
}

function getNote(id) {
  const db = loadDB();
  return db.notes[id] || null;
}

function getNotesByUser(username) {
  const db = loadDB();
  return Object.values(db.notes).filter(note => note.username === username);
}

function updateNote(id, title, content, username) {
  const db = loadDB();
  const note = db.notes[id];
  
  if (!note || note.username !== username) {
    return null;
  }
  
  note.title = title;
  note.content = content;
  saveDB(db);
  return note;
}

function deleteNote(id, username) {
  const db = loadDB();
  const note = db.notes[id];
  
  if (!note || note.username !== username) {
    return false;
  }
  
  delete db.notes[id];
  saveDB(db);
  return true;
}

module.exports = {
  createUser,
  findUser,
  createNote,
  getNote,
  getNotesByUser,
  updateNote,
  deleteNote
};
