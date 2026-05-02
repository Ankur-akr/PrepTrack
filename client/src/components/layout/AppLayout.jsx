import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, List, History, Settings, LogOut, Sun, Moon } from 'lucide-react';

const AppLayout = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const getPageTitle = () => {
    switch(location.pathname) {
      case '/': return 'Overview';
      case '/problems': return 'Problem Tracking';
      case '/revisions': return 'Revision History';
      case '/settings': return 'Settings';
      default: return 'PrepTrack';
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <span style={{ fontSize: '24px' }}>🔥</span> PrepTrack
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/problems" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <List size={20} /> Problems
          </NavLink>
          <NavLink to="/revisions" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <History size={20} /> Revisions
          </NavLink>
          <NavLink to="/settings" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <Settings size={20} /> Settings
          </NavLink>
        </nav>
        
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button onClick={handleLogout} className="nav-item w-full" style={{ background: 'transparent', textAlign: 'left' }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>
      
      <main className="main-content">
        <header className="topbar">
          <div className="page-title">
            <h3>{getPageTitle()}</h3>
          </div>
          <div className="user-section">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div className="avatar">
              {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
