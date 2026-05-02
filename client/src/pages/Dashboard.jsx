import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProblems } from '../firebase/services';
import StatCards from '../components/dashboard/StatCards';
import ProgressCharts from '../components/dashboard/ProgressCharts';
import InsightsCard from '../components/dashboard/InsightsCard';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      if (!currentUser) return;
      try {
        const data = await getUserProblems(currentUser.uid);
        setProblems(data);
      } catch (error) {
        console.error("Failed to fetch problems", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProblems();
  }, [currentUser]);

  // Calculate stats based on real data
  const stats = useMemo(() => {
    const totalSolved = problems.filter(p => p.status === 'Solved').length;
    const revisionsPending = problems.filter(p => p.status === 'Revision').length;
    
    return {
      totalSolved,
      revisionsPending
    };
  }, [problems]);

  if (isLoading) {
    return (
      <div className="content-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div className="spin" style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%' }}></div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem' }}>Welcome Back, {currentUser?.displayName || 'User'}! 👋</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Here's an overview of your DSA preparation journey.</p>
      </div>

      <StatCards stats={stats} />
      <ProgressCharts problems={problems} />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <InsightsCard problems={problems} />
      </div>
    </div>
  );
};

export default Dashboard;
