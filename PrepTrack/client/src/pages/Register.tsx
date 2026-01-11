import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                navigate('/');
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Register Error:', error);
            alert('Network error. Is the backend running?');
        }
    };

    return (
        <div className="flex-center h-screen">
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="flex-center" style={{ marginBottom: '2rem', flexDirection: 'column' }}>
                    <UserPlus size={48} color="var(--accent-primary)" />
                    <h1 style={{ margin: '1rem 0 0' }}>Create Account</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Join safely to track your placement prep</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Sign Up
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
                    <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
}
