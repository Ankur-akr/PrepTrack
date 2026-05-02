import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserNotes, addNote, updateNote, deleteNote } from '../firebase/services';

const Notes = () => {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!currentUser) return;
      try {
        const data = await getUserNotes(currentUser.uid);
        setNotes(data);
      } catch (error) {
        console.error("Failed to fetch notes", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, [currentUser]);

  const openAddModal = () => {
    setEditingNote(null);
    setTitle('');
    setContent('');
    setIsModalOpen(true);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTitle('');
    setContent('');
    setEditingNote(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    setIsSubmitting(true);
    try {
      if (editingNote) {
        await updateNote(currentUser.uid, editingNote.id, { title, content });
        setNotes(notes.map(n => n.id === editingNote.id ? { ...n, title, content } : n));
      } else {
        const newNote = await addNote(currentUser.uid, { title, content });
        setNotes([newNote, ...notes]);
      }
      closeModal();
    } catch (error) {
      alert("Failed to save note: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(currentUser.uid, noteId);
        setNotes(notes.filter(n => n.id !== noteId));
      } catch (error) {
        alert("Failed to delete note: " + error.message);
      }
    }
  };

  return (
    <div className="content-wrapper" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem' }}>Notes</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Jot down your DSA learnings and concepts.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={20} /> New Note
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div className="spin" style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%' }}></div>
        </div>
      ) : notes.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {notes.map((note) => (
            <div key={note.id} className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{note.title}</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => openEditModal(note)}
                    style={{ background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    className="hover:text-accent"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(note.id)}
                    style={{ background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    className="hover:text-danger"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', flexGrow: 1, margin: 0 }}>
                {note.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          No notes yet. Click "New Note" to create one!
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '2rem', margin: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{editingNote ? 'Edit Note' : 'New Note'}</h3>
              <button onClick={closeModal} style={{ background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Dynamic Programming Basics"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Content</label>
                <textarea 
                  className="form-input" 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your notes here..."
                  rows={8}
                  style={{ resize: 'vertical' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={closeModal} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
