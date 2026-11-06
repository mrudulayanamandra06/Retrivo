import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { claimService } from '../services/claimService';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Building,
  AlertCircle
} from 'lucide-react';

export const MyClaims = () => {
  const { currentUser } = useAuth();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchClaims = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        const data = await claimService.getClaimsForUser(currentUser.id);
        setClaims(data);
      } catch (err) {
        console.error('Error fetching claims:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Sign In Required</h2>
        <p style={{ color: 'var(--color-muted)', margin: '1rem 0' }}>
          Please sign in to track your ownership verification claims.
        </p>
        <Link to="/login" className="btn btn-forest">Sign In</Link>
      </div>
    );
  }

  const filteredClaims = claims.filter(c => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '920px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--color-forest)' }}>
          My Ownership Claims
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>
          Track ownership verification status, reviewer decisions, and safe campus handover instructions
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--color-border)',
        marginBottom: '2rem',
        overflowX: 'auto',
        paddingBottom: '2px'
      }}>
        {['all', 'pending', 'under_review', 'approved', 'completed', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: filter === status ? '3px solid var(--color-forest)' : '3px solid transparent',
              color: filter === status ? 'var(--color-forest)' : 'var(--color-muted)',
              fontWeight: filter === status ? 700 : 500,
              padding: '0.65rem 1rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              textTransform: 'capitalize',
              whiteSpace: 'nowrap'
            }}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Claims List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map(n => (
            <div key={n} className="card card-padded skeleton" style={{ height: '140px' }} />
          ))}
        </div>
      ) : filteredClaims.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredClaims.map(claim => {
            const isApproved = claim.status === 'approved';
            const isCompleted = claim.status === 'completed';
            const isRejected = claim.status === 'rejected';

            return (
              <div
                key={claim.id}
                className="card card-padded"
                style={{
                  borderLeft: isApproved || isCompleted
                    ? '4px solid var(--color-success)'
                    : isRejected
                    ? '4px solid var(--color-error)'
                    : '4px solid var(--color-marigold)'
                }}
              >
                <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.25rem' }}>
                        {claim.item ? (
                          <Link to={`/items/${claim.item.id}`} style={{ color: 'var(--color-forest)' }}>
                            {claim.item.title}
                          </Link>
                        ) : 'Claimed Item'}
                      </h3>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '0.2rem' }}>
                      Submitted on {new Date(claim.created_at).toLocaleDateString()} • Target location: {claim.item?.location}
                    </div>
                  </div>

                  <span className={`badge ${
                    isApproved ? 'badge-approved' :
                    isCompleted ? 'badge-recovered' :
                    isRejected ? 'badge-rejected' : 'badge-pending'
                  }`}>
                    {claim.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Proof Submitted */}
                <div style={{
                  backgroundColor: 'var(--color-ivory)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  marginBottom: '1rem',
                  border: '1px solid var(--color-border)'
                }}>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.25rem' }}>
                    Your Submitted Ownership Proof
                  </div>
                  <div>{claim.proof_description}</div>
                </div>

                {/* Handover Notice for Approved Claims */}
                {isApproved && (
                  <div style={{
                    backgroundColor: 'rgba(67, 131, 106, 0.1)',
                    border: '1px solid var(--color-success)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-success)', fontWeight: 600 }}>
                      <CheckCircle2 size={18} />
                      <span>Claim Approved! Coordinate Safe Handover</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-forest)', lineHeight: 1.5 }}>
                      The finder has verified your ownership proof. Please bring student ID to:
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--color-forest)' }}>
                      <Building size={16} />
                      <span>{claim.item?.storage_location || 'Main Library Help Desk'}</span>
                    </div>
                  </div>
                )}

                {/* Reviewer Note */}
                {claim.review_note && (
                  <div style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-muted)',
                    fontStyle: 'italic',
                    marginBottom: '1rem'
                  }}>
                    Review note: "{claim.review_note}"
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {claim.item && (
                    <Link to={`/items/${claim.item.id}`} className="btn btn-outline btn-sm">
                      <span>View Item Details</span>
                      <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)'
        }}>
          <FileCheck2 size={44} style={{ color: 'var(--color-muted)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-forest)' }}>No Claims in This Category</h3>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Browse found items on campus to find lost belongings and submit ownership verification.
          </p>
          <Link to="/explore?type=found" className="btn btn-forest" style={{ marginTop: '1.25rem' }}>
            Explore Found Items
          </Link>
        </div>
      )}
    </div>
  );
};
