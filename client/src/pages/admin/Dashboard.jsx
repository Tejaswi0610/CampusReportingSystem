import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/Badges';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/complaints'), api.get('/users')])
      .then(([c, u]) => { setComplaints(c.data); setUsers(u.data); })
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.name}! Here's your system overview.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">📋</div>
          <div><h3>{counts.total}</h3><p>Total Complaints</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">⏳</div>
          <div><h3>{counts.pending}</h3><p>Pending</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">🔄</div>
          <div><h3>{counts.inProgress}</h3><p>In Progress</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div><h3>{counts.resolved}</h3><p>Resolved</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">👥</div>
          <div><h3>{users.length}</h3><p>Total Users</p></div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h2>Recent Complaints</h2></div>
        {complaints.length === 0 ? (
          <div className="empty-state"><span>📭</span><p>No complaints yet.</p></div>
        ) : (
          <table>
            <thead><tr><th>Title</th><th>Category</th><th>Submitted By</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {complaints.slice(0, 6).map(c => (
                <tr key={c._id}>
                  <td><strong>{c.title}</strong></td>
                  <td>{c.category}</td>
                  <td>{c.submittedBy?.name || 'N/A'}</td>
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
