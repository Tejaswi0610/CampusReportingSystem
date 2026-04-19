const express = require('express');
const router = express.Router();
const { login, seed } = require('../controllers/authController');

// ✅ Login route was missing entirely from this file
router.post('/login', login);

// ✅ Seed route for demo data
router.post('/seed', seed);

// ✅ Register - password hashing is handled by User model pre-save hook ONLY
//    Do NOT hash here manually - that caused double-hashing
router.post('/register', async (req, res) => {
  try {
    const User = require('../models/User');
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // ✅ Pass raw password - the User model pre-save hook will hash it
    const user = await User.create({
      name,
      email,
      password,       // NOT pre-hashed here
      role: role || 'student',
    });

    res.status(201).json({ message: 'User created successfully', userId: user._id });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
