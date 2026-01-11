import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, CheckCircle, Circle } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL;


interface Question {
    _id: string;
    title: string;
    topic: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    link?: string;
    tags?: string[];
}

export default function Tracker() {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [solvedIds, setSolvedIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'All' | 'Solved' | 'Pending'>('All');
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem('user') || 'null');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [qRes, uRes] = await Promise.all([
                fetch(`${API_URL}/api/questions`),
                user._id ? fetch(`${API_URL}/api/users/${user._id}`) : Promise.resolve(null)
            ]);

            if (qRes.ok) {
                const qData = await qRes.json();
                setQuestions(qData);
            }

            if (uRes && uRes.ok) {
                const uData = await uRes.json();
                setSolvedIds(uData.solvedQuestions || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

   const handleSolve = async (questionId: string) => {
    if (!user?._id) return;

    try {
        const res = await fetch(`${API_URL}/api/users/solve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id, questionId })
        });

        if (res.ok) {
            setSolvedIds((prev) => [...prev, questionId]);
        }
    } catch (error) {
        console.error('Error marking solved:', error);
    }
};


    const filteredQuestions = questions.filter((q) => {
        const isSolved = solvedIds.includes(q._id);
        const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesFilter = true;
        if (filter === 'Solved') matchesFilter = isSolved;
        if (filter === 'Pending') matchesFilter = !isSolved;

        return matchesSearch && matchesFilter;
    });

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'Easy': return 'badge-success';
            case 'Medium': return 'badge-warning';
            case 'Hard': return 'badge-danger';
            default: return '';
        }
    };

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem' }}>
                <button onClick={() => navigate('/')} className="btn" style={{ paddingLeft: 0, color: 'var(--text-secondary)' }}>
                    <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} /> Back to Dashboard
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <h1>Problem Tracker</h1>
                    <button className="btn btn-primary" onClick={() => navigate('/admin')}>Add New</button>
                </div>
            </header>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem 0.75rem 3rem',
                                backgroundColor: 'var(--bg-primary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '0.5rem',
                                color: 'var(--text-primary)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="All">All Status</option>
                        <option value="Solved">Solved</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
            </div>

            <div className="card table-container" style={{ padding: 0, overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>#</th>
                                <th>Title</th>
                                <th>Difficulty</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredQuestions.map((q, index) => {
                                const isSolved = solvedIds.includes(q._id);
                                return (
                                    <tr key={q._id}>
                                        <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{index + 1}</td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                <span style={{ fontWeight: 500 }}>{q.title}</span>
                                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{q.topic}</span>
                                                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                                    {q.tags && q.tags.map((tag, i) => (
                                                        <span key={i} style={{ fontSize: '0.7rem', backgroundColor: 'var(--bg-secondary)', padding: '0.1rem 0.4rem', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${getDifficultyColor(q.difficulty)}`}>
                                                {q.difficulty}
                                            </span>
                                        </td>
                                        <td>
                                            {isSolved ? (
                                                <span style={{ display: 'flex', alignItems: 'center', color: '#4ade80', gap: '0.5rem', fontSize: '0.9rem' }}>
                                                    <CheckCircle size={16} /> Solved
                                                </span>
                                            ) : (
                                                <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', gap: '0.5rem', fontSize: '0.9rem' }}>
                                                    <Circle size={16} /> Pending
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            {!isSolved && (
                                                <button onClick={() => handleSolve(q._id)} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
                                                    Mark Done
                                                </button>
                                            )}
                                            {q.link && (
                                                <a href={q.link} target="_blank" rel="noopener noreferrer" className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', color: 'var(--accent-primary)', display: 'inline-block' }}>
                                                    Link
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

