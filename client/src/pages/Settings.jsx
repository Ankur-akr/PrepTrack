import { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserPreferences, updateUserPreferences, addProblem } from '../firebase/services';

const Settings = () => {
  const { currentUser } = useAuth();
  const [leetcodeHandle, setLeetcodeHandle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      if (currentUser) {
        const prefs = await getUserPreferences(currentUser.uid);
        if (prefs && prefs.leetcodeHandle) {
          setLeetcodeHandle(prefs.leetcodeHandle);
        }
      }
    };
    loadPreferences();
  }, [currentUser]);

  const handleSavePreferences = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    setSaveMessage('');
    try {
      await updateUserPreferences(currentUser.uid, {
        leetcodeHandle
      });
      setSaveMessage('Preferences saved successfully!');
    } catch (error) {
      setSaveMessage('Failed to save preferences.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSync = async () => {
    if (!leetcodeHandle) {
      setSyncMessage('Please enter a LeetCode handle first.');
      return;
    }

    setIsSyncing(true);
    setSyncMessage('');

    try {
      // Fetch recent 15 AC submissions from LeetCode
      const response = await fetch('http://localhost:5000/api/leetcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            query recentAcSubmissions($username: String!, $limit: Int!) {
              recentAcSubmissionList(username: $username, limit: $limit) {
                id
                title
                titleSlug
                timestamp
              }
            }
          `,
          variables: {
            username: leetcodeHandle,
            limit: 15
          }
        })
      });

      const data = await response.json();
      
      if (data.errors) {
        setSyncMessage('Failed to fetch stats. Please check the handle.');
      } else {
        const submissions = data.data.recentAcSubmissionList;
        if (!submissions || submissions.length === 0) {
          setSyncMessage('No recent accepted submissions found.');
          return;
        }

        let addedCount = 0;
        let duplicateCount = 0;

        for (const sub of submissions) {
          try {
            await addProblem(currentUser.uid, {
              title: sub.title,
              platform: 'LeetCode',
              difficulty: 'Medium', // We default to Medium since GraphQL recentAcSubmissionList doesn't return difficulty easily
              topic: 'Other',
              status: 'Solved',
              url: `https://leetcode.com/problems/${sub.titleSlug}/`
            });
            addedCount++;
          } catch (error) {
            if (error.message.includes('already exists')) {
              duplicateCount++;
            }
          }
        }

        setSyncMessage(`Synced successfully! Added ${addedCount} new problems (${duplicateCount} skipped). Check your dashboard.`);
      }
    } catch (err) {
      setSyncMessage('Failed to connect to proxy server. Is it running on port 5000?');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="content-wrapper">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem' }}>Settings</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage integrations and account preferences.</p>
      </div>

      <div style={{ display: 'grid', gap: '2rem', maxWidth: '800px' }}>
        
        {/* Account Info */}
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Account Profile</h3>
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="text" 
              className="form-input" 
              value={currentUser?.email || 'test@example.com'} 
              disabled 
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
              Your email is managed by your authentication provider.
            </p>
          </div>
        </div>

        {/* Platform Integrations */}
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Platform Integrations</h3>
          
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">LeetCode Username</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. neetcode"
                value={leetcodeHandle}
                onChange={e => setLeetcodeHandle(e.target.value)}
              />
              <button 
                className="btn btn-outline" 
                onClick={handleSync}
                disabled={isSyncing}
                style={{ width: 'auto', whiteSpace: 'nowrap' }}
              >
                {isSyncing ? <RefreshCw size={18} className="spin" /> : <RefreshCw size={18} />} 
                {isSyncing ? ' Syncing...' : ' Sync Recent Submissions'}
              </button>
            </div>
            {syncMessage && (
              <p style={{ 
                marginTop: '1rem', 
                fontSize: '0.9rem', 
                color: syncMessage.includes('Success') || syncMessage.includes('Successfully') || syncMessage.includes('Synced') ? 'var(--success)' : 'var(--danger)' 
              }}>
                {syncMessage}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', alignItems: 'center', gap: '1rem' }}>
            {saveMessage && (
              <span style={{ fontSize: '0.9rem', color: saveMessage.includes('success') ? 'var(--success)' : 'var(--danger)' }}>
                {saveMessage}
              </span>
            )}
            <button className="btn btn-primary" style={{ width: 'auto' }} onClick={handleSavePreferences} disabled={isSaving}>
              <Save size={18} /> {isSaving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Settings;

