import { Trophy, Target, Flame, CalendarSync } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, colorClass }) => {
  return (
    <div className="stat-card glass" style={{
      padding: '1.5rem',
      borderRadius: 'var(--radius-xl)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-md)'
    }}>
      <div>
        <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 500 }}>
          {title}
        </h4>
        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          {value}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
          {subtitle}
        </div>
      </div>
      <div className={`icon-wrapper ${colorClass}`} style={{
        padding: '0.75rem',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={24} />
      </div>
    </div>
  );
};

const StatCards = ({ stats }) => {
  // Stats could be passed down from a parent component that fetches them
  const defaultStats = {
    totalSolved: 142,
    streak: 12,
    revisionsPending: 8,
    accuracy: '85%'
  };

  const data = stats || defaultStats;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    }}>
      <StatCard 
        title="Total Solved" 
        value={data.totalSolved} 
        subtitle="+5 this week"
        icon={Trophy}
        colorClass="text-accent"
      />
      <StatCard 
        title="Current Streak" 
        value={`${data.streak} Days`} 
        subtitle="Longest: 24 days"
        icon={Flame}
        colorClass="text-warning"
      />
      <StatCard 
        title="Pending Revisions" 
        value={data.revisionsPending} 
        subtitle="Needs attention"
        icon={CalendarSync}
        colorClass="text-danger"
      />
      <StatCard 
        title="Accuracy (Easy/Med)" 
        value={data.accuracy} 
        subtitle="Based on first attempts"
        icon={Target}
        colorClass="text-success"
      />
    </div>
  );
};

export default StatCards;
