import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { StatusBadge } from '../../components/Badges';
import { useAuth } from '../../context/AuthContext';

export default function StudentComplaints() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const basePath = user?.role === 'faculty' ? '/faculty' : '/student';
  const title = user?.role === 'faculty' ? 'Reported Complaints' : 'My Complaints';
  const subtitle = user?.role === 'faculty'
    ? 'Track the status of complaints reported by faculty.'
    : 'Track the status of your submitted complaints.';

  useEffect(() => {
    api.get('/complaints').then(r => setComplaints(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading complaints...</div>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h1>{title}</h1><p>{subtitle}</p></div>
        <button className="btn btn-primary" onClick={() => navigate(`${basePath}/submit`)}>+ New Complaint</button>
      </div>

      {complaints.length === 0 ? (
        <div className="card"><div className="empty-state"><span>📭</span><p>No complaints submitted yet.</p></div></div>
      ) : (
        <div className="card">
          <table>
            <thead><tr><th>Title</th><th>Category</th><th>Location</th><th>Status</th><th>Assigned To</th><th>Date</th><th>Details</th></tr></thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c._id}>
                  <td><strong>{c.title}</strong></td>
                  <td>{c.category}</td>
                  <td>{c.location}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>{c.assignedTo?.name || <span style={{ color: '#9ca3af' }}>Unassigned</span>}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td><button className="btn btn-primary btn-sm" onClick={() => setSelected(c)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{selected.title}</h2>
            <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
              {[
                ['Category', selected.category],
                ['Location', selected.location],
                ['Status', null],
                ['Assigned To', selected.assignedTo?.name || 'Not yet assigned'],
                ['Submitted', new Date(selected.createdAt).toLocaleString()],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', gap: '1rem', padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
                  <span style={{ fontWeight: 600, minWidth: 100, fontSize: '0.85rem', color: '#374151' }}>{label}</span>
                  <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{label === 'Status' ? <StatusBadge status={selected.status} /> : val}</span>
                </div>
              ))}
              <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
                <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#374151', marginBottom: '0.35rem' }}>Description</p>
                <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>{selected.description}</p>
              </div>
              {selected.remarks && (
                <div style={{ padding: '0.75rem', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#065f46', marginBottom: '0.35rem' }}>Worker Remarks</p>
                  <p style={{ fontSize: '0.85rem', color: '#065f46' }}>{selected.remarks}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
