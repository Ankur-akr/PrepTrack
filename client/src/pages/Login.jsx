import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  
  const { loginWithEmail, registerWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isRegister) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome to PrepTrack</h2>
        <p className="auth-subtitle">
          {isRegister ? 'Create an account to start tracking.' : 'Login to sync your DSA progress.'}
        </p>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {isRegister ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div className="divider">OR</div>

        <button onClick={handleGoogleLogin} className="btn btn-outline" style={{ marginBottom: '1rem' }}>
          Continue with Google
        </button>

        <div className="text-center" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            type="button" 
            onClick={() => setIsRegister(!isRegister)}
            style={{ color: 'var(--accent-primary)', background: 'transparent', fontWeight: 500 }}
          >
            {isRegister ? 'Login here' : 'Sign up here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
