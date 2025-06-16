import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/authSlice';
import { Menu, X } from 'lucide-react';
import axios from 'axios';

function Header() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(localStorage.getItem('auth') === 'true');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const reduxAuth = useSelector((state) => state.auth);
  const { user = null } = reduxAuth;
  const isAdmin = reduxAuth.isAdmin || JSON.parse(localStorage.getItem('user') || '{}')?.role === 'admin';
  const isAuthenticated = reduxAuth.isAuthenticated || isAuth;

  const currentPath = location.pathname;

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/users/logout`, {}, { withCredentials: true });
      localStorage.removeItem('auth');
      localStorage.removeItem('user');
      dispatch(logoutUser());
      setIsAuth(false);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const localAuth = localStorage.getItem('auth') === 'true';
      setIsAuth(localAuth);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const adminLinks = () => {
    switch (currentPath) {
      case '/admin/tickets':
        return <Link to="/admin/analytics" className="nav-link bg-gray-300 border-2 rounded-2xl p-2">Analytics</Link>;
      case '/admin/analytics':
        return (
          <>
            <Link to="/admin/tickets" className="nav-link bg-gray-300 border-2 rounded-2xl p-2">Dashboard</Link>
            <Link to="/admin/ticketsperday" className="nav-link bg-gray-300 border-2 rounded-2xl p-2">Tickets Per Day</Link>
          </>
        );
      case '/admin/ticketsperday':
        return (
          <>
            <Link to="/admin/tickets" className="nav-link bg-gray-300 border-2 rounded-2xl p-2">Dashboard</Link>
            <Link to="/admin/analytics" className="nav-link bg-gray-300 border-2 rounded-2xl p-2">Analytics</Link>
          </>
        );
      default:
        return null;
    }
  };

  const isAuthPage = currentPath === '/login' || currentPath === '/signup';

  return (
    <>
      <header className="bg-gray-800 text-white w-full fixed top-0 left-0 z-50 shadow px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-300">Support System</h1>
        <button onClick={toggleSidebar} className="md:hidden text-white md:text-black sm:bg-black sm:text-white">
          {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <nav className="hidden md:flex gap-4 items-center">
          {isAuthenticated && !isAuthPage ? (
            <>
              {isAdmin && adminLinks()}
              <span className="text-gray-300">{user?.name}</span>
              <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-1 md:text-black sm:bg-black sm:text-white rounded hover:bg-red-700">
                Logout
              </button>
            </>
          ) : (
            <>
              {!isAuthPage && currentPath !== '/login' && (
                <Link to="/login" className="bg-blue-600 px-4 py-1 rounded  hover:bg-blue-700">Login</Link>
              )}
              {!isAuthPage && currentPath !== '/signup' && (
                <Link to="/signup" className="bg-white text-black px-4 py-1 rounded hover:bg-gray-200">Sign Up</Link>
              )}
            </>
          )}
        </nav>
      </header>

      {isSidebarOpen && (
        <div className="fixed top-0 right-0 h-full w-40 bg-gray-900 text-white z-50 flex flex-col items-start p-4 gap-3 md:hidden shadow-lg">
          <button onClick={toggleSidebar} className="self-end mb-4 text-black">
            <X size={24} />
          </button>
          {isAuthenticated ? (
            <>
              {isAdmin && adminLinks()}
              <span className="text-sm text-gray-300 mt-2">{user?.name}</span>
              <button
                onClick={() => {
                  handleLogout();
                  toggleSidebar();
                }}
                className="w-full text-white md:text-black sm:bg-black sm:text-white text-left bg-red-600 px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {currentPath !== '/login' && (
                <Link
                  to="/login"
                  onClick={toggleSidebar}
                  className="w-full bg-blue-600 px-4 text-black py-2 rounded text-center hover:bg-blue-700"
                >
                  Login
                </Link>
              )}
              {currentPath !== '/signup' && (
                <Link
                  to="/signup"
                  onClick={toggleSidebar}
                  className="w-full bg-white text-black px-4 py-2 rounded text-center hover:bg-gray-300"
                >
                  Sign Up
                </Link>
              )}
            </>
          )}
        </div>
      )}

      <style>
        {`
          .nav-link {
            @apply border border-blue-500 px-3 py-1 rounded-xl hover:text-blue-300 transition;
          }
        `}
      </style>
    </>
  );
}

export default Header;
