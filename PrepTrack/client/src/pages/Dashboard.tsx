import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Flame, BookOpen } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [stats, setStats] = useState({
        streak: 0,
        solvedCount: 0
    });

    useEffect(() => {
        if (user._id) {
            fetch(`http://localhost:3000/api/users/${user._id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.name) { // check if valid user
                        setStats({
                            streak: data.streak || 0,
                            solvedCount: data.solvedCount || 0
                        });
                    }
                })
                .catch(err => console.error(err));
        }
    }, [user._id]);

    const statCards = [
        { label: 'Current Streak', value: `${stats.streak} Days`, icon: Flame },
        { label: 'Questions Solved', value: `${stats.solvedCount}`, icon: Target },
        { label: 'Topics Covered', value: 'N/A', icon: BookOpen }, // Placeholder until we have topics agg
    ];

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h1>Placement Prep</h1>
                    {user.name && <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Welcome back, {user.name}</span>}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn" onClick={() => navigate('/notes')} style={{ color: 'var(--text-secondary)' }}>Notes</button>
                    <button className="btn" onClick={() => navigate('/admin')} style={{ color: 'var(--text-secondary)' }}>Admin</button>
                    <button className="btn btn-primary" onClick={() => navigate('/login')}>
                        Sign Out
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                {statCards.map((stat, i) => (
                    <div key={i} className="card flex-center" style={{ flexDirection: 'column', gap: '1rem', cursor: 'pointer' }} onClick={() => navigate('/tracker')}>
                        <stat.icon size={32} color="var(--accent-primary)" />
                        <h2 style={{ fontSize: '2rem', margin: 0 }}>{stat.value}</h2>
                        <span style={{ color: 'var(--text-secondary)' }}>{stat.label}</span>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button className="btn btn-primary" onClick={() => navigate('/tracker')}>
                    Go to Problem Tracker
                </button>
            </div>
        </div>
    );
}
