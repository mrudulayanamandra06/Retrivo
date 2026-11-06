import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Clock, ShieldAlert, Lock, AlertCircle } from 'lucide-react';
import { claimService } from '../../services/claimService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const ReviewModal = ({ claim, item, isOpen, onClose, onReviewSuccess }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [status, setStatus] = useState(claim?.status || 'under_review');
  const [reviewNote, setReviewNote] = useState(claim?.review_note || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !claim) return null;

  const handleUpdate = async (selectedStatus) => {
    setError('');
    try {
      setSubmitting(true);
      const updated = await claimService.reviewClaim(
        claim.id,
        {
          status: selectedStatus,
          review_note: reviewNote.trim()
        },
        currentUser
      );

      showToast(`Claim marked as ${selectedStatus.replace('_', ' ').toUpperCase()}`, 'success');
      if (onReviewSuccess) onReviewSuccess(updated);
      onClose();
    } catch (err) {
      console.error('Error reviewing claim:', err);
      setError(err.message || 'Failed to update claim review.');
      showToast(err.message || 'Review update failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-forest)' }}>Review Ownership Claim</h3>
            <p style={{ fontSize: '0.775rem', color: 'var(--color-muted)' }}>
              Evaluate evidence submitted by claimant
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && (
            <div style={{
              backgroundColor: 'rgba(185, 77, 77, 0.1)',
              border: '1px solid var(--color-error)',
              color: 'var(--color-error)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem'
            }}>
              {error}
            </div>
          )}

          {/* Claimant Info */}
          <div style={{
            backgroundColor: 'var(--color-ivory)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.725rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
                Claimant Name
              </span>
              <div style={{ fontWeight: 600, color: 'var(--color-forest)', fontSize: '1rem' }}>
                {claim.claimant?.full_name || 'Campus Student'}
              </div>
            </div>
            <span className={`badge ${
              claim.status === 'approved' ? 'badge-approved' :
              claim.status === 'rejected' ? 'badge-rejected' : 'badge-pending'
            }`}>
              {claim.status.replace('_', ' ')}
            </span>
          </div>

          {/* Public Proof Description */}
          <div>
            <label className="form-label">Submitted Ownership Description</label>
            <div style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              padding: '0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              lineHeight: 1.5
            }}>
              {claim.proof_description}
            </div>
          </div>

          {/* Confidential Private Identifying Details */}
          <div>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Lock size={14} style={{ color: 'var(--color-terracotta)' }} />
              <span style={{ color: 'var(--color-forest)' }}>Confidential Verification Details</span>
            </label>
            <div style={{
              backgroundColor: 'rgba(233, 161, 91, 0.1)',
              border: '1px dashed var(--color-marigold)',
              padding: '0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              color: 'var(--color-text)',
              lineHeight: 1.5,
              fontFamily: 'var(--font-mono)'
            }}>
              {claim.private_verification_details || 'No private serial numbers specified.'}
            </div>
            <span className="form-hint" style={{ marginTop: '0.25rem', display: 'block' }}>
              Verify whether these match the physical item (lockscreen, sticker positions, inner labels).
            </span>
          </div>

          {/* Review Note */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Review Feedback / Notes (Sent to Claimant)</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="E.g., Serial numbers match the sticker. Handover ready at Main Library desk..."
              value={reviewNote}
              onChange={e => setReviewNote(e.target.value)}
            />
          </div>

          {/* Action Decision Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.65rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--color-border)'
          }}>
            <button
              type="button"
              onClick={() => handleUpdate('under_review')}
              disabled={submitting}
              className="btn btn-outline btn-sm"
              style={{ color: 'var(--color-forest)' }}
            >
              <Clock size={15} />
              <span>Under Review</span>
            </button>

            <button
              type="button"
              onClick={() => handleUpdate('rejected')}
              disabled={submitting}
              className="btn btn-sm"
              style={{
                backgroundColor: 'rgba(185, 77, 77, 0.12)',
                color: 'var(--color-error)',
                border: '1px solid rgba(185, 77, 77, 0.3)'
              }}
            >
              <XCircle size={15} />
              <span>Reject Claim</span>
            </button>

            <button
              type="button"
              onClick={() => handleUpdate('approved')}
              disabled={submitting}
              className="btn btn-sm"
              style={{
                backgroundColor: 'var(--color-success)',
                color: '#FFFFFF',
                border: '1px solid var(--color-success)'
              }}
            >
              <CheckCircle2 size={15} />
              <span>Approve Claim</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
