import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { itemService } from '../services/itemService';
import { authService } from '../services/authService';
import { claimService } from '../services/claimService';
import { activityService } from '../services/activityService';
import { useToast } from '../context/ToastContext';
import { ReviewModal } from '../components/claims/ReviewModal';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Layers,
  FileCheck2,
  HeartHandshake,
  Trash2,
  XCircle,
  Eye,
  Activity,
  AlertCircle
} from 'lucide-react';

export const AdminDashboard = () => {
  const { currentUser, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('items'); // 'items' | 'claims' | 'users' | 'activity'
  const [stats, setStats] = useState({ totalItems: 0, recoveredCount: 0, pendingClaims: 0, totalUsers: 0 });
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reviewModalData, setReviewModalData] = useState({ isOpen: false, claim: null, item: null });

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [allItems, allUsers, statData, allClaims, allActivity] = await Promise.all([
        itemService.getItems(),
        authService.getAllUsers(),
        itemService.getStatistics(),
        claimService.getAllClaims(),
        activityService.getAll(100)
      ]);

      setItems(allItems);
      setUsers(allUsers);
      setClaims(allClaims);
      setActivity(allActivity);
      setStats({
        ...statData,
        totalUsers: allUsers.length
      });
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  // Security guard check
  if (!currentUser || !isAdmin) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center', maxWidth: '540px' }}>
        <div style={{
          backgroundColor: 'rgba(185, 77, 77, 0.1)',
          border: '1px solid var(--color-error)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <ShieldAlert size={48} style={{ color: 'var(--color-error)' }} />
          <h2 style={{ color: 'var(--color-error)', fontSize: '1.75rem' }}>Restricted Access</h2>
          <p style={{ color: 'var(--color-text)', lineHeight: 1.5 }}>
            This portal is restricted to authorized Campus Safety Administrators and Security Officers.
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
            Sign in with an authorized campus staff account to access moderation and claim review tools.
          </p>
          <Link to="/" className="btn btn-outline" style={{ marginTop: '0.5rem' }}>
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const handleModerationClose = async (itemId) => {
    if (!window.confirm('As an administrator, close/moderate this listing?')) return;
    try {
      await itemService.closeItem(itemId, currentUser);
      showToast('Item closed by administrative action.', 'info');
      loadAdminData();
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const handleModerationDelete = async (itemId) => {
    if (!window.confirm('Permanently remove this inappropriate listing from Retrivo?')) return;
    try {
      await itemService.deleteItem(itemId, currentUser);
      showToast('Item permanently removed.', 'warning');
      loadAdminData();
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={26} style={{ color: 'var(--color-marigold)' }} />
            <h1 style={{ fontSize: '2.2rem', color: 'var(--color-forest)' }}>
              Campus Administration &amp; Moderation
            </h1>
          </div>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.925rem', marginTop: '0.2rem' }}>
            Platform oversight, claims supervision, item moderation, and campus audit logging
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--color-forest-surface)',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-forest)',
          fontSize: '0.8125rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--color-forest)'
        }}>
          Logged in as: <strong>{currentUser.full_name}</strong> (Administrator)
        </div>
      </div>

      {/* Admin Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        <div className="card card-padded">
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
            Campus Users
          </span>
          <div className="font-mono" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-forest)', margin: '0.25rem 0' }}>
            {stats.totalUsers}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>Registered accounts</span>
        </div>

        <div className="card card-padded">
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
            Reported Items
          </span>
          <div className="font-mono" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-forest)', margin: '0.25rem 0' }}>
            {stats.totalItems}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>All campus submissions</span>
        </div>

        <div className="card card-padded">
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--color-marigold)' }}>
            Pending Claims
          </span>
          <div className="font-mono" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-marigold)', margin: '0.25rem 0' }}>
            {stats.pendingClaims}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>Awaiting review</span>
        </div>

        <div className="card card-padded">
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--color-success)' }}>
            Recovered Items
          </span>
          <div className="font-mono" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-success)', margin: '0.25rem 0' }}>
            {stats.recoveredCount}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>Successfully resolved</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--color-border)',
        marginBottom: '2rem',
        gap: '0.5rem',
        overflowX: 'auto'
      }}>
        <button
          onClick={() => setActiveTab('items')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'items' ? '3px solid var(--color-forest)' : '3px solid transparent',
            color: activeTab === 'items' ? 'var(--color-forest)' : 'var(--color-muted)',
            fontWeight: 600,
            padding: '0.75rem 1.25rem',
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          <span>Item Moderation ({items.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'claims' ? '3px solid var(--color-forest)' : '3px solid transparent',
            color: activeTab === 'claims' ? 'var(--color-forest)' : 'var(--color-muted)',
            fontWeight: 600,
            padding: '0.75rem 1.25rem',
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          <span>Claims Oversight ({claims.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'users' ? '3px solid var(--color-forest)' : '3px solid transparent',
            color: activeTab === 'users' ? 'var(--color-forest)' : 'var(--color-muted)',
            fontWeight: 600,
            padding: '0.75rem 1.25rem',
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          <span>User Directory ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'activity' ? '3px solid var(--color-forest)' : '3px solid transparent',
            color: activeTab === 'activity' ? 'var(--color-forest)' : 'var(--color-muted)',
            fontWeight: 600,
            padding: '0.75rem 1.25rem',
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          <span>Audit Log Stream ({activity.length})</span>
        </button>
      </div>

      {/* TAB 1: ITEM MODERATION */}
      {activeTab === 'items' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-ivory)', borderBottom: '1px solid var(--color-border)', fontFamily: 'var(--font-mono)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Title &amp; Category</th>
                <th style={{ padding: '0.85rem 1rem' }}>Type</th>
                <th style={{ padding: '0.85rem 1rem' }}>Location</th>
                <th style={{ padding: '0.85rem 1rem' }}>Date</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-forest)' }}>
                      <Link to={`/items/${item.id}`} style={{ color: 'inherit' }}>
                        {item.title}
                      </Link>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{item.category}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className={`badge ${item.item_type === 'lost' ? 'badge-lost' : 'badge-found'}`}>
                      {item.item_type}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--color-muted)' }}>{item.location}</td>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{item.event_date}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className={`badge badge-${item.status}`}>{item.status}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <Link to={`/items/${item.id}`} className="btn btn-ghost btn-sm" title="Inspect">
                        <Eye size={15} />
                      </Link>
                      {item.status !== 'closed' && (
                        <button
                          onClick={() => handleModerationClose(item.id)}
                          className="btn btn-ghost btn-sm"
                          title="Close/Moderate"
                          style={{ color: 'var(--color-warning)' }}
                        >
                          <XCircle size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => handleModerationDelete(item.id)}
                        className="btn btn-ghost btn-sm"
                        title="Delete permanently"
                        style={{ color: 'var(--color-error)' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: CLAIMS OVERSIGHT */}
      {activeTab === 'claims' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-ivory)', borderBottom: '1px solid var(--color-border)', fontFamily: 'var(--font-mono)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Target Item</th>
                <th style={{ padding: '0.85rem 1rem' }}>Claimant</th>
                <th style={{ padding: '0.85rem 1rem' }}>Private Proof Details</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Admin Review</th>
              </tr>
            </thead>
            <tbody>
              {claims.map(claim => (
                <tr key={claim.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 600 }}>{claim.item?.title || 'Found Item'}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Location: {claim.item?.location}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div>{claim.claimant?.full_name}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{claim.claimant?.email}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', maxWidth: '280px' }}>
                    <div style={{
                      backgroundColor: 'rgba(233, 161, 91, 0.12)',
                      padding: '0.35rem 0.65rem',
                      borderRadius: 'var(--radius-xs)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {claim.private_verification_details}
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className={`badge ${
                      claim.status === 'approved' ? 'badge-approved' :
                      claim.status === 'rejected' ? 'badge-rejected' :
                      claim.status === 'completed' ? 'badge-recovered' : 'badge-pending'
                    }`}>
                      {claim.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => setReviewModalData({ isOpen: true, claim, item: claim.item })}
                      className="btn btn-outline btn-sm"
                    >
                      Admin Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: USER DIRECTORY */}
      {activeTab === 'users' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-ivory)', borderBottom: '1px solid var(--color-border)', fontFamily: 'var(--font-mono)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>User Profile</th>
                <th style={{ padding: '0.85rem 1rem' }}>Email Address</th>
                <th style={{ padding: '0.85rem 1rem' }}>Department</th>
                <th style={{ padding: '0.85rem 1rem' }}>Role</th>
                <th style={{ padding: '0.85rem 1rem' }}>Registered</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '3px',
                      backgroundColor: 'var(--color-forest)',
                      color: 'var(--color-marigold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      flexShrink: 0
                    }}>
                      {u.full_name ? u.full_name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--color-forest)' }}>{u.full_name}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--color-muted)' }}>{u.email}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>{u.department || 'General Community'}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className={`badge ${u.role === 'admin' ? 'badge-recovered' : 'badge-active'}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: AUDIT LOG STREAM */}
      {activeTab === 'activity' && (
        <div className="card card-padded">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activity.map(act => (
              <div
                key={act.id}
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--color-ivory)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-active font-mono" style={{ fontSize: '0.7rem' }}>
                      {act.action}
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--color-forest)', fontSize: '0.9rem' }}>
                      Entity: {act.entity_type} ({act.entity_id})
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '0.2rem' }}>
                    Actor: {act.actor_id} • Meta: {JSON.stringify(act.metadata || {})}
                  </div>
                </div>

                <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                  {new Date(act.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Review Modal */}
      <ReviewModal
        isOpen={reviewModalData.isOpen}
        onClose={() => setReviewModalData({ isOpen: false, claim: null, item: null })}
        claim={reviewModalData.claim}
        item={reviewModalData.item}
        onReviewSuccess={() => loadAdminData()}
      />
    </div>
  );
};
