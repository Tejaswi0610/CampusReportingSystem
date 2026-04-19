import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { RoleBadge } from '../../components/Badges';

const emptyForm = { name: '', email: '', password: '', role: 'student', department: '' };

const ROLE_CONFIG = {
  student: {
    label: 'Student',
    icon: '🎓',
    color: '#4f46e5',
    bg: '#ede9fe',
    departments: ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Business Administration', 'Other'],
    hint: 'Can submit and track complaints',
  },
  faculty: {
    label: 'Faculty',
    icon: '👨‍🏫',
    color: '#0891b2',
    bg: '#cffafe',
    departments: ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Mathematics', 'Physics', 'Other'],
    hint: 'Can submit complaints and view their status',
  },
  worker: {
    label: 'Worker',
    icon: '🔧',
    color: '#d97706',
    bg: '#fef3c7',
    departments: ['Operations', 'Maintenance', 'Housekeeping', 'Security', 'IT Support', 'Other'],
    hint: 'Assigned to resolve complaints',
  },
  admin: {
    label: 'Admin',
    icon: '🛡️',
    color: '#dc2626',
    bg: '#fee2e2',
    departments: ['Administration', 'IT', 'Management'],
    hint: 'Full system access — create and manage all users',
  },
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [success, setSuccess] = useState('');

  const load = () =>
    api.get('/users')
      .then(r => setUsers(r.data))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openModal = (defaultRole = 'student') => {
    setForm({ ...emptyForm, role: defaultRole });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleCreate = async () => {
    setError('');
    if (!form.name.trim()) return setError('Full name is required');
    if (!form.email.trim()) return setError('Email is required');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');

    setSaving(true);
    try {
      await api.post('/users', form);
      await load();
      setSuccess(`✅ ${ROLE_CONFIG[form.role].label} "${form.name}" created successfully!`);
      setShowModal(false);
      setForm(emptyForm);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const cfg = ROLE_CONFIG[form.role];
  const filteredUsers = filterRole === 'all' ? users : users.filter(u => u.role === filterRole);

  const roleCounts = {
    all: users.length,
    student: users.filter(u => u.role === 'student').length,
    faculty: users.filter(u => u.role === 'faculty').length,
    worker: users.filter(u => u.role === 'worker').length,
    admin: users.filter(u => u.role === 'admin').length,
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Manage Users</h1>
          <p>Create, view, and delete system users by role.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {Object.entries(ROLE_CONFIG).map(([role, rc]) => (
            <button
              key={role}
              className="btn btn-primary"
              style={{ background: rc.color, fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}
              onClick={() => openModal(role)}
            >
              {rc.icon} Add {rc.label}
            </button>
          ))}
        </div>
      </div>

      {success && (
        <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', color: '#065f46', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: 500 }}>
          {success}
        </div>
      )}

      {/* Role filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {[['all', '👥', 'All'], ['student', '🎓', 'Students'], ['faculty', '👨‍🏫', 'Faculty'], ['worker', '🔧', 'Workers'], ['admin', '🛡️', 'Admins']].map(([key, icon, label]) => (
          <button
            key={key}
            onClick={() => setFilterRole(key)}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '20px',
              border: '1.5px solid',
              borderColor: filterRole === key ? '#4f46e5' : '#e5e7eb',
              background: filterRole === key ? '#4f46e5' : 'white',
              color: filterRole === key ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 500,
            }}
          >
            {icon} {label} <span style={{ opacity: 0.75 }}>({roleCounts[key]})</span>
          </button>
        ))}
      </div>

      <div className="card">
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <span>👥</span>
            <p>No {filterRole === 'all' ? '' : filterRole} users yet.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700,
                        background: ROLE_CONFIG[u.role]?.bg || '#f3f4f6',
                        color: ROLE_CONFIG[u.role]?.color || '#374151',
                        flexShrink: 0,
                      }}>
                        {u.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      <strong>{u.name}</strong>
                    </div>
                  </td>
                  <td style={{ color: '#6b7280', fontSize: '0.9rem' }}>{u.email}</td>
                  <td><RoleBadge role={u.role} /></td>
                  <td>{u.department || <span style={{ color: '#9ca3af' }}>—</span>}</td>
                  <td style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {u.role !== 'admin' && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>

            {/* Role selector at top */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ marginBottom: '0.75rem' }}>Add New User</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {Object.entries(ROLE_CONFIG).map(([role, rc]) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, role, department: '' }))}
                    style={{
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      border: '2px solid',
                      borderColor: form.role === role ? rc.color : '#e5e7eb',
                      background: form.role === role ? rc.bg : 'white',
                      color: form.role === role ? rc.color : '#374151',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontWeight: form.role === role ? 700 : 400,
                      fontSize: '0.85rem',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ marginRight: '0.4rem' }}>{rc.icon}</span>
                    {rc.label}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem', padding: '0.4rem 0.6rem', background: '#f9fafb', borderRadius: '6px' }}>
                ℹ️ {cfg.hint}
              </p>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <div className="form-group">
              <label>Full Name</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder={`e.g. ${form.role === 'faculty' ? 'Dr. Priya Sharma' : form.role === 'worker' ? 'Ravi Kumar' : 'Anjali Singh'}`}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder={`e.g. ${form.role}@campus.com`}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Minimum 6 characters"
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <select
                value={form.department}
                onChange={e => setForm({ ...form, department: e.target.value })}
              >
                <option value="">— Select Department —</option>
                {cfg.departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="modal-footer">
              <button
                className="btn"
                style={{ background: '#f3f4f6' }}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ background: cfg.color }}
                onClick={handleCreate}
                disabled={saving}
              >
                {saving ? 'Creating...' : `${cfg.icon} Create ${cfg.label}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
