const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  category:    { type: String, required: true, enum: ['Infrastructure', 'Academic', 'Hostel', 'Canteen', 'Library', 'Other'] },
  description: { type: String, required: true },
  location:    { type: String, required: true },
  status:      { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
  remarks:     { type: String, default: '' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
