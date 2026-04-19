import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/Badges';

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/complaints').then(r => setComplaints(r.data)).finally(() => setLoading(false));
  }, []);

  const counts = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Worker Dashboard</h1>
        <p>Welcome, {user?.name}! Here are the complaints assigned to you.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon purple">📋</div><div><h3>{counts.total}</h3><p>Assigned to Me</p></div></div>
        <div className="stat-card"><div className="stat-icon yellow">⏳</div><div><h3>{counts.pending}</h3><p>Pending</p></div></div>
        <div className="stat-card"><div className="stat-icon blue">🔄</div><div><h3>{counts.inProgress}</h3><p>In Progress</p></div></div>
        <div className="stat-card"><div className="stat-icon green">✅</div><div><h3>{counts.resolved}</h3><p>Resolved</p></div></div>
      </div>

      <div className="card">
        <div className="card-header"><h2>Assigned Complaints</h2></div>
        {complaints.length === 0 ? (
          <div className="empty-state"><span>🎉</span><p>No complaints assigned to you yet.</p></div>
        ) : (
          <table>
            <thead><tr><th>Title</th><th>Category</th><th>Submitted By</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c._id}>
                  <td><strong>{c.title}</strong></td>
                  <td>{c.category}</td>
                  <td>{c.submittedBy?.name}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
