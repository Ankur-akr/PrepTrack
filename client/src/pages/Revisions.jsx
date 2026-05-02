import { useState, useEffect } from 'react';
import { Search, ExternalLink, Filter, Edit2, CheckCircle, Star } from 'lucide-react';
import EditProblemModal from '../components/problems/EditProblemModal';
import { useAuth } from '../context/AuthContext';
import { getUserProblems, updateProblemStatus } from '../firebase/services';

const Revisions = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [problems, setProblems] = useState([]);
  const [editingProblem, setEditingProblem] = useState(null);
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

  const handleEditProblem = (updatedProblem) => {
    setProblems(problems.map(p => p.id === updatedProblem.id ? updatedProblem : p));
  };

  const handleMarkSolved = async (problemId) => {
    try {
      await updateProblemStatus(currentUser.uid, problemId, { status: 'Solved' });
      setProblems(problems.map(p => p.id === problemId ? { ...p, status: 'Solved' } : p));
    } catch (error) {
      alert("Failed to update status: " + error.message);
    }
  };

  const handleToggleFavourite = async (problem) => {
    const newFavStatus = !problem.isFavourite;
    try {
      await updateProblemStatus(currentUser.uid, problem.id, { isFavourite: newFavStatus });
      setProblems(problems.map(p => p.id === problem.id ? { ...p, isFavourite: newFavStatus } : p));
    } catch (error) {
      alert("Failed to update favourite status: " + error.message);
    }
  };

  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'Easy': return 'var(--success)';
      case 'Medium': return 'var(--warning)';
      case 'Hard': return 'var(--danger)';
      default: return 'var(--text-secondary)';
    }
  };

  const getDifficultyBg = (diff) => {
    switch(diff) {
      case 'Easy': return 'var(--diff-easy-bg)';
      case 'Medium': return 'var(--diff-medium-bg)';
      case 'Hard': return 'var(--diff-hard-bg)';
      default: return 'transparent';
    }
  };

  const filteredProblems = problems.filter(p => 
    p.status === 'Revision' &&
    (p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     p.topic.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="content-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem' }}>Revisions</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Review problems that need your attention.</p>
        </div>
      </div>

      <div className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search pending revisions..." 
            className="form-input"
            style={{ paddingLeft: '2.5rem', backgroundColor: 'var(--bg-primary)' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-outline" style={{ padding: '0.75rem 1rem' }}>
          <Filter size={18} /> Filters
        </button>
      </div>

      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Title</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Platform</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Difficulty</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Topic</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    Loading revisions...
                  </td>
                </tr>
              ) : filteredProblems.length > 0 ? (
                filteredProblems.map((problem) => (
                  <tr key={problem.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }} className="table-row">
                    <td style={{ padding: '1rem', fontWeight: 500 }}>
                      {problem.title}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{problem.platform}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        color: getDifficultyColor(problem.difficulty),
                        backgroundColor: getDifficultyBg(problem.difficulty)
                      }}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: 'var(--radius-sm)', 
                        fontSize: '0.85rem',
                        backgroundColor: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-color)'
                      }}>
                        {problem.topic}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <button 
                          onClick={() => handleToggleFavourite(problem)}
                          style={{ background: 'transparent', color: problem.isFavourite ? 'var(--warning)' : 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }}
                          title={problem.isFavourite ? "Remove from Favourites" : "Add to Favourites"}
                          className="hover:text-warning"
                        >
                          <Star size={18} fill={problem.isFavourite ? 'var(--warning)' : 'none'} />
                        </button>
                        <button 
                          onClick={() => handleMarkSolved(problem.id)}
                          style={{ background: 'transparent', color: 'var(--success)', cursor: 'pointer', padding: '0.25rem' }}
                          title="Mark as Solved"
                          className="hover:text-success"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          onClick={() => setEditingProblem(problem)}
                          style={{ background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }}
                          title="Edit Problem"
                          className="hover:text-accent"
                        >
                          <Edit2 size={18} />
                        </button>
                        {problem.url ? (
                          <a href={problem.url} target="_blank" rel="noreferrer" style={{ color: 'var(--text-tertiary)', padding: '0.25rem' }} title="View External">
                            <ExternalLink size={18} className="hover:text-accent" />
                          </a>
                        ) : (
                          <span style={{ color: 'var(--text-tertiary)', opacity: 0.5, padding: '0.25rem' }}><ExternalLink size={18} /></span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    No pending revisions! You're all caught up.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EditProblemModal 
        isOpen={!!editingProblem} 
        onClose={() => setEditingProblem(null)} 
        onEdit={handleEditProblem}
        problem={editingProblem}
      />
    </div>
  );
};

export default Revisions;
