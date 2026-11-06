import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { itemService } from '../services/itemService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ItemVisual } from '../components/items/ItemVisual';
import {
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Upload,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Building,
  Image as ImageIcon,
  AlertCircle,
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

export const ReportFound = () => {
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
    storage_location: 'Main Library Help Desk',
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
      setError('You must be signed in to submit a found item report.');
      showToast('Please sign in first', 'error');
      return;
    }

    if (!formData.title.trim()) {
      setError('Item title is required.');
      return;
    }

    if (!formData.location.trim()) {
      setError('Found location is required.');
      return;
    }

    if (!formData.description.trim()) {
      setError('Item description is required.');
      return;
    }

    try {
      setSubmitting(true);
      const created = await itemService.createItem(
        {
          ...formData,
          image_file: selectedImage,
          item_type: 'found'
        },
        currentUser
      );

      showToast('Found property tag registered! Searching for lost candidates.', 'success');
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
          <span className="rubber-stamp stamp-found" style={{ fontSize: '0.7rem' }}>
            FOUND INTAKE SLIP
          </span>
          <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
            [CAMPUS CIVIC RECOVERY]
          </span>
        </div>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--color-forest)' }}>
          Log a Found Property Tag
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '1rem', marginTop: '0.35rem' }}>
          Thank you for turning this in. Record the details to automatically notify the student who lost it.
        </p>
      </div>

      {/* Campus Privacy Guard Banner */}
      <div style={{
        backgroundColor: '#FFFEFA',
        border: '1.5px solid var(--color-forest)',
        borderRadius: 'var(--radius-xs)',
        padding: '1.25rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.85rem',
        boxShadow: '3px 3px 0px var(--color-forest)'
      }}>
        <ShieldAlert size={22} style={{ color: 'var(--color-terracotta)', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.875rem', color: 'var(--color-text)', lineHeight: 1.55 }}>
          <strong style={{ color: 'var(--color-forest)' }}>Campus Privacy Standard:</strong> Never publish complete student matriculation numbers, driver's licenses, or private contact details in public descriptions. Keep internal identifying features confidential so claimants must prove genuine ownership.
        </div>
      </div>

      {/* Main Form Slip */}
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
                1. Found Item Overview
              </h3>
              <span className="font-mono text-muted" style={{ fontSize: '0.75rem' }}>SECTION 01 / 03</span>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Item Name / Description <span className="required">*</span></span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="E.g., Apple MacBook Pro in Gray Protective Case, Student ID on Navy Lanyard..."
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
                  <span>Found Location <span className="required">*</span></span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="E.g., Student Union South Dining Entrance, Math 204..."
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <span>Date Found <span className="required">*</span></span>
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
                  <span>Approximate Time Found</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="E.g., ~13:00 or morning 9am"
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
                2. Custody &amp; Checkpoint Station
              </h3>
              <span className="font-mono text-muted" style={{ fontSize: '0.75rem' }}>SECTION 02 / 03</span>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Designated Campus Custody Station</span>
              </label>
              <select
                className="form-control"
                value={formData.storage_location}
                onChange={e => setFormData({ ...formData, storage_location: e.target.value })}
              >
                <option value="Main Library Help Desk">Main Library Help Desk</option>
                <option value="Student Affairs Office">Student Affairs Office</option>
                <option value="Campus Security Office">Campus Security Office</option>
                <option value="Engineering Department Front Office (Room 104)">Engineering Department Front Office (Room 104)</option>
                <option value="Currently held safely by finder (Pickup upon verified claim)">Currently held safely by finder (Campus meeting upon verified claim)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Public Description <span className="required">*</span></span>
              </label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Give a general overview without revealing all confidential identifying marks..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Distinguishing Features (Public)</span>
              </label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="E.g., Dark protective casing, brand name, general color..."
                value={formData.distinguishing_features}
                onChange={e => setFormData({ ...formData, distinguishing_features: e.target.value })}
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
                    Upload Photo of Found Item (Optional)
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
                  If no photo is attached, Retrivo renders the category's bespoke architectural visual.
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
                  itemType="found"
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
              className="btn btn-marigold btn-lg"
              disabled={submitting}
            >
              <Sparkles size={18} />
              <span>{submitting ? 'Registering...' : 'Register Found Tag & Trigger Match Scan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
