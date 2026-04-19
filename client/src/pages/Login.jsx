import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data);
      const role = res.data.role || res.data.user?.role;
      navigate(role ? `/${role}` : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  const fillDemo = (email, password) => setForm({ email, password });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span>🎓</span>
          <h3>Campus Reporting System</h3>
        </div>
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to your account to continue</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@campus.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary form-full btn-lg" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
          <p style={{ marginTop: '1rem' }}>
            Don't have an account? <a href="/register">Register</a>
          </p>
        </form>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '10px', fontSize: '0.8rem' }}>
          <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>🔑 Demo Credentials (seed data first):</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {[
              { label: 'Admin', email: 'admin@campus.com', password: 'admin123' },
              { label: 'Faculty', email: 'faculty@campus.com', password: 'faculty123' },
              { label: 'Worker', email: 'worker@campus.com', password: 'worker123' },
              { label: 'Student', email: 'student@campus.com', password: 'student123' },
            ].map(d => (
              <button key={d.label} type="button" onClick={() => fillDemo(d.email, d.password)}
                style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '0.4rem 0.75rem', cursor: 'pointer', textAlign: 'left', fontSize: '0.8rem', color: '#4f46e5' }}>
                <strong>{d.label}:</strong> {d.email}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
