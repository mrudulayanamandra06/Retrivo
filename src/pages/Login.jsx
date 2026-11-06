import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { RetrivoLogo } from '../components/common/RetrivoLogo';
import { Mail, Lock, LogIn, AlertCircle, Sparkles } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fillSampleAccount = () => {
    setEmail('lalli@campus.ac.in');
    setPassword('password123');
    setError('');
    showToast('Sample account details filled in. Select Sign In to continue.', 'success');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      showToast('Signed in successfully.', 'success');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid credentials.');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <div className="container" style={{ paddingTop: '3.5rem', paddingBottom: '5rem', maxWidth: '480px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-block', marginBottom: '1rem' }}>
          <RetrivoLogo size="large" />
        </div>
        <h1 style={{ fontSize: '2rem', color: 'var(--color-forest)' }}>
          Sign In to Retrivo
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.925rem', marginTop: '0.35rem' }}>
          Sign in to manage your campus reports, matches and ownership claims
        </p>
      </div>

      {/* Main Login Form */}
      <div className="card card-padded" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)' }}>
        {error && (
          <div style={{
            backgroundColor: 'rgba(185, 77, 77, 0.1)',
            border: '1px solid var(--color-error)',
            color: 'var(--color-error)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <div style={{
          padding: '1rem 1.1rem',
          marginBottom: '1.35rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(32, 59, 54, 0.18)',
          background: 'linear-gradient(135deg, rgba(220, 230, 217, 0.55), rgba(245, 240, 230, 0.8))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.35rem', color: 'var(--color-forest)', fontWeight: 700 }}>
            <Sparkles size={16} />
            <span>Explore with a sample account</span>
          </div>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.82rem', lineHeight: 1.5, margin: '0 0 0.8rem' }}>
            Fill in Lalli's sample student credentials to explore Retrivo's reporting, matching and claim workflows.
          </p>
          <button
            type="button"
            className="btn btn-outline"
            onClick={fillSampleAccount}
            style={{ width: '100%' }}
          >
            <Sparkles size={16} />
            <span>Fill sample login details</span>
          </button>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.74rem', margin: '0.65rem 0 0', textAlign: 'center' }}>
            Sample: lalli@campus.ac.in · Password: password123
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">
              <span>Campus Email Address</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-muted)'
              }} />
              <input
                type="email"
                className="form-control"
                placeholder="name@campus.ac.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Password</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-muted)'
              }} />
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-forest btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={submitting}
          >
            <LogIn size={18} />
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--color-border)',
          fontSize: '0.875rem',
          color: 'var(--color-muted)'
        }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: 'var(--color-forest)', fontWeight: 600 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};
