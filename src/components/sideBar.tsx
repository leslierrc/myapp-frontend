import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Building, 
  Search, 
  Menu, 
  X,
  LogOut 
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

interface Office {
  id: string;
  name: string;
}
interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);


  // Detectar si es móvil
  const isMobile = window.innerWidth < 1024;
useEffect(() => {
  if (collapsed) {
    document.body.classList.add('sidebar-collapsed');
    document.body.classList.remove('sidebar-expanded');
  } else {
    document.body.classList.add('sidebar-expanded');
    document.body.classList.remove('sidebar-collapsed');
  }

  return () => {
    document.body.classList.remove('sidebar-collapsed', 'sidebar-expanded');
  };
}, [collapsed]);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const res = await fetch(`${API_URL}/api/offices`);
        if (!res.ok) throw new Error('Error al cargar oficinas');
        const data: Office[] = await res.json();
        setOffices(data);
      } catch (err) {
        setError('No se pudieron cargar las oficinas');
        console.error(err);
        setOffices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOffices();
  }, []);
useEffect(() => {
  const updateMargin = () => {
    const content = document.getElementById('dashboard-content');
    if (content) {
      content.style.marginLeft = collapsed ? '64px' : '256px';
      content.style.transition = 'margin-left 0.3s ease';
    }
  };

  updateMargin();

  const handleResize = () => {
    if (window.innerWidth >= 1024) updateMargin();
  };
  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, [collapsed]);
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleMobile = () => setMobileOpen(!mobileOpen);
  const closeMobile = () => setMobileOpen(false);


  return (
    <>
      {/* Botón hamburguesa solo en móvil */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-gray-800 text-white rounded-lg shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar para móvil: modal drawer */}
      {isMobile && (
        <motion.div
          className={`fixed inset-y-0 left-0 z-20 bg-gray-800/95 backdrop-blur-lg shadow-lg border-r border-gray-700 transform transition-transform duration-300 ease-in-out lg:hidden ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          } w-64`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 flex items-center justify-between border-b border-gray-700">
              <div className="text-2xl font-extrabold text-blue-400">
                <span className="text-purple-400">Asset</span>Flow
              </div>
              <button
                onClick={closeMobile}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Navegación */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {/* Dashboard */}
              <Link to="/dashboard" onClick={closeMobile}>
                <motion.div
                  className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
                    location.pathname === '/dashboard'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  whileHover={{ x: 2 }}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="ml-4">Dashboard</span>
                </motion.div>
              </Link>

              {/* Oficinas */}
              <div className="text-gray-400 text-sm font-semibold uppercase mt-6 mb-2 px-3">
                Offices
              </div>

              {loading && <div className="text-gray-400 text-sm px-3">Loading...</div>}
              {error && <div className="text-red-400 text-sm px-3">{error}</div>}
              {!loading && !error && offices.length === 0 && (
                <div className="text-gray-400 text-sm px-3">No offices</div>
              )}

              {offices.map((office) => (
                <Link key={office.id} to={`/dashboard/office/${office.id}`} onClick={closeMobile}>
                  <motion.div
                    className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
                      location.pathname === `/dashboard/office/${office.id}`
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    whileHover={{ x: 2 }}
                  >
                    <Building className="w-5 h-5" />
                    <span className="ml-4 truncate">{office.name}</span>
                  </motion.div>
                </Link>
              ))}
            </nav>

            {/* Acciones fijas */}
            <div className="p-4 space-y-4 border-t border-gray-700">
              <Link to="/dashboard/search" onClick={closeMobile}>
                <motion.div
                  className="flex items-center p-3 rounded-xl hover:bg-gray-700 text-gray-400 hover:text-white transition-all cursor-pointer"
                  whileHover={{ x: 2 }}
                >
                  <Search className="w-5 h-5" />
                  <span className="ml-4">Global Search</span>
                </motion.div>
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  closeMobile();
                }}
                className="w-full flex items-center p-3 rounded-xl hover:bg-red-900/30 text-red-400 hover:text-red-300 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-4">Cerrar sesión</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Sidebar para desktop: siempre visible, con colapso opcional */}
      {!isMobile &&      <DesktopSidebar
          offices={offices}
          loading={loading}
          error={error}
          collapsed={collapsed}
          onToggleCollapse={onToggleCollapse}
        />}

      {/* Overlay en móvil */}
      {isMobile && mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
                  onClick={() => setMobileOpen(false)}
        ></div>
      )}
    </>
  );
};

// --- Sidebar para Desktop ---
const DesktopSidebar = ({ 
  offices, 
  loading, 
  error,
  collapsed,
  onToggleCollapse
}: { 
  offices: Office[]; 
  loading: boolean; 
  error: string | null;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const showText = !collapsed;

  return (
 <motion.div
  className={`fixed inset-y-0 left-0 z-20 bg-gray-800/90 backdrop-blur-lg shadow-lg border-r border-gray-700 transition-all duration-300 flex flex-col ${
    collapsed ? 'w-16' : 'w-64'
  }`}
>
      {/* Logo */}
      <div className="p-4 flex items-center border-b border-gray-700">
        <div
          className={`text-xl font-extrabold text-blue-400 transition-all duration-300 ${
            collapsed ? 'opacity-0 w-0' : 'opacity-100'
          }`}
          style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
        >
          <span className="text-purple-400">Asset</span>Flow
        </div>
        {collapsed && (
          <div className="text-blue-400 font-extrabold">A</div>
        )}
        <button
          onClick={onToggleCollapse}
          className="ml-auto text-gray-400 hover:text-white"
        >
          {collapsed ? '❱' : '❰'}
        </button>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <Link to="/dashboard">
          <motion.div
            className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${
              location.pathname === '/dashboard'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
            whileHover={{ x: 2 }}
          >
            <LayoutDashboard className="w-5 h-5" />
            {showText && <span className="ml-4">Dashboard</span>}
          </motion.div>
        </Link>

        <div
          className={`text-gray-400 text-xs font-semibold uppercase mt-6 mb-2 px-3 ${
            collapsed ? 'hidden' : ''
          }`}
        >
          Offices
        </div>

        {loading && (
          <div className={`text-gray-400 text-sm px-3 ${collapsed ? 'hidden' : ''}`}>
            Loading...
          </div>
        )}

        {error && (
          <div className={`text-red-400 text-sm px-3 ${collapsed ? 'hidden' : ''}`}>
            {error}
          </div>
        )}

        {!loading && !error && offices.length === 0 && (
          <div className={`text-gray-400 text-sm px-3 ${collapsed ? 'hidden' : ''}`}>
            No offices
          </div>
        )}

        {offices.map((office) => (
          <Link key={office.id} to={`/dashboard/office/${office.id}`}>
            <motion.div
              className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${
                location.pathname === `/dashboard/office/${office.id}`
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              whileHover={{ x: 2 }}
            >
              <Building className="w-5 h-5" />
              {showText && <span className="ml-4 truncate">{office.name}</span>}
            </motion.div>
          </Link>
        ))}
      </nav>

      {/* Acciones */}
      <div className="p-2 space-y-2 border-t border-gray-700">
        <Link to="/dashboard/search">
          <motion.div
            className={`flex items-center p-3 rounded-xl hover:bg-gray-700 text-gray-400 hover:text-white transition-all group`}
            whileHover={{ x: 2 }}
          >
            <Search className="w-5 h-5" />
            {showText && <span className="ml-4">Global Search</span>}
          </motion.div>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 rounded-xl hover:bg-red-900/30 text-red-400 hover:text-red-300 transition-all"
        >
          <LogOut className="w-5 h-5" />
          {showText && <span className="ml-4">Cerrar sesión</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;