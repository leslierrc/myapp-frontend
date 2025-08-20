import { Routes, Route, Navigate } from 'react-router-dom';
import type { JSX } from 'react';
import Login from './components/login';
import { Register } from './components/register';
import Dashboard from './pages/dashboard';
import GlobalSearch from './pages/globalSearch';
import { DashboardLayout } from './pages/layout';
import OfficePage from './pages/officePage';


const isValidToken = (token: string | null) => {
  return !!token && token.trim() !== '' && token !== 'undefined';
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  return isValidToken(token) ? children : <Navigate to="/" replace />;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  return isValidToken(token) ? <Navigate to="/dashboard" replace /> : children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Dashboard con rutas protegidas */}
      <Route
        path="/dashboard"
        element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}
      >
        <Route index element={<Dashboard />} /> {/* /dashboard */}
        <Route path="office/:id" element={<OfficePage />} /> {/* /dashboard/office/:id */}
        <Route path="search" element={<GlobalSearch />} /> {/* /dashboard/search */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
