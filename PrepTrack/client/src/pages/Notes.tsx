import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {ArrowLeft, Plus } from 'lucide-react';

interface Note {
    _id: string;
    content: string;
    createdAt: string;
}

export default function Notes() {
    const navigate = useNavigate();
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNote, setNewNote] = useState('');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (user._id) {
            fetchNotes();
        }
    }, [user._id]);

    const fetchNotes = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/notes?userId=${user._id}`);
            if (response.ok) {
                const data = await response.json();
                setNotes(data);
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim() || !user._id) return;

        try {
            const response = await fetch('http://localhost:3000/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id, content: newNote })
            });

            if (response.ok) {
                const savedNote = await response.json();
                setNotes([savedNote, ...notes]);
                setNewNote('');
            }
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem' }}>
                <button onClick={() => navigate('/')} className="btn" style={{ paddingLeft: 0, color: 'var(--text-secondary)' }}>
                    <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} /> Back to Dashboard
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <h1>My Notes</h1>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>

                {/* Add Note Form */}
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={20} color="var(--accent-primary)" /> New Note
                    </h2>
                    <form onSubmit={handleAddNote}>
                        <div className="input-group">
                            <textarea
                                placeholder="Write something..."
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    minHeight: '150px',
                                    backgroundColor: 'var(--bg-primary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '0.5rem',
                                    color: 'var(--text-primary)',
                                    resize: 'vertical'
                                }}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Save Note
                        </button>
                    </form>
                </div>

                {/* Notes List */}
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {notes.map((note) => (
                        <div key={note._id} className="card" style={{ padding: '1.5rem' }}>
                            <div style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                                {note.content}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
                                {new Date(note.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                    {notes.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                            No notes yet.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

