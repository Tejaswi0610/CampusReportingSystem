import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinks = {
  admin: [
    { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
    { to: '/admin/complaints', label: 'All Complaints', icon: '📋' },
    { to: '/admin/users', label: 'Manage Users', icon: '👥' },
  ],
  student: [
    { to: '/student', label: 'Dashboard', icon: '📊', end: true },
    { to: '/student/submit', label: 'Submit Complaint', icon: '✍️' },
    { to: '/student/complaints', label: 'My Complaints', icon: '📋' },
  ],
  faculty: [
    { to: '/faculty', label: 'Dashboard', icon: '📊', end: true },
    { to: '/faculty/submit', label: 'Submit Complaint', icon: '✍️' },
    { to: '/faculty/complaints', label: 'My Complaints', icon: '📋' },
  ],
  worker: [
    { to: '/worker', label: 'Dashboard', icon: '📊', end: true },
    { to: '/worker/complaints', label: 'Assigned Complaints', icon: '📋' },
  ],
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };
  const links = navLinks[user?.role] || [];
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>🎓 Campus Reporting</h2>
          <p>Management System</p>
        </div>
        <nav className="sidebar-nav">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              <span className="icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="user-info">
            <div className="avatar">{initials}</div>
            <div className="user-info-text">
              <p>{user?.name}</p>
              <span>{user?.role}</span>
            </div>
          </div>
          <button className="btn btn-danger btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
