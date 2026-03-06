const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../utils/db');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  if (username.length <= 5) {
    return res.status(400).json({ error: 'Username must be more than 6 characters' });
  }
  
  if (password.length <= 5) {
    return res.status(400).json({ error: 'Password must be more than 6 characters' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const created = db.createUser(username, hashedPassword);
  
  if (!created) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  
  req.session.username = username;
  res.json({ success: true });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  const user = db.findUser(username);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const valid = await bcrypt.compare(password, user.password);
  
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  req.session.username = username;
  res.json({ success: true });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

router.get('/me', (req, res) => {
  if (req.session.username) {
    res.json({ username: req.session.username });
  } else {
    res.status(401).json({ error: 'Not logged in' });
  }
});

module.exports = router;
