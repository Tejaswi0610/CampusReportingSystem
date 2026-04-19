import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/Badges';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFaculty = user?.role === 'faculty';
  const basePath = isFaculty ? '/faculty' : '/student';

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
        <h1>{isFaculty ? 'Faculty Dashboard' : 'My Dashboard'}</h1>
        <p>Welcome, {user?.name}! Track your submitted complaints here.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon purple">📋</div><div><h3>{counts.total}</h3><p>Total Submitted</p></div></div>
        <div className="stat-card"><div className="stat-icon yellow">⏳</div><div><h3>{counts.pending}</h3><p>Pending</p></div></div>
        <div className="stat-card"><div className="stat-icon blue">🔄</div><div><h3>{counts.inProgress}</h3><p>In Progress</p></div></div>
        <div className="stat-card"><div className="stat-icon green">✅</div><div><h3>{counts.resolved}</h3><p>Resolved</p></div></div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Recent Complaints</h2>
          <button className="btn btn-primary btn-sm" onClick={() => navigate(`${basePath}/submit`)}>+ New Complaint</button>
        </div>
        {complaints.length === 0 ? (
          <div className="empty-state">
            <span>📝</span>
            <p>No complaints yet. <a href="#" onClick={() => navigate(`${basePath}/submit`)} style={{ color: '#4f46e5' }}>Submit your first one!</a></p>
          </div>
        ) : (
          <table>
            <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Assigned To</th><th>Date</th></tr></thead>
            <tbody>
              {complaints.slice(0, 5).map(c => (
                <tr key={c._id}>
                  <td><strong>{c.title}</strong></td>
                  <td>{c.category}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>{c.assignedTo?.name || <span style={{ color: '#9ca3af' }}>Pending assignment</span>}</td>
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
