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
    <div className="app-container">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
