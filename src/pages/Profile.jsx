import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  User,
  Mail,
  Phone,
  Building,
  Shield,
  Save,
  CheckCircle,
  FileCheck2,
  Package
} from 'lucide-react';

export const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [department, setDepartment] = useState(currentUser?.department || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar_url || '');
  const [saving, setSaving] = useState(false);

  if (!currentUser) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile({
        department: department.trim(),
        phone: phone.trim(),
        avatar_url: avatarUrl.trim()
      });
      showToast('Profile updated successfully.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '680px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--color-forest)' }}>
          User Profile
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
          Manage your verified campus account details and preferences
        </p>
      </div>

      <div className="card card-padded" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)' }}>
        {/* Profile Avatar Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          paddingBottom: '1.5rem',
          borderBottom: '1.5px dashed var(--color-border)',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '4px',
            backgroundColor: 'var(--color-forest)',
            color: 'var(--color-marigold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '1.75rem',
            fontWeight: 800,
            border: '2px solid var(--color-forest-dark)',
            boxShadow: '3px 3px 0px var(--color-forest-dark)',
            flexShrink: 0
          }}>
            {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--color-forest)' }}>
                {currentUser.full_name}
              </h2>
              <span className="badge badge-active font-mono" style={{ textTransform: 'uppercase' }}>
                {currentUser.role}
              </span>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
              {currentUser.email}
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">
              <span>Full Name</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={currentUser.full_name}
              disabled
              style={{ backgroundColor: 'var(--color-ivory)', cursor: 'not-allowed' }}
            />
            <span className="form-hint">Official campus name is managed via University Registry.</span>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Email Address</span>
            </label>
            <input
              type="email"
              className="form-control"
              value={currentUser.email}
              disabled
              style={{ backgroundColor: 'var(--color-ivory)', cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Department / Faculty</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="E.g., Computer Science & Engineering, Library Services"
              value={department}
              onChange={e => setDepartment(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Contact Phone Number</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="E.g., +91 98765 43210"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <span className="form-hint">Only shared after an ownership claim is officially approved.</span>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Avatar Image URL</span>
            </label>
            <input
              type="url"
              className="form-control"
              placeholder="https://..."
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: '1rem',
            borderTop: '1px solid var(--color-border)'
          }}>
            <button
              type="submit"
              className="btn btn-forest"
              disabled={saving}
            >
              <Save size={16} />
              <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
