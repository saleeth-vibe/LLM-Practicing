import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthContext, useAuth, useAuthState } from './hooks/useAuth';
import { AdminPage } from './pages/AdminPage';
import { FacultyPage } from './pages/FacultyPage';
import { LoginPage } from './pages/LoginPage';
import { StudentPage } from './pages/StudentPage';
import { Role } from './api/auth';

function Guard({ role, children }: { role: Role; children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="boot">Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={`/${user.role}`} replace />;
  return children;
}

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <p className="boot">Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role}`} replace />;
}

export function App() {
  const auth = useAuthState();
  return (
    <AuthContext.Provider value={auth}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <Guard role="admin">
              <AdminPage />
            </Guard>
          }
        />
        <Route
          path="/faculty"
          element={
            <Guard role="faculty">
              <FacultyPage />
            </Guard>
          }
        />
        <Route
          path="/student"
          element={
            <Guard role="student">
              <StudentPage />
            </Guard>
          }
        />
        <Route path="/" element={<HomeRedirect />} />
      </Routes>
    </AuthContext.Provider>
  );
}
