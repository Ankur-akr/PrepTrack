import { useEffect } from 'react';
import Navbar from './Navbar';

const AppLayout = ({ children }) => {
  // LeetCode is essentially always dark mode. We can enforce it.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
