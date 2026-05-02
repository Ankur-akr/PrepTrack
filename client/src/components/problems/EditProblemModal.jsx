import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateProblemStatus } from '../../firebase/services';

const EditProblemModal = ({ isOpen, onClose, onEdit, problem }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    platform: 'LeetCode',
    difficulty: 'Easy',
    topic: 'Array',
    status: 'Solved',
    url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (problem && isOpen) {
      setFormData({
        title: problem.title || '',
        platform: problem.platform || 'LeetCode',
        difficulty: problem.difficulty || 'Easy',
        topic: problem.topic || 'Array',
        status: problem.status || 'Solved',
        url: problem.url || ''
      });
      setError('');
    }
  }, [problem, isOpen]);

  if (!isOpen || !problem) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to edit a problem.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await updateProblemStatus(currentUser.uid, problem.id, formData);
      onEdit({ ...problem, ...formData });
      onClose();
    } catch (err) {
      setError('Failed to edit problem: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50
    }}>
      <div className="glass" style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '2rem',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: '500px',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', color: 'var(--text-secondary)' }}
        >
          <X size={20} />
        </button>

        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Edit Problem</h3>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Problem URL (Optional)</label>
            <input 
              type="url" 
              name="url"
              className="form-input" 
              placeholder="https://leetcode.com/problems/..."
              value={formData.url}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Problem Title *</label>
            <input 
              type="text" 
              name="title"
              className="form-input" 
              value={formData.title}
              onChange={handleChange}
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Platform</label>
              <select name="platform" className="form-input" value={formData.platform} onChange={handleChange}>
                <option value="LeetCode">LeetCode</option>
                <option value="Codeforces">Codeforces</option>
                <option value="HackerRank">HackerRank</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Difficulty</label>
              <select name="difficulty" className="form-input" value={formData.difficulty} onChange={handleChange}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Topic</label>
              <select name="topic" className="form-input" value={formData.topic} onChange={handleChange}>
                <option value="Array">Array</option>
                <option value="String">String</option>
                <option value="Linked List">Linked List</option>
                <option value="Tree">Tree</option>
                <option value="Graph">Graph</option>
                <option value="DP">Dynamic Programming</option>
                <option value="Math">Math</option>
                <option value="Greedy">Greedy</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Status</label>
              <select name="status" className="form-input" value={formData.status} onChange={handleChange}>
                <option value="Solved">Solved</option>
                <option value="Revision">Needs Revision</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : <><Save size={18} /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProblemModal;
