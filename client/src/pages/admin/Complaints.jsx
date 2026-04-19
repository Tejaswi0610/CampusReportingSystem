import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { StatusBadge } from '../../components/Badges';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ status: '', remarks: '', assignedTo: '' });
  const [saving, setSaving] = useState(false);

  const load = () =>
    Promise.all([api.get('/complaints'), api.get('/users/workers')])
      .then(([c, w]) => { setComplaints(c.data); setWorkers(w.data); })
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openModal = (c) => {
    setSelected(c);
    setForm({ status: c.status, remarks: c.remarks || '', assignedTo: c.assignedTo?._id || '' });
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await api.put(`/complaints/${selected._id}`, form);
      await load();
      setSelected(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this complaint?')) return;
    await api.delete(`/complaints/${id}`);
    setComplaints(complaints.filter(c => c._id !== id));
  };

  if (loading) return <div className="loading">Loading complaints...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>All Complaints</h1>
        <p>Review complaints and assign them to workers.</p>
      </div>

      <div className="card">
        {complaints.length === 0 ? (
          <div className="empty-state"><span>📭</span><p>No complaints found.</p></div>
        ) : (
          <table>
            <thead><tr><th>Title</th><th>Category</th><th>Location</th><th>Submitted By</th><th>Assigned Worker</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c._id}>
                  <td><strong>{c.title}</strong></td>
                  <td>{c.category}</td>
                  <td>{c.location}</td>
                  <td>{c.submittedBy?.name || 'N/A'}</td>
                  <td>{c.assignedTo?.name || <span style={{ color: '#9ca3af' }}>Unassigned</span>}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-primary btn-sm" onClick={() => openModal(c)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Edit Complaint</h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{selected.title}</p>

            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>
            <div className="form-group">
              <label>Assign To Worker</label>
              <select value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })}>
                <option value="">Unassigned</option>
                {workers.map(w => <option key={w._id} value={w._id}>{w.name} - {w.department}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Remarks</label>
              <textarea value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} placeholder="Add remarks or notes..." />
            </div>

            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#374151' }}>
              <strong>Description:</strong> {selected.description}
            </div>

            <div className="modal-footer">
              <button className="btn" style={{ background: '#f3f4f6' }} onClick={() => setSelected(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleUpdate} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
