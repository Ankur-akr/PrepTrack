import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Sun, Moon } from 'lucide-react';

const Navbar = ({ theme, toggleTheme }) => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="navbar-logo" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="PrepTrack Logo" style={{ height: '48px', marginRight: '0.75rem' }} />
            <span style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.5px' }}>prep<span style={{ color: 'var(--success)' }}>Track</span></span>
          </div>
          <div className="navbar-links">
            <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              Dashboard
            </NavLink>
            <NavLink to="/problems" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              Problems
            </NavLink>
            <NavLink to="/revisions" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              Revisions
            </NavLink>
            <NavLink to="/favourites" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              Favourites
            </NavLink>
            <NavLink to="/notes" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              Notes
            </NavLink>
            <NavLink to="/settings" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              Settings
            </NavLink>
          </div>
        </div>
        
        <div className="navbar-right">
          <button className="btn-logout" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle Theme" style={{ marginRight: '0.5rem' }}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <div className="avatar" title={currentUser?.email}>
            {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
          </div>
          <button onClick={handleLogout} className="btn-logout" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
