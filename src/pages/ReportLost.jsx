import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { itemService } from '../services/itemService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ItemVisual } from '../components/items/ItemVisual';
import {
  FileText,
  Upload,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Award,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  X
} from 'lucide-react';

const CATEGORIES = [
  'Electronics',
  'ID Cards',
  'Books & Notes',
  'Bags',
  'Clothing',
  'Accessories',
  'Keys',
  'Other'
];

export const ReportLost = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    description: '',
    location: '',
    event_date: new Date().toISOString().split('T')[0],
    approximate_time: '',
    distinguishing_features: '',
    reward_information: '',
    image_url: ''
  });

  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5MB.');
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
      setFormData(prev => ({ ...prev, image_url: reader.result }));
    };
    reader.readAsDataURL(file);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setError('You must sign in to submit a report.');
      showToast('Please sign in to report an item', 'error');
      return;
    }

    if (!formData.title.trim()) {
      setError('Item title is required.');
      return;
    }

    if (!formData.location.trim()) {
      setError('Last seen location is required.');
      return;
    }

    if (!formData.description.trim()) {
      setError('Item description is required.');
      return;
    }

    if (!formData.distinguishing_features.trim()) {
      setError('Please provide distinguishing features to help match and verify ownership.');
      return;
    }

    try {
      setSubmitting(true);
      const created = await itemService.createItem(
        {
          ...formData,
          image_file: selectedImage,
          item_type: 'lost'
        },
        currentUser
      );

      showToast('Lost item tag filed! Smart matching engine triggered.', 'success');
      navigate(`/items/${created.id}`);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to submit report. Please try again.');
      showToast(err.message || 'Submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '820px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="rubber-stamp stamp-lost" style={{ fontSize: '0.7rem' }}>
            INTAKE FILING
          </span>
          <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
            [INCIDENT REGISTRATION]
          </span>
        </div>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--color-forest)' }}>
          File a Lost Property Tag
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '1rem', marginTop: '0.35rem' }}>
          Record your lost belonging into the university registry to activate the smart matching engine.
        </p>
      </div>

      {/* Main Physical Form Card */}
      <div style={{
        backgroundColor: '#FFFEFA',
        border: '2px solid var(--color-forest)',
        borderRadius: 'var(--radius-sm)',
        padding: '2.5rem',
        boxShadow: '6px 6px 0px var(--color-forest)',
        position: 'relative'
      }}>
        <div className="washi-tape" />

        {error && (
          <div style={{
            backgroundColor: 'rgba(185, 77, 77, 0.12)',
            border: '1.5px solid var(--color-error)',
            color: 'var(--color-error)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-xs)',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Section 1 */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1.5px dashed var(--color-border)',
              paddingBottom: '0.5rem',
              marginBottom: '1.25rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-forest)' }}>
                1. Item Identification
              </h3>
              <span className="font-mono text-muted" style={{ fontSize: '0.75rem' }}>SECTION 01 / 03</span>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Item Name &amp; Model <span className="required">*</span></span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="E.g., Space Gray MacBook Pro 14, Navy Lanyard with Student ID..."
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <span>Category <span className="required">*</span></span>
                </label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Last Seen Location <span className="required">*</span></span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="E.g., Main Library 2nd Floor, Engineering Block C Atrium..."
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <span>Date Lost <span className="required">*</span></span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  max={new Date().toISOString().split('T')[0]}
                  value={formData.event_date}
                  onChange={e => setFormData({ ...formData, event_date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Approximate Time</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="E.g., ~14:30 or between 2pm - 4pm"
                  value={formData.approximate_time}
                  onChange={e => setFormData({ ...formData, approximate_time: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1.5px dashed var(--color-border)',
              paddingBottom: '0.5rem',
              marginBottom: '1.25rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-forest)' }}>
                2. Distinguishing Marks &amp; Verification Cues
              </h3>
              <span className="font-mono text-muted" style={{ fontSize: '0.75rem' }}>SECTION 02 / 03</span>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>General Circumstances Description <span className="required">*</span></span>
              </label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Where were you studying, what were you carrying, what color/material was the casing..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Distinguishing Markers &amp; Features <span className="required">*</span></span>
              </label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="E.g., Specific stickers (Octocat & React), small dent on lower edge, engraved initials..."
                value={formData.distinguishing_features}
                onChange={e => setFormData({ ...formData, distinguishing_features: e.target.value })}
                required
              />
              <span className="form-hint">
                The smart matching engine scores description keywords and unique features (+10pts).
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Optional Return Reward</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="E.g., $50 reward for safe return, coffee voucher & heartfelt thanks"
                value={formData.reward_information}
                onChange={e => setFormData({ ...formData, reward_information: e.target.value })}
              />
            </div>
          </div>

          {/* Section 3: Visual Artwork Box */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1.5px dashed var(--color-border)',
              paddingBottom: '0.5rem',
              marginBottom: '1.25rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-forest)' }}>
                3. Item Illustration &amp; Photo Preview
              </h3>
              <span className="font-mono text-muted" style={{ fontSize: '0.75rem' }}>SECTION 03 / 03</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
              <div>
                <label style={{
                  border: '2px dashed var(--color-forest)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'var(--color-ivory)',
                  transition: 'all 0.15s ease'
                }}>
                  <Upload size={28} style={{ color: 'var(--color-forest)', marginBottom: '0.5rem' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-forest)' }}>
                    Upload Photo of Item (Optional)
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
                    JPG, PNG, or WEBP up to 5MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
                <div style={{ fontSize: '0.775rem', color: 'var(--color-muted)', marginTop: '0.5rem' }}>
                  If no photo is available, Retrivo automatically renders our crisp architectural category illustration.
                </div>
              </div>

              {/* Live Preview Box */}
              <div style={{
                border: '1.5px solid var(--color-forest)',
                borderRadius: '4px',
                overflow: 'hidden',
                backgroundColor: '#FFFEFA',
                boxShadow: '3px 3px 0px var(--color-forest)'
              }}>
                <ItemVisual
                  category={formData.category}
                  itemType="lost"
                  imageUrl={previewUrl}
                  title={formData.title}
                  aspectRatio="16/10"
                />
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '1.5rem',
            borderTop: '2px solid var(--color-border)',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <Link to="/explore" className="btn btn-ghost">
              Cancel &amp; Return
            </Link>

            <button
              type="submit"
              className="btn btn-terracotta btn-lg"
              disabled={submitting}
            >
              <Sparkles size={18} />
              <span>{submitting ? 'Registering...' : 'File Lost Tag & Scan Campus Archive'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
