const express = require('express');
const router = express.Router();
const { getUsers, getWorkers, createUser, deleteUser } = require('../controllers/usersController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), getUsers);
router.get('/workers', protect, getWorkers);
router.post('/', protect, authorize('admin'), createUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
