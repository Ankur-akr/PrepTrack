import { useState, useEffect } from 'react';
import Navbar from './Navbar';

const AppLayout = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Switch to light by default for new logo

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="main-content" style={{ flex: 1 }}>
        {children}
      </main>
      <footer style={{
        textAlign: 'center',
        padding: '1.5rem',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-primary)'
      }}>
        Developed with ❤️ by Ankur Rai
      </footer>
    </div>
  );
};

export default AppLayout;
