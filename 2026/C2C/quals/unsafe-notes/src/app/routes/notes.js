const express = require('express');
const db = require('../utils/db');
const { requireAuth } = require('../utils/auth');

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  const notes = db.getNotesByUser(req.session.username);
  res.json(notes);
});

router.get('/:id', requireAuth, (req, res) => {
  const note = db.getNote(req.params.id);
  
  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }
  
  if (note.username !== req.session.username) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  res.json(note);
});

router.post('/', requireAuth, (req, res) => {
  const { title, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content required' });
  }
  
  const note = db.createNote(req.session.username, title, content);
  res.json(note);
});

router.put('/:id', requireAuth, (req, res) => {
  const { title, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content required' });
  }
  
  const note = db.updateNote(req.params.id, title, content, req.session.username);
  
  if (!note) {
    return res.status(403).json({ error: 'Access denied or note not found' });
  }
  
  res.json(note);
});

router.delete('/:id', requireAuth, (req, res) => {
  const deleted = db.deleteNote(req.params.id, req.session.username);
  
  if (!deleted) {
    return res.status(403).json({ error: 'Access denied or note not found' });
  }
  
  res.json({ success: true });
});

module.exports = router;
