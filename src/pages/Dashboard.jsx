import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { itemService } from '../services/itemService';
import { claimService } from '../services/claimService';
import { activityService } from '../services/activityService';
import { QRModal } from '../components/items/QRModal';
import { ItemVisual } from '../components/items/ItemVisual';
import { useToast } from '../context/ToastContext';
import {
  LayoutDashboard,
  FileQuestion,
  Search,
  PlusCircle,
  FileCheck2,
  CheckCircle,
  Clock,
  Sparkles,
  QrCode,
  ArrowRight,
  MapPin,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Activity
} from 'lucide-react';

export const Dashboard = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('lost'); // 'lost' | 'found' | 'claims' | 'activity'
  const [myLostItems, setMyLostItems] = useState([]);
  const [myFoundItems, setMyFoundItems] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [selectedQRItem, setSelectedQRItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const allItems = await itemService.getItems();
      const userLost = allItems.filter(i => i.user_id === currentUser.id && i.item_type === 'lost');
      const userFound = allItems.filter(i => i.user_id === currentUser.id && i.item_type === 'found');
      const userClaims = await claimService.getClaimsForUser(currentUser.id);

      const userActivity = await activityService.getForUser(currentUser.id, 10);

      setMyLostItems(userLost);
      setMyFoundItems(userFound);
      setMyClaims(userClaims);
      setRecentActivities(userActivity);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      showToast('Error refreshing dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Please Sign In</h2>
        <p style={{ color: 'var(--color-muted)', margin: '1rem 0' }}>
          You must be logged in to view your personalized dashboard.
        </p>
        <Link to="/login" className="btn btn-forest">Sign In</Link>
      </div>
    );
  }

  const recoveredTotal = myLostItems.filter(i => i.status === 'recovered').length +
    myFoundItems.filter(i => i.status === 'recovered').length;

  const handleCloseItem = async (itemId) => {
    if (!window.confirm('Mark this listing as closed?')) return;
    try {
      await itemService.closeItem(itemId, currentUser);
      showToast('Item closed.', 'info');
      loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to close item', 'error');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Dashboard Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 style={{ fontSize: '2.3rem', color: 'var(--color-forest)' }}>
              Campus Dashboard
            </h1>
            <span className="badge badge-active font-mono" style={{ textTransform: 'uppercase' }}>
              {currentUser.role}
            </span>
          </div>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Welcome back, <strong>{currentUser.full_name}</strong> ({currentUser.department || 'Campus Member'})
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/report-lost" className="btn btn-terracotta btn-sm">
            <PlusCircle size={15} />
            <span>Report Lost</span>
          </Link>
          <Link to="/report-found" className="btn btn-forest btn-sm">
            <PlusCircle size={15} />
            <span>Report Found</span>
          </Link>
        </div>
      </div>

      {/* Overview Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        {/* Stat 1 */}
        <div className="card card-padded" style={{ backgroundColor: 'var(--color-surface)' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-terracotta)', textTransform: 'uppercase', fontWeight: 600 }}>
            My Lost Items
          </span>
          <div className="font-mono" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-forest)', margin: '0.35rem 0' }}>
            {myLostItems.length}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
            {myLostItems.filter(i => i.status === 'active').length} active search
          </span>
        </div>

        {/* Stat 2 */}
        <div className="card card-padded" style={{ backgroundColor: 'var(--color-surface)' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-forest)', textTransform: 'uppercase', fontWeight: 600 }}>
            My Found Reports
          </span>
          <div className="font-mono" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-forest)', margin: '0.35rem 0' }}>
            {myFoundItems.length}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
            Helping campus members
          </span>
        </div>

        {/* Stat 3 */}
        <div className="card card-padded" style={{ backgroundColor: 'var(--color-surface)' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-marigold)', textTransform: 'uppercase', fontWeight: 600 }}>
            My Active Claims
          </span>
          <div className="font-mono" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-forest)', margin: '0.35rem 0' }}>
            {myClaims.filter(c => c.status !== 'completed' && c.status !== 'rejected').length}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
            Under verification review
          </span>
        </div>

        {/* Stat 4 */}
        <div className="card card-padded" style={{ backgroundColor: 'var(--color-surface)' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-success)', textTransform: 'uppercase', fontWeight: 600 }}>
            Recoveries
          </span>
          <div className="font-mono" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-success)', margin: '0.35rem 0' }}>
            {recoveredTotal}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
            Reunited belongings
          </span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--color-border)',
        marginBottom: '2rem',
        gap: '0.5rem',
        overflowX: 'auto'
      }}>
        <button
          onClick={() => setActiveTab('lost')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'lost' ? '3px solid var(--color-forest)' : '3px solid transparent',
            color: activeTab === 'lost' ? 'var(--color-forest)' : 'var(--color-muted)',
            fontWeight: 600,
            padding: '0.75rem 1.25rem',
            cursor: 'pointer',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap'
          }}
        >
          <span>My Lost Items ({myLostItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('found')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'found' ? '3px solid var(--color-forest)' : '3px solid transparent',
            color: activeTab === 'found' ? 'var(--color-forest)' : 'var(--color-muted)',
            fontWeight: 600,
            padding: '0.75rem 1.25rem',
            cursor: 'pointer',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap'
          }}
        >
          <span>My Found Items ({myFoundItems.length})</span>
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
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap'
          }}
        >
          <span>My Submitted Claims ({myClaims.length})</span>
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
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap'
          }}
        >
          <Activity size={16} />
          <span>Recent Activity</span>
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* 1. MY LOST ITEMS */}
      {activeTab === 'lost' && (
        <div>
          {myLostItems.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {myLostItems.map(item => (
                <div
                  key={item.id}
                  className="card card-padded"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '80px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '1.5px solid var(--color-forest)' }}>
                      <ItemVisual
                        category={item.category}
                        itemType="lost"
                        imageUrl={item.image_url}
                        title={item.title}
                        aspectRatio="1/1"
                      />
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.35rem' }}>
                        <span className="badge badge-lost">Lost</span>
                        <span className={`badge badge-${item.status}`}>{item.status.toUpperCase()}</span>
                      </div>
                      <h3 style={{ fontSize: '1.15rem' }}>
                        <Link to={`/items/${item.id}`} style={{ color: 'var(--color-forest)' }}>
                          {item.title}
                        </Link>
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                        <span><MapPin size={12} /> {item.location}</span>
                        <span><Calendar size={12} /> {item.event_date}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <Link to={`/items/${item.id}`} className="btn btn-outline btn-sm">
                      <span>View Details &amp; Matches</span>
                      <ArrowRight size={14} />
                    </Link>
                    {item.status === 'active' && (
                      <button
                        onClick={() => handleCloseItem(item.id)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--color-error)' }}
                      >
                        Close Listing
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3.5rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
              <FileQuestion size={40} style={{ color: 'var(--color-muted)', margin: '0 auto 1rem' }} />
              <p>You haven't reported any lost items yet.</p>
              <Link to="/report-lost" className="btn btn-terracotta" style={{ marginTop: '1rem' }}>
                Report a Lost Item
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 2. MY FOUND ITEMS */}
      {activeTab === 'found' && (
        <div>
          {myFoundItems.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {myFoundItems.map(item => (
                <div
                  key={item.id}
                  className="card card-padded"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '80px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '1.5px solid var(--color-forest)' }}>
                      <ItemVisual
                        category={item.category}
                        itemType="found"
                        imageUrl={item.image_url}
                        title={item.title}
                        aspectRatio="1/1"
                      />
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.35rem' }}>
                        <span className="badge badge-found">Found</span>
                        <span className={`badge badge-${item.status}`}>{item.status.toUpperCase()}</span>
                      </div>
                      <h3 style={{ fontSize: '1.15rem' }}>
                        <Link to={`/items/${item.id}`} style={{ color: 'var(--color-forest)' }}>
                          {item.title}
                        </Link>
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
                        Found at: {item.location} • Stored: {item.storage_location || 'Handover Station'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setSelectedQRItem(item)}
                      className="btn btn-outline btn-sm"
                    >
                      <QrCode size={14} />
                      <span>Item QR</span>
                    </button>
                    <Link to={`/items/${item.id}`} className="btn btn-forest btn-sm">
                      <span>Review Claims &amp; Matches</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3.5rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
              <CheckCircle size={40} style={{ color: 'var(--color-muted)', margin: '0 auto 1rem' }} />
              <p>You haven't reported any found items yet.</p>
              <Link to="/report-found" className="btn btn-forest" style={{ marginTop: '1rem' }}>
                Report a Found Item
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 3. MY SUBMITTED CLAIMS */}
      {activeTab === 'claims' && (
        <div>
          {myClaims.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {myClaims.map(claim => (
                <div key={claim.id} className="card card-padded">
                  <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                        Claim ID: #{claim.id.slice(-6).toUpperCase()}
                      </span>
                      <h3 style={{ fontSize: '1.2rem', color: 'var(--color-forest)', marginTop: '0.2rem' }}>
                        {claim.item ? (
                          <Link to={`/items/${claim.item.id}`} style={{ color: 'inherit' }}>
                            {claim.item.title}
                          </Link>
                        ) : 'Claimed Item'}
                      </h3>
                    </div>

                    <span className={`badge ${
                      claim.status === 'approved' ? 'badge-approved' :
                      claim.status === 'rejected' ? 'badge-rejected' :
                      claim.status === 'completed' ? 'badge-recovered' : 'badge-pending'
                    }`}>
                      {claim.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text)', marginBottom: '0.75rem' }}>
                    <strong>Your Submitted Proof:</strong> {claim.proof_description}
                  </p>

                  {claim.review_note && (
                    <div style={{
                      backgroundColor: 'var(--color-ivory)',
                      border: '1px solid var(--color-border)',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      marginBottom: '0.75rem'
                    }}>
                      <strong style={{ color: 'var(--color-forest)' }}>Finder Review Note:</strong> {claim.review_note}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                    <span>Submitted on {new Date(claim.created_at).toLocaleDateString()}</span>
                    {claim.item && (
                      <Link to={`/items/${claim.item.id}`} className="btn btn-outline btn-sm">
                        View Item Listing
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3.5rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
              <FileCheck2 size={40} style={{ color: 'var(--color-muted)', margin: '0 auto 1rem' }} />
              <p>You have not submitted any ownership claims yet.</p>
              <Link to="/explore" className="btn btn-outline" style={{ marginTop: '1rem' }}>
                Explore Found Listings
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 4. RECENT ACTIVITY STREAM */}
      {activeTab === 'activity' && (
        <div className="card card-padded">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--color-forest)' }}>
            System Audit &amp; Event Stream
          </h3>
          {recentActivities.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentActivities.map(act => (
                <div
                  key={act.id}
                  style={{
                    padding: '0.75rem 1rem',
                    borderLeft: '3px solid var(--color-forest)',
                    backgroundColor: 'var(--color-ivory)',
                    borderRadius: 'var(--radius-xs)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-forest)' }}>
                      {act.action.replace(/_/g, ' ').toUpperCase()}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                      {act.metadata?.title || act.metadata?.item_title || act.entity_type}
                    </div>
                  </div>
                  <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                    {new Date(act.created_at).toLocaleDateString()} {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--color-muted)' }}>No recent activity records found.</p>
          )}
        </div>
      )}

      {/* QR Code Modal */}
      <QRModal
        isOpen={Boolean(selectedQRItem)}
        onClose={() => setSelectedQRItem(null)}
        item={selectedQRItem}
      />
    </div>
  );
};
