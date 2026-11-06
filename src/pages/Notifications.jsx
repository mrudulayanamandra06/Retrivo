import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';
import { useToast } from '../context/ToastContext';
import {
  Bell,
  Sparkles,
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  HeartHandshake,
  Check,
  Inbox
} from 'lucide-react';

export const Notifications = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const data = await notificationService.getUserNotifications(currentUser.id);
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, [currentUser]);

  const handleMarkRead = async (notif) => {
    if (notif.is_read) {
      if (notif.related_item_id) navigate(`/items/${notif.related_item_id}`);
      return;
    }

    try {
      await notificationService.markAsRead(notif.id);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
      if (notif.related_item_id) {
        navigate(`/items/${notif.related_item_id}`);
      }
    } catch (err) {
      console.error('Error marking read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead(currentUser.id);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      showToast('All notifications marked as read', 'info');
    } catch (err) {
      showToast('Failed to mark all as read', 'error');
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'match_found':
        return <Sparkles size={20} style={{ color: 'var(--color-marigold)' }} />;
      case 'claim_received':
        return <FileCheck2 size={20} style={{ color: 'var(--color-forest)' }} />;
      case 'claim_approved':
        return <CheckCircle2 size={20} style={{ color: 'var(--color-success)' }} />;
      case 'claim_rejected':
        return <XCircle size={20} style={{ color: 'var(--color-error)' }} />;
      case 'item_recovered':
        return <HeartHandshake size={20} style={{ color: 'var(--color-success)' }} />;
      default:
        return <Bell size={20} style={{ color: 'var(--color-forest)' }} />;
    }
  };

  if (!currentUser) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Sign In to View Notifications</h2>
        <Link to="/login" className="btn btn-forest" style={{ marginTop: '1rem' }}>Sign In</Link>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '780px' }}>
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--color-forest)' }}>
            Notifications
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            {unreadCount > 0 ? `You have ${unreadCount} unread notification(s)` : 'All caught up!'}
          </p>
        </div>

        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="btn btn-outline btn-sm">
            <Check size={14} />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="card skeleton" style={{ height: '80px' }} />
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => handleMarkRead(notif)}
              className="card"
              style={{
                padding: '1.25rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                cursor: 'pointer',
                backgroundColor: notif.is_read ? 'var(--color-surface)' : 'rgba(233, 161, 91, 0.08)',
                borderLeft: notif.is_read ? '1px solid var(--color-border)' : '4px solid var(--color-marigold)'
              }}
            >
              <div style={{
                backgroundColor: 'var(--color-ivory)',
                padding: '0.65rem',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexShrink: 0
              }}>
                {getNotifIcon(notif.notification_type)}
              </div>

              <div style={{ flex: 1 }}>
                <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
                  <h4 style={{
                    fontSize: '1rem',
                    color: 'var(--color-forest)',
                    fontWeight: notif.is_read ? 600 : 700
                  }}>
                    {notif.title}
                  </h4>
                  <span className="font-mono text-muted" style={{ fontSize: '0.75rem' }}>
                    {new Date(notif.created_at).toLocaleDateString()}
                  </span>
                </div>

                <p style={{
                  fontSize: '0.875rem',
                  color: notif.is_read ? 'var(--color-muted)' : 'var(--color-text)',
                  lineHeight: 1.5
                }}>
                  {notif.message}
                </p>

                {notif.related_item_id && (
                  <span style={{
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-forest)',
                    marginTop: '0.5rem',
                    display: 'inline-block',
                    fontWeight: 600
                  }}>
                    Click to view related report →
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)'
        }}>
          <Inbox size={48} style={{ color: 'var(--color-muted)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-forest)' }}>No Notifications</h3>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            You will receive updates here when matches are detected or claim statuses update.
          </p>
        </div>
      )}
    </div>
  );
};
