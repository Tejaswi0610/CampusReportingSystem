import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';

import AdminDashboard from './pages/admin/Dashboard';
import AdminComplaints from './pages/admin/Complaints';
import AdminUsers from './pages/admin/Users';

import StudentDashboard from './pages/student/Dashboard';
import StudentComplaints from './pages/student/Complaints';
import SubmitComplaint from './pages/student/SubmitComplaint';

import WorkerDashboard from './pages/faculty/Dashboard';
import WorkerComplaints from './pages/faculty/Complaints';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loader"><span>🎓</span> Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={user ? <Navigate to={`/${user.role}`} replace /> : <Login />} />

      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="complaints" element={<AdminComplaints />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      <Route path="/student" element={<ProtectedRoute roles={['student']}><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<StudentDashboard />} />
        <Route path="complaints" element={<StudentComplaints />} />
        <Route path="submit" element={<SubmitComplaint />} />
      </Route>

      <Route path="/faculty" element={<ProtectedRoute roles={['faculty']}><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<StudentDashboard />} />
        <Route path="complaints" element={<StudentComplaints />} />
        <Route path="submit" element={<SubmitComplaint />} />
      </Route>

      <Route path="/worker" element={<ProtectedRoute roles={['worker']}><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<WorkerDashboard />} />
        <Route path="complaints" element={<WorkerComplaints />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
