'use client';
import { useState } from 'react';
import styles from './index.module.css';

const LogInForm = ({ onSwitch }: { onSwitch: () => void }) => {
  const [form, setForm] = useState({ username: '', password: '', remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Username and password are required.');
      return;
    }
    setError('');
    alert('Log in successful!');
  };
  return (
    <div className={styles.signupForm}>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div style={{ marginBottom: 18, position: 'relative', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
          <label style={{ display: 'none' }}>Username</label>
          <span style={{ position: 'absolute', left: 16, top: 10, fontSize: 22, color: '#222' }}>👤</span>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            style={{ paddingLeft: 48, width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: 18, position: 'relative', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
          <label style={{ display: 'none' }}>Password</label>
          <span style={{ position: 'absolute', left: 16, top: 10, fontSize: 22, color: '#222' }}>🔒</span>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            style={{ paddingLeft: 48, width: '100%' }}
          />
          <span
            onClick={() => setShowPassword((v) => !v)}
            style={{ position: 'absolute', right: 16, top: 10, fontSize: 22, color: '#222', cursor: 'pointer', userSelect: 'none' }}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: 15, color: '#fff' }}>
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
              style={{ marginRight: 8 }}
            />
            Remember me
          </label>
          <span style={{ color: '#fff', fontSize: 15, cursor: 'pointer', textDecoration: 'underline' }}>Forgot Password?</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.footer}>
          <span>Don't have an account? <a href="#" style={{ color: '#e0c58f', textDecoration: 'underline' }} onClick={onSwitch}>Sign Up</a></span>
        </div>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

const SignUpForm = ({ onSwitch }: { onSwitch: () => void }) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    alert('Sign up successful!');
  };
  return (
    <div className={styles.signupForm}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div style={{ marginBottom: 18 }}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter your username"
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>
        <div className={styles.row} style={{ marginBottom: 18 }}>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
            />
          </div>
          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
            />
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.footer}>
          <span>Already have an account? <a href="#" style={{ color: '#e0c58f', textDecoration: 'underline' }} onClick={onSwitch}>Login</a></span>
        </div>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <div className={styles.background}>
      <div className={styles.signupContainer}>
        <div className={styles.treeLogo}>
        </div>
        {showLogin ? (
          <LogInForm onSwitch={() => setShowLogin(false)} />
        ) : (
          <SignUpForm onSwitch={() => setShowLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;