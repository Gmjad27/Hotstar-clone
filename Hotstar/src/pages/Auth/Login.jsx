import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('https://backend-f7cf.vercel.app/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || 'Login failed.');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (networkError) {
      setError('Unable to connect to server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="background-overlay"></div>

      <div className="auth-shell">
        <aside className="auth-side">
          <h1 className="logo-text">CINE<span className="logo-highlight">FLIX</span></h1>
          <p className="side-title">Unlimited stories, one account.</p>
          <p className="side-text">
            Stream movies and series across genres. Build your list and jump right in.
          </p>
        </aside>

        <div className="login-container auth-card">
          <div className="logo-area">
            <h1 className="logo-text mobile-logo">CINE<span className="logo-highlight">FLIX</span></h1>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <h2>Sign In</h2>
            {error && <div className="error-message">{error}</div>}

            <div className="input-group">
              <input
                type="email"
                placeholder="Email or mobile number"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className={`signin-btn ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="form-help">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link to="/signup">Need help?</Link>
            </div>
          </form>

          <div className="login-footer">
            <p>New to Cineflix? <Link to="/signup" className="signup-link">Sign up now</Link>.</p>
            <p className="recaptcha-text">
              This page is protected by Google reCAPTCHA to ensure you are not a bot.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
