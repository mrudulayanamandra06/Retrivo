import React from 'react';
import { Link } from 'react-router-dom';
import { RetrivoLogo } from '../common/RetrivoLogo';
import { ShieldCheck, MapPin } from 'lucide-react';

const linkStyle = {
  color: 'rgba(245, 240, 230, 0.78)',
  fontSize: '0.925rem',
  transition: 'color 160ms ease'
};

export const Footer = () => (
  <footer style={{
    background: 'var(--color-forest)',
    color: 'var(--color-ivory)',
    marginTop: 'auto',
    padding: '3.5rem 0 1.5rem'
  }}>
    <div className="container">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '2.75rem',
        paddingBottom: '2.75rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
          <RetrivoLogo variant="light" size="large" />
          <p style={{ maxWidth: '340px', color: 'rgba(245, 240, 230, 0.72)', lineHeight: 1.75, fontSize: '0.94rem' }}>
            A simpler way for campus communities to report lost belongings, find possible matches and return items to their rightful owners.
          </p>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-marigold)', fontSize: '0.8rem' }}>
            <ShieldCheck size={16} /> Responsible item recovery
          </span>
        </div>

        <div>
          <h4 style={{ color: 'var(--color-marigold)', fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.2rem', fontFamily: 'var(--font-mono)' }}>
            Explore Retrivo
          </h4>
          <nav aria-label="Footer navigation" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <Link to="/explore" style={linkStyle}>Browse items</Link>
            <Link to="/report-lost" style={linkStyle}>Report a lost item</Link>
            <Link to="/report-found" style={linkStyle}>Report a found item</Link>
            <Link to="/dashboard" style={linkStyle}>My dashboard</Link>
            <Link to="/my-claims" style={linkStyle}>Track a claim</Link>
          </nav>
        </div>

        <div>
          <h4 style={{ color: 'var(--color-marigold)', fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.2rem', fontFamily: 'var(--font-mono)' }}>
            Safer handovers
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', color: 'rgba(245, 240, 230, 0.76)', fontSize: '0.9rem', lineHeight: 1.7 }}>
            <p style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
              <MapPin size={17} style={{ color: 'var(--color-marigold)', flexShrink: 0, marginTop: '3px' }} />
              Choose a public, well-lit location on your campus for item handover.
            </p>
            <p>Verify ownership using details that are not publicly visible in the item listing.</p>
            <p>When in doubt, coordinate through your institution's official security or student support office.</p>
          </div>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.14)',
        paddingTop: '1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.85rem',
        color: 'rgba(245, 240, 230, 0.62)',
        fontSize: '0.8rem'
      }}>
        <span>© {new Date().getFullYear()} Retrivo. Find it. Verify it. Retrieve it.</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          Designed for campus communities in India
        </span>
      </div>
    </div>
  </footer>
);
