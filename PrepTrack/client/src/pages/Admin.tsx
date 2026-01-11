import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowLeft } from 'lucide-react';

export default function Admin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        topic: '',
        difficulty: 'Easy',
        link: '',
        tags: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
            };

            const response = await fetch('http://localhost:3000/api/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert('Question added successfully!');
                setFormData({ title: '', topic: '', difficulty: 'Easy', link: '', tags: '' });
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to add question');
            }
        } catch (error) {
            console.error('Error adding question:', error);
            alert('Network error');
        }
    };

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem' }}>
                <button onClick={() => navigate('/')} className="btn" style={{ paddingLeft: 0, color: 'var(--text-secondary)' }}>
                    <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} /> Back to Dashboard
                </button>
            </header>

            <div className="flex-center" style={{ minHeight: '60vh' }}>
                <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                    <div className="flex-center" style={{ marginBottom: '2rem', flexDirection: 'column' }}>
                        <PlusCircle size={48} color="var(--accent-primary)" />
                        <h1 style={{ margin: '1rem 0 0' }}>Add New Question</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Expand the question bank</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="title">Problem Title</label>
                            <input
                                id="title"
                                type="text"
                                placeholder="e.g. Reverse Linked List"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="input-group">
                                <label htmlFor="topic">Topic</label>
                                <input
                                    id="topic"
                                    type="text"
                                    placeholder="e.g. Linked List"
                                    value={formData.topic}
                                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="difficulty">Difficulty</label>
                                <select
                                    id="difficulty"
                                    value={formData.difficulty}
                                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        backgroundColor: 'var(--bg-primary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '0.5rem',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem'
                                    }}
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="tags">Tags (Comma Separated)</label>
                            <input
                                id="tags"
                                type="text"
                                placeholder="e.g. Two Pointers, Recursion"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="link">Problem Link (Optional)</label>
                            <input
                                id="link"
                                type="url"
                                placeholder="https://leetcode.com/problems/..."
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                            Add Question
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
