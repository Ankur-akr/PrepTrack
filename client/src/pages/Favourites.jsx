import { useState, useEffect } from 'react';
import { Search, ExternalLink, Filter, Edit2, Star, Trash2 } from 'lucide-react';
import EditProblemModal from '../components/problems/EditProblemModal';
import { useAuth } from '../context/AuthContext';
import { getUserProblems, updateProblemStatus, deleteProblem } from '../firebase/services';

const Favourites = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [problems, setProblems] = useState([]);
  const [editingProblem, setEditingProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showFilters, setShowFilters] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

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

  const handleToggleFavourite = async (problem) => {
    const newFavStatus = !problem.isFavourite;
    try {
      await updateProblemStatus(currentUser.uid, problem.id, { isFavourite: newFavStatus });
      setProblems(problems.map(p => p.id === problem.id ? { ...p, isFavourite: newFavStatus } : p));
    } catch (error) {
      alert("Failed to update favourite status: " + error.message);
    }
  };

  const handleDeleteProblem = async (problemId) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      try {
        await deleteProblem(currentUser.uid, problemId);
        setProblems(problems.filter(p => p.id !== problemId));
      } catch (error) {
        alert("Failed to delete problem: " + error.message);
      }
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

  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return p.isFavourite === true && matchesSearch && matchesDifficulty && matchesStatus;
  });

  return (
    <div className="content-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem' }}>Favourites</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Your starred problems for quick access.</p>
        </div>
      </div>

      <div className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search favourite problems..." 
              className="form-input"
              style={{ paddingLeft: '2.5rem', backgroundColor: 'var(--bg-primary)' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`} 
            style={{ padding: '0.75rem 1rem' }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} /> Filters
          </button>
        </div>

        {showFilters && (
          <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Difficulty:</label>
              <select 
                className="form-input" 
                style={{ width: 'auto', padding: '0.4rem 1rem' }}
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status:</label>
              <select 
                className="form-input" 
                style={{ width: 'auto', padding: '0.4rem 1rem' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Solved">Solved</option>
                <option value="Unsolved">Unsolved</option>
              </select>
            </div>
          </div>
        )}
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
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    Loading favourites...
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
                      <span style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        color: problem.status === 'Solved' ? 'var(--success)' : 'var(--warning)',
                        fontSize: '0.9rem'
                      }}>
                        <span style={{ 
                          width: '8px', 
                          height: '8px', 
                          borderRadius: '50%', 
                          backgroundColor: 'currentColor' 
                        }}></span>
                        {problem.status}
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
                          onClick={() => setEditingProblem(problem)}
                          style={{ background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }}
                          title="Edit Problem"
                          className="hover:text-accent"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProblem(problem.id)}
                          style={{ background: 'transparent', color: 'var(--danger)', cursor: 'pointer', padding: '0.25rem', opacity: 0.8 }}
                          title="Delete Problem"
                          className="hover:text-danger"
                        >
                          <Trash2 size={18} />
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
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    No favourite problems yet. Click the star icon on any problem to add it here!
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

export default Favourites;
