const User = require('../models/User');

// @GET /api/users - Admin: get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('getUsers error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @GET /api/users/workers - get all workers (for assign dropdown)
const getWorkers = async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker' }).select('-password');
    res.json(workers);
  } catch (err) {
    console.error('getWorkers error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @POST /api/users - Admin: create user of any type
const createUser = async (req, res) => {
  const { name, email, password, role, department } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const validRoles = ['admin', 'faculty', 'student', 'worker'];
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Must be: admin, faculty, student, or worker' });
  }

  try {
    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    // ✅ Pass raw password - User model pre-save hook hashes it
    const user = await User.create({ name, email, password, role: role || 'student', department: department || '' });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error('createUser error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @DELETE /api/users/:id - Admin: delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete admin user' });
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('deleteUser error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUsers, getWorkers, createUser, deleteUser };
