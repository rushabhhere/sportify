const path = require('path');
const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../client/index.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../client/login.html'));
});

router.get('/register', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../client/register.html'));
});

router.get('/profile', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../client/profile.html'));
});

module.exports = router;
