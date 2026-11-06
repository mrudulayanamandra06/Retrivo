import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, CheckCircle, MapPin, ShieldCheck, HeartHandshake, AlertTriangle } from 'lucide-react';
import { claimService } from '../../services/claimService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const HandoverModal = ({ claim, item, isOpen, onClose, onHandoverSuccess }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [location, setLocation] = useState(item?.storage_location || 'Main Library Help Desk');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !claim || !item) return null;

  const handleComplete = async () => {
    try {
      setSubmitting(true);
      const result = await claimService.completeHandover(
        claim.id,
        {
          handover_location: location,
          notes: notes.trim()
        },
        currentUser
      );

      // Trigger celebratory confetti burst!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#203B36', '#E9A15B', '#43836A', '#D97762', '#DCE6D9']
        });
      } catch (cErr) {
        // Confetti optional
      }

      showToast('🎉 Item successfully recovered! Handover complete.', 'success');
      if (onHandoverSuccess) onHandoverSuccess(result);
      onClose();
    } catch (err) {
      console.error('Handover completion error:', err);
      showToast(err.message || 'Failed to complete handover.', 'error');
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
          justifyContent: 'space-between',
          backgroundColor: 'var(--color-sage-light)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              backgroundColor: 'var(--color-forest)',
              color: '#FFFFFF',
              padding: '0.45rem',
              borderRadius: 'var(--radius-xs)',
              display: 'flex'
            }}>
              <HeartHandshake size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-forest)' }}>Confirm Item Handover</h3>
              <p style={{ fontSize: '0.775rem', color: 'var(--color-forest)' }}>
                Official Safe Recovery Protocol
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Instructions Box */}
          <div style={{
            backgroundColor: 'var(--color-ivory)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem',
            fontSize: '0.875rem'
          }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--color-forest)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} style={{ color: 'var(--color-forest)' }} />
              Safe Campus Handover Standard
            </h4>
            <p style={{ color: 'var(--color-muted)', lineHeight: 1.45 }}>
              Handover has been agreed upon between both verified parties. Please confirm physical exchange has occurred at the verified campus location.
            </p>
          </div>

          {/* Location Field */}
          <div className="form-group">
            <label className="form-label">
              <span>Handover Station / Location</span>
            </label>
            <div style={{ position: 'relative' }}>
              <select
                className="form-control"
                value={location}
                onChange={e => setLocation(e.target.value)}
              >
                <option value="Main Library Help Desk">Main Library Help Desk</option>
                <option value="Student Affairs Office">Student Affairs Office</option>
                <option value="Campus Security Office">Campus Security Office</option>
                <option value="Engineering Hall Front Desk">Engineering Hall Front Desk</option>
                <option value="Direct In-Person Handover">Direct In-Person Handover on Campus</option>
              </select>
            </div>
          </div>

          {/* Handover notes */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Optional Handover Notes</label>
            <input
              type="text"
              className="form-control"
              placeholder="E.g., Verified student ID in person; signed campus log sheet."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          {/* Confirmation Notice */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.8rem',
            color: 'var(--color-forest)',
            backgroundColor: 'var(--color-forest-surface)',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-sm)'
          }}>
            <CheckCircle size={16} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
            <span>
              This will update the item status to <strong>RECOVERED</strong> across Retrivo and close active claims.
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
            <button onClick={onClose} className="btn btn-outline" disabled={submitting}>
              Cancel
            </button>
            <button
              onClick={handleComplete}
              className="btn btn-forest"
              disabled={submitting}
            >
              <HeartHandshake size={16} />
              <span>{submitting ? 'Confirming...' : 'Mark Item as Recovered'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
