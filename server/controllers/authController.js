const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Complaint = require('../models/Complaint');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// @POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @POST /api/auth/seed - seeds demo data
const seed = async (req, res) => {
  try {
    await User.deleteMany({});
    await Complaint.deleteMany({});

    // ✅ Passwords passed as plaintext - User model pre-save hook hashes them
    const admin   = await User.create({ name: 'Admin User',         email: 'admin@campus.com',   password: 'admin123',   role: 'admin',   department: 'Administration' });
    const faculty = await User.create({ name: 'Dr. Priya Sharma',   email: 'faculty@campus.com', password: 'faculty123', role: 'faculty', department: 'Computer Science' });
    const worker  = await User.create({ name: 'Maintenance Worker', email: 'worker@campus.com',  password: 'worker123',  role: 'worker',  department: 'Operations' });
    const student = await User.create({ name: 'Rahul Kumar',        email: 'student@campus.com', password: 'student123', role: 'student', department: 'Computer Science' });

    await Complaint.create([
      {
        title: 'Broken projector in Lab 3',
        category: 'Infrastructure',
        description: 'The projector in Lab 3 has not been working for the past week. Classes are being affected.',
        location: 'Lab Block - Lab 3',
        status: 'In Progress',
        submittedBy: student._id,
        assignedTo: worker._id,
        remarks: 'Maintenance team notified.',
      },
      {
        title: 'Library books not returned',
        category: 'Library',
        description: 'Several reference books that were issued have not been returned for over 2 months.',
        location: 'Central Library',
        status: 'Pending',
        submittedBy: student._id,
        assignedTo: null,
      },
      {
        title: 'Canteen food quality issue',
        category: 'Canteen',
        description: 'The food quality in the main canteen has deteriorated significantly.',
        location: 'Main Canteen',
        status: 'Resolved',
        submittedBy: faculty._id,
        assignedTo: worker._id,
        remarks: 'Canteen vendor has been warned and quality has improved.',
      },
    ]);

    res.json({ message: '✅ Demo data seeded successfully!' });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ message: 'Seed error: ' + err.message });
  }
};

module.exports = { login, seed };
