import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Sun, Moon, Menu, X } from 'lucide-react';

const Navbar = ({ theme, toggleTheme }) => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="navbar-logo" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/prepTrackdark.png" alt="PrepTrack Logo" style={{ height: '40px', marginRight: '0.75rem' }} />
            <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>prep<span style={{ color: 'var(--success)' }}>Track</span></span>
          </div>
        </div>
        
        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <NavLink to="/" onClick={closeMenu} className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            Dashboard
          </NavLink>
          <NavLink to="/problems" onClick={closeMenu} className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            Problems
          </NavLink>
          <NavLink to="/revisions" onClick={closeMenu} className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            Revisions
          </NavLink>
          <NavLink to="/favourites" onClick={closeMenu} className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            Favourites
          </NavLink>
          <NavLink to="/notes" onClick={closeMenu} className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            Notes
          </NavLink>
          <NavLink to="/settings" onClick={closeMenu} className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            Settings
          </NavLink>
        </div>

        <div className="navbar-right">
          <button className="btn-logout" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <div className="avatar" title={currentUser?.email}>
            {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
          </div>
          <button onClick={handleLogout} className="btn-logout hide-on-mobile" title="Logout">
            <LogOut size={18} />
          </button>
          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
