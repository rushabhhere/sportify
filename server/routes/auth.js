const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Router } = require('express');
const User = require('../models/User');

const router = Router();

router.post('/register', async (req, res) => {
  const {
    username,
    password: plainTextPassword,
    name,
    location,
    gender,
    interests,
  } = req.body;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ status: 'error', error: 'invalid username' });
  }

  if (!plainTextPassword || typeof plainTextPassword !== 'string') {
    return res.status(400).json({ status: 'error', error: 'invalid password' });
  }

  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const user = await User.create({
      username,
      password,
      name,
      location,
      gender,
      interests,
    });

    const token = jwt.sign({ id: user._id, username }, process.env.JWT_SECRET);

    res
      .status(201)
      .json({ status: 'ok', data: token, message: 'user created' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(403).json({ status: 'error', error: 'username taken' });
    }

    if (err.name === 'ValidationError') {
      return res.status(400).json({ status: 'error', error: 'invalid data' });
    }

    res.status(500).json({ status: 'error', error: err.message });
    throw err;
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).lean();

  if (!user) {
    return res.json({ status: 'error', error: 'invalid username/password' });
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res.json({ status: 'error', error: 'invalid username/password' });
  }

  const token = jwt.sign({ id: user._id, username }, process.env.JWT_SECRET);
  res.json({ status: 'ok', data: token, message: 'login successful' });
});

router.get('/profile', async (req, res) => {
  const { token } = req;

  try {
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ username: tokenDecoded.username });

    if (!user) {
      return res
        .status(404)
        .json({ status: 'error', error: 'user does not exist' });
    }

    res.json({
      status: 'ok',
      message: 'profile data received',
      username: user.username,
      profileImage: `https://api.dicebear.com/8.x/lorelei/svg?seed=${user.name}`,
      interests: user.interests,
      gender: user.gender,
      location: user.location,
      name: user.name,
      id: user._id,
    });
  } catch (err) {
    if (err.message === 'invalid token') {
      return res.json({ status: 'error', error: 'cannot get profile' });
    }

    if (err.message === 'jwt malformed') {
      return res.json({ status: 'redirect', url: '/login' });
    }

    res.status(500).json({ status: 'error', error: err.message });
    throw err;
  }
});

module.exports = router;
