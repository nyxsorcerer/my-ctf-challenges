const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs')
const crypto = require('crypto')
const bcrypt = require('bcryptjs');

const db = require('./utils/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true }
}));

app.use(express.static(path.join(__dirname, './public')));

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

app.get('/', (req, res) => {
  if (!req.session.username) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/login', (req, res) => {
  if (req.session.username) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, './public/login.html'));
});

app.get('/register', (req, res) => {
  if (req.session.username) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, './public/register.html'));
});

app.listen(PORT, async () => {
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin'
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin'
  
  if(fs.existsSync('./data/db.json')){
    fs.unlinkSync('./data/db.json');
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD ?? 'admin', 10);
  db.createUser(ADMIN_USERNAME, hashedPassword);
  db.createNote(ADMIN_USERNAME, 'FLAG', process.env.FLAG ?? 'C2C{fakeflag}')
  console.log(`Server running on http://localhost:${PORT}`);
});
