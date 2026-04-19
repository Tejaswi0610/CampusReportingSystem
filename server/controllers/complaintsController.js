const Complaint = require('../models/Complaint');

// @GET /api/complaints
const getComplaints = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'student' || req.user.role === 'faculty') query.submittedBy = req.user._id;
    if (req.user.role === 'worker') query.assignedTo = req.user._id;

    const complaints = await Complaint.find(query)
      .populate('submittedBy', 'name email department')
      .populate('assignedTo', 'name email department')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @POST /api/complaints
const createComplaint = async (req, res) => {
  const { title, category, description, location } = req.body;
  try {
    const complaint = await Complaint.create({ title, category, description, location, submittedBy: req.user._id });
    await complaint.populate('submittedBy', 'name email department');
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @PUT /api/complaints/:id
const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    const { status, remarks, assignedTo } = req.body;
    if (status && (req.user.role === 'admin' || req.user.role === 'worker')) complaint.status = status;
    if (remarks !== undefined && (req.user.role === 'admin' || req.user.role === 'worker')) complaint.remarks = remarks;
    if (assignedTo !== undefined && req.user.role === 'admin') complaint.assignedTo = assignedTo || null;

    await complaint.save();
    await complaint.populate('submittedBy', 'name email department');
    await complaint.populate('assignedTo', 'name email department');
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @DELETE /api/complaints/:id (admin only)
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    await complaint.deleteOne();
    res.json({ message: 'Complaint deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getComplaints, createComplaint, updateComplaint, deleteComplaint };
