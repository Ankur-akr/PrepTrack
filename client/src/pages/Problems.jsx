import { useState, useEffect } from 'react';
import { Search, Plus, ExternalLink, Filter, Edit2 } from 'lucide-react';
import AddProblemModal from '../components/problems/AddProblemModal';
import EditProblemModal from '../components/problems/EditProblemModal';
import { useAuth } from '../context/AuthContext';
import { getUserProblems } from '../firebase/services';

const Problems = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [problems, setProblems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleAddProblem = (newProblem) => {
    setProblems([newProblem, ...problems]);
  };

  const handleEditProblem = (updatedProblem) => {
    setProblems(problems.map(p => p.id === updatedProblem.id ? updatedProblem : p));
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
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem' }}>Problems</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage and track your DSA questions.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> Add Problem
        </button>
      </div>

      <div className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search problems..." 
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
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    Loading problems...
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
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    No problems found. Click "Add Problem" to start tracking!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddProblemModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddProblem} 
      />

      <EditProblemModal 
        isOpen={!!editingProblem} 
        onClose={() => setEditingProblem(null)} 
        onEdit={handleEditProblem}
        problem={editingProblem}
      />
    </div>
  );
};

export default Problems;
