import React, { useState } from 'react';
import './Login.css'; // Importing the CSS file

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        // Simple Validation
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        // Reset error and simulate login
        setError('');
        console.log('Logging in with:', { email, password });
        alert('Login Successful! (Simulated)');
    };

    return (
        <div className="login-page">
            {/* Background Overlay */}
            <div className="background-overlay"></div>

            <div className="login-container">
                {/* Logo Area */}
                <div className="logo-area">
                    <h1 className="logo-text">CINE<span className="logo-highlight">FLIX</span></h1>
                </div>

                {/* Login Form */}
                <form className="login-form" onSubmit={handleLogin}>
                    <h2>Sign In</h2>

                    {error && <div className="error-message">{error}</div>}

                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email or mobile number"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="signin-btn">Sign In</button>

                    <div className="form-help">
                        <div className="remember-me">
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember">Remember me</label>
                        </div>
                        <a href="#">Need help?</a>
                    </div>
                </form>

                {/* Footer / Sign Up Area */}
                <div className="login-footer">
                    <p>New to Cineflix? <a href="#" className="signup-link">Sign up now</a>.</p>
                    <p className="recaptcha-text">
                        This page is protected by Google reCAPTCHA to ensure you're not a bot.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;