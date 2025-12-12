import React, { useState } from 'react';
import './Login.css'; // We can reuse the same CSS file!

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    // 1. Basic Empty Check
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    // 2. Password Match Check
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // 3. Password Length Check
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    // Reset error and simulate signup
    setError('');
    console.log('Registering User:', formData);
    alert(`Welcome to Cineflix, ${name}! Account created.`);
  };

  return (
    <div className="login-page">
      <div className="background-overlay"></div>

      <div className="login-container" style={{ minHeight: '680px' }}>
        <div className="logo-area">
          <h1 className="logo-text">CINE<span className="logo-highlight">FLIX</span></h1>
        </div>

        <form className="login-form" onSubmit={handleSignup}>
          <h2>Sign Up</h2>
          
          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <input 
              type="text" 
              name="name"
              placeholder="Full Name" 
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <input 
              type="email" 
              name="email"
              placeholder="Email address" 
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="Confirm Password" 
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="signin-btn">Register</button>
        </form>

        <div className="login-footer">
          <p>Already have an account? <a href="/login" className="signup-link">Sign in now</a>.</p>
          <p className="recaptcha-text">
            By clicking Register, you agree to our Terms of Use and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;