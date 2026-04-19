import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const emptyForm = { title: '', category: '', description: '', location: '' };

export default function SubmitComplaint() {
  const { user } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const basePath = user?.role === 'faculty' ? '/faculty' : '/student';
  const roleLabel = user?.role === 'faculty' ? 'Faculty' : 'Student';

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/complaints', form);
      setSuccess(true);
      setForm(emptyForm);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
    }
    setLoading(false);
  };

  if (success) return (
    <div>
      <div className="page-header"><h1>Submit Complaint</h1></div>
      <div className="card" style={{ maxWidth: 500 }}>
        <div className="card-body" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ marginBottom: '0.5rem' }}>Complaint Submitted!</h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Your complaint has been received and will be reviewed shortly.</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => setSuccess(false)}>Submit Another</button>
            <button className="btn" style={{ background: '#f3f4f6' }} onClick={() => navigate(`${basePath}/complaints`)}>View My Complaints</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="page-header"><h1>Submit a Complaint</h1><p>{roleLabel}s can report campus issues here for admin review and worker assignment.</p></div>
      <div className="card" style={{ maxWidth: 600 }}>
        <div className="card-body">
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Complaint Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Brief title of the issue" required />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                <option value="">Select a category</option>
                {['Infrastructure', 'Academic', 'Hostel', 'Canteen', 'Library', 'Other'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Location *</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Block A, Room 201" required />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the issue in detail..." rows={5} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Submitting...' : 'Submit Complaint'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
