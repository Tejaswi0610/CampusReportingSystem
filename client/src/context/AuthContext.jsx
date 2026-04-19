import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const normalizeAuthUser = (data) => {
  if (!data) return null;

  if (data.user && data.token) {
    return {
      _id: data.user._id || data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      department: data.user.department || '',
      token: data.token,
    };
  }

  return data;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('campus_user');
    if (stored) setUser(normalizeAuthUser(JSON.parse(stored)));
    setLoading(false);
  }, []);

  const login = (userData) => {
    const normalizedUser = normalizeAuthUser(userData);
    localStorage.setItem('campus_user', JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem('campus_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
