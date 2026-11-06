import React, { useState } from 'react';
import { X, ShieldCheck, Lock, AlertCircle, FileCheck } from 'lucide-react';
import { claimService } from '../../services/claimService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const ClaimModal = ({ item, isOpen, onClose, onClaimSuccess }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [proofDescription, setProofDescription] = useState('');
  const [privateDetails, setPrivateDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!proofDescription.trim()) {
      setError('Please provide a general description proving this item is yours.');
      return;
    }

    if (!privateDetails.trim()) {
      setError('Please provide at least one private identifying detail (e.g. serial number, lockscreen wallpaper, or internal pouch contents).');
      return;
    }

    try {
      setSubmitting(true);
      const claim = await claimService.submitClaim(
        {
          item_id: item.id,
          proof_description: proofDescription,
          private_verification_details: privateDetails
        },
        currentUser
      );

      showToast('Ownership claim submitted successfully! Finder notified.', 'success');
      if (onClaimSuccess) onClaimSuccess(claim);
      onClose();
    } catch (err) {
      console.error('Error submitting claim:', err);
      setError(err.message || 'Failed to submit ownership claim.');
      showToast(err.message || 'Failed to submit claim.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              backgroundColor: 'var(--color-marigold-light)',
              color: 'var(--color-forest)',
              padding: '0.4rem',
              borderRadius: 'var(--radius-xs)',
              display: 'flex'
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Claim Ownership</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Secure Verification Protocol</p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-ghost btn-sm" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {error && (
            <div style={{
              backgroundColor: 'rgba(185, 77, 77, 0.1)',
              border: '1px solid var(--color-error)',
              color: 'var(--color-error)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{error}</span>
            </div>
          )}

          {/* Item Target Brief */}
          <div style={{
            backgroundColor: 'var(--color-ivory)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem'
          }}>
            <span style={{ fontSize: '0.725rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
              Target Found Item
            </span>
            <div style={{ fontWeight: 600, color: 'var(--color-forest)', fontSize: '0.95rem' }}>
              {item.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
              Found at: {item.location} • {item.category}
            </div>
          </div>

          {/* Proof Description Field */}
          <div className="form-group">
            <label className="form-label">
              <span>Public Ownership Description <span className="required">*</span></span>
            </label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="E.g., I lost this item on Thursday afternoon while studying for exam; the casing has a specific logo sticker on the back..."
              value={proofDescription}
              onChange={e => setProofDescription(e.target.value)}
              required
            />
            <span className="form-hint">
              Explain how you lost it and why you believe this is your belonging.
            </span>
          </div>

          {/* Private Verification Details Field */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Lock size={14} style={{ color: 'var(--color-forest)' }} />
              <span>Private Verification Information <span className="required">*</span></span>
            </label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Confidential: serial number, lockscreen wallpaper detail, engraving text, internal zipper contents, or password hint..."
              value={privateDetails}
              onChange={e => setPrivateDetails(e.target.value)}
              required
              style={{ borderColor: 'var(--color-forest)' }}
            />
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.4rem',
              fontSize: '0.75rem',
              color: 'var(--color-forest)',
              backgroundColor: 'var(--color-sage-light)',
              padding: '0.5rem 0.65rem',
              borderRadius: 'var(--radius-xs)',
              marginTop: '0.35rem'
            }}>
              <ShieldCheck size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>
                <strong>Zero Public Exposure:</strong> Private details are encrypted and viewable ONLY by the finder or campus administrator evaluating your claim.
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-marigold" disabled={submitting}>
              <FileCheck size={16} />
              <span>{submitting ? 'Submitting Claim...' : 'Submit Ownership Claim'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
