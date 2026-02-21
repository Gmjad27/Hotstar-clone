import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('https://backend-f7cf.vercel.app/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || 'Signup failed.');
        return;
      }

      navigate('/login');
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
          <p className="side-title">Create your streaming identity.</p>
          <p className="side-text">
            Save favorites, continue instantly, and discover curated recommendations.
          </p>
        </aside>

        <div className="login-container signup-container auth-card">
          <div className="logo-area">
            <h1 className="logo-text mobile-logo">CINE<span className="logo-highlight">FLIX</span></h1>
          </div>

          <form className="login-form" onSubmit={handleSignup}>
            <h2>Sign Up</h2>
            {error && <div className="error-message">{error}</div>}

            <div className="input-group">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>

            <button
              type="submit"
              className={`signin-btn ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className="login-footer">
            <p>Already have an account? <Link to="/login" className="signup-link">Sign in now</Link>.</p>
            <p className="recaptcha-text">
              By clicking Register, you agree to our Terms of Use and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
