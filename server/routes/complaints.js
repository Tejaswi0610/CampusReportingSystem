const express = require('express');
const router = express.Router();
const { getComplaints, createComplaint, updateComplaint, deleteComplaint } = require('../controllers/complaintsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getComplaints);
router.post('/', protect, authorize('student', 'faculty'), createComplaint);
router.put('/:id', protect, authorize('admin', 'worker'), updateComplaint);
router.delete('/:id', protect, authorize('admin'), deleteComplaint);

module.exports = router;
