import { useState } from 'react';
import { X, Link as LinkIcon, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { addProblem } from '../../firebase/services';

const AddProblemModal = ({ isOpen, onClose, onAdd }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    platform: 'LeetCode',
    difficulty: 'Easy',
    topic: 'Array',
    status: 'Solved',
    url: ''
  });
  const [customPlatform, setCustomPlatform] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const extractFromUrl = () => {
    try {
      if (!formData.url) return;
      const url = new URL(formData.url);
      
      let platform = formData.platform;
      let title = formData.title;

      if (url.hostname.includes('leetcode.com')) {
        platform = 'LeetCode';
        // e.g. https://leetcode.com/problems/two-sum/
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts[0] === 'problems' && parts[1]) {
          title = parts[1].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }
      } else if (url.hostname.includes('codeforces.com')) {
        platform = 'Codeforces';
      } else if (url.hostname.includes('hackerrank.com')) {
        platform = 'HackerRank';
      } else if (url.hostname.includes('geeksforgeeks.org')) {
        platform = 'GeeksforGeeks';
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts[0] === 'problems' && parts[1]) {
          title = parts[1].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }
      }

      setFormData(prev => ({
        ...prev,
        platform,
        title: title || prev.title
      }));
    } catch (e) {
      console.error("Invalid URL");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to add a problem.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const finalData = {
        ...formData,
        platform: formData.platform === 'Other' && customPlatform ? customPlatform : formData.platform,
        topic: formData.topic === 'Other' && customTopic ? customTopic : formData.topic
      };

      const newProblem = await addProblem(currentUser.uid, finalData);
      onAdd(newProblem);
      setFormData({
        title: '', platform: 'LeetCode', difficulty: 'Easy', topic: 'Array', status: 'Solved', url: ''
      });
      setCustomPlatform('');
      setCustomTopic('');
      onClose();
    } catch (err) {
      setError('Failed to add problem: ' + err.message);
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

        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Add New Problem</h3>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Auto-fill via URL (Optional)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="url" 
                name="url"
                className="form-input" 
                placeholder="https://leetcode.com/problems/..."
                value={formData.url}
                onChange={handleChange}
                onBlur={extractFromUrl}
              />
              <button type="button" className="btn btn-outline" onClick={extractFromUrl} style={{ padding: '0.5rem' }} title="Extract details">
                <LinkIcon size={18} />
              </button>
            </div>
          </div>

          <div className="divider" style={{ margin: '0.5rem 0' }}>Manual Entry</div>

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
              <select name="platform" className="form-input" value={formData.platform} onChange={handleChange} style={{ marginBottom: formData.platform === 'Other' ? '0.5rem' : '0' }}>
                <option value="LeetCode">LeetCode</option>
                <option value="Codeforces">Codeforces</option>
                <option value="HackerRank">HackerRank</option>
                <option value="GeeksforGeeks">GeeksforGeeks</option>
                <option value="Other">Other (Custom)</option>
              </select>
              {formData.platform === 'Other' && (
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter custom platform"
                  value={customPlatform}
                  onChange={(e) => setCustomPlatform(e.target.value)}
                  required
                />
              )}
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
              <select name="topic" className="form-input" value={formData.topic} onChange={handleChange} style={{ marginBottom: formData.topic === 'Other' ? '0.5rem' : '0' }}>
                <option value="Array">Array</option>
                <option value="String">String</option>
                <option value="Linked List">Linked List</option>
                <option value="Tree">Tree</option>
                <option value="Graph">Graph</option>
                <option value="DP">Dynamic Programming</option>
                <option value="Math">Math</option>
                <option value="Greedy">Greedy</option>
                <option value="Other">Other (Custom)</option>
              </select>
              {formData.topic === 'Other' && (
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter custom topic"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  required
                />
              )}
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
            {isSubmitting ? 'Adding...' : <><Plus size={18} /> Add Problem</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProblemModal;
