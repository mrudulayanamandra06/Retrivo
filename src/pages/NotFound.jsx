import React from 'react';
import { Link } from 'react-router-dom';
import { RetrivoLogo } from '../components/common/RetrivoLogo';
import { Search, Home, FileQuestion } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="container" style={{
      padding: '5rem 1.5rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh'
    }}>
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-terracotta-light)',
        color: 'var(--color-terracotta)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem'
      }}>
        <FileQuestion size={36} />
      </div>

      <span className="font-mono" style={{
        fontSize: '0.85rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--color-terracotta)',
        fontWeight: 600,
        marginBottom: '0.5rem'
      }}>
        Error 404 • Page Not Found
      </span>

      <h1 style={{
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        color: 'var(--color-forest)',
        marginBottom: '1rem',
        maxWidth: '560px'
      }}>
        Looks like this page got lost too.
      </h1>

      <p style={{
        color: 'var(--color-muted)',
        fontSize: '1.05rem',
        maxWidth: '460px',
        lineHeight: 1.6,
        marginBottom: '2rem'
      }}>
        The link you followed may be broken or the listing may have been permanently archived.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-forest">
          <Home size={16} />
          <span>Return to Homepage</span>
        </Link>
        <Link to="/explore" className="btn btn-outline">
          <Search size={16} />
          <span>Search Campus Listings</span>
        </Link>
      </div>
    </div>
  );
};
