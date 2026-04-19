import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { StatusBadge } from '../../components/Badges';

export default function WorkerComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ status: '', remarks: '' });
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/complaints').then(r => setComplaints(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openModal = (c) => { setSelected(c); setForm({ status: c.status, remarks: c.remarks || '' }); };

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

  if (loading) return <div className="loading">Loading complaints...</div>;

  return (
    <div>
      <div className="page-header"><h1>Assigned Complaints</h1><p>Update status and add remarks to complaints assigned to you.</p></div>

      {complaints.length === 0 ? (
        <div className="card"><div className="empty-state"><span>🎉</span><p>No complaints assigned yet.</p></div></div>
      ) : (
        <div className="card">
          <table>
            <thead><tr><th>Title</th><th>Category</th><th>Location</th><th>Submitted By</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c._id}>
                  <td><strong>{c.title}</strong></td>
                  <td>{c.category}</td>
                  <td>{c.location}</td>
                  <td>{c.submittedBy?.name}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td><button className="btn btn-primary btn-sm" onClick={() => openModal(c)}>Update</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Update Complaint</h2>
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#374151' }}>
              <p><strong>{selected.title}</strong></p>
              <p style={{ marginTop: '0.25rem', color: '#6b7280' }}>{selected.description}</p>
              <p style={{ marginTop: '0.5rem' }}><strong>Location:</strong> {selected.location}</p>
              <p><strong>Submitted By:</strong> {selected.submittedBy?.name} ({selected.submittedBy?.email})</p>
            </div>
            <div className="form-group">
              <label>Update Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>
            <div className="form-group">
              <label>Remarks / Notes</label>
              <textarea value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} placeholder="Add any notes or remarks about this complaint..." rows={4} />
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
