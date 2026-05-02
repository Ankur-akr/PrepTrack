import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';

const Navbar = () => {
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
          <div className="navbar-logo">
            <span style={{ color: 'var(--accent-primary)', fontSize: '1.25rem', marginRight: '0.25rem' }}>&lt;/&gt;</span> PrepTrack
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
            <NavLink to="/settings" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              Settings
            </NavLink>
          </div>
        </div>
        
        <div className="navbar-right">
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
