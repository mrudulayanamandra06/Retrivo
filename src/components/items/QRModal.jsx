import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Copy, Check, QrCode as QrIcon, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const QRModal = ({ item, isOpen, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const publicUrl = item ? `${window.location.origin}/items/${item.id}` : '';

  useEffect(() => {
    if (isOpen && item) {
      QRCode.toDataURL(publicUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#203B36', // Forest green QR modules
          light: '#FFFEFA'  // Surface warm white background
        }
      })
        .then(url => setQrDataUrl(url))
        .catch(err => {
          console.error('Error generating QR code:', err);
          showToast('Failed to generate QR code', 'error');
        });
    }
  }, [isOpen, item, publicUrl, showToast]);

  if (!isOpen || !item) return null;

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `retrivo-${item.id}-qr.png`;
    link.href = qrDataUrl;
    link.click();
    showToast('QR code downloaded successfully', 'success');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    showToast('Public item link copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
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
              backgroundColor: 'var(--color-sage)',
              color: 'var(--color-forest)',
              padding: '0.4rem',
              borderRadius: 'var(--radius-xs)',
              display: 'flex'
            }}>
              <QrIcon size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Item QR Code</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Public-safe scan & retrieval link</p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-ghost btn-sm" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{
            backgroundColor: 'var(--color-surface)',
            border: '2px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            display: 'inline-block',
            marginBottom: '1rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR code for ${item.title}`}
                style={{ width: '220px', height: '220px', display: 'block', borderRadius: '4px' }}
              />
            ) : (
              <div style={{ width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>Generating QR...</span>
              </div>
            )}
          </div>

          <h4 style={{ fontSize: '1.05rem', color: 'var(--color-forest)', marginBottom: '0.25rem' }}>
            {item.title}
          </h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginBottom: '1.25rem' }}>
            Stick this QR on campus bulletin boards, departmental lost boxes, or share with campus security.
          </p>

          <div style={{
            backgroundColor: 'var(--color-ivory)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.65rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            marginBottom: '1.25rem'
          }}>
            <span className="font-mono" style={{
              fontSize: '0.775rem',
              color: 'var(--color-forest)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '260px'
            }}>
              {publicUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              title="Copy link"
            >
              {copied ? <Check size={14} style={{ color: 'var(--color-success)' }} /> : <Copy size={14} />}
            </button>
          </div>

          {/* Privacy badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            color: 'var(--color-forest)',
            backgroundColor: 'var(--color-sage-light)',
            padding: '0.4rem 0.75rem',
            borderRadius: 'var(--radius-pill)',
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-mono)'
          }}>
            <ShieldCheck size={14} />
            <span>Privacy Guaranteed: No personal phone numbers or emails encoded</span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>
              Close
            </button>
            <button onClick={handleDownload} className="btn btn-forest" style={{ flex: 1 }}>
              <Download size={16} />
              <span>Download PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
