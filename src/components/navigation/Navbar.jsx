import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import { RetrivoLogo } from '../common/RetrivoLogo';
import {
  Bell,
  Search,
  PlusCircle,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  FileCheck2,
  LayoutDashboard
} from 'lucide-react';

export const Navbar = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchUnread = async () => {
      if (currentUser?.id) {
        try {
          const notifs = await notificationService.getUserNotifications(currentUser.id);
          if (isMounted) {
            setUnreadCount(notifs.filter(n => !n.is_read).length);
          }
        } catch (err) {
          console.error('Error fetching notifications:', err);
        }
      } else {
        setUnreadCount(0);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [currentUser]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) => ({
    padding: '0.5rem 0.85rem',
    fontSize: '0.925rem',
    fontWeight: 500,
    color: isActive ? 'var(--color-forest)' : 'var(--color-muted)',
    borderBottom: isActive ? '2px solid var(--color-forest)' : '2px solid transparent',
    transition: 'all var(--transition-fast)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem'
  });

  return (
    <header style={{
      backgroundColor: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 900
    }}>
      <div className="container" style={{
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <RetrivoLogo />

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', gap: '0.25rem', alignItems: 'center' }} className="desktop-nav">
          <NavLink to="/" style={navLinkStyle}>Home</NavLink>
          <NavLink to="/explore" style={navLinkStyle}>
            <Search size={16} /> Explore
          </NavLink>
          <NavLink to="/report-lost" style={navLinkStyle}>
            <span style={{ color: 'var(--color-terracotta)' }}>Report Lost</span>
          </NavLink>
          <NavLink to="/report-found" style={navLinkStyle}>
            <span style={{ color: 'var(--color-forest)' }}>Report Found</span>
          </NavLink>
          {currentUser && (
            <>
              <NavLink to="/dashboard" style={navLinkStyle}>
                <LayoutDashboard size={16} /> Dashboard
              </NavLink>
              <NavLink to="/my-claims" style={navLinkStyle}>
                <FileCheck2 size={16} /> Claims
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" style={navLinkStyle}>
                  <Shield size={16} style={{ color: 'var(--color-marigold)' }} /> Admin
                </NavLink>
              )}
            </>
          )}
        </nav>

        {/* Right Action / Auth Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {currentUser ? (
            <>
              {/* Notifications Icon with Badge */}
              <Link
                to="/notifications"
                style={{
                  position: 'relative',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-forest)',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: unreadCount > 0 ? 'var(--color-marigold-light)' : 'transparent'
                }}
                aria-label={`Notifications (${unreadCount} unread)`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    backgroundColor: 'var(--color-terracotta)',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '0.6875rem',
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Profile Link */}
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--color-ivory)',
                  border: '1.5px solid var(--color-forest)',
                  color: 'var(--color-forest)',
                  boxShadow: '1.5px 1.5px 0px var(--color-forest)'
                }}
                className="user-profile-pill"
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '3px',
                  backgroundColor: 'var(--color-forest)',
                  color: 'var(--color-marigold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.725rem',
                  fontWeight: 800
                }}>
                  {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                  {currentUser.full_name?.split(' ')[0]}
                </span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="btn btn-ghost btn-sm"
                title="Sign Out"
                style={{ color: 'var(--color-muted)' }}
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-forest btn-sm">Join</Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-forest)',
              padding: '0.5rem'
            }}
            className="mobile-menu-btn"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          boxShadow: 'var(--shadow-md)'
        }} className="mobile-drawer">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/explore" onClick={() => setMobileMenuOpen(false)}>Explore Items</Link>
          <Link to="/report-lost" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--color-terracotta)', fontWeight: 600 }}>Report Lost</Link>
          <Link to="/report-found" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--color-forest)', fontWeight: 600 }}>Report Found</Link>
          {currentUser ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>My Dashboard</Link>
              <Link to="/my-claims" onClick={() => setMobileMenuOpen(false)}>My Claims</Link>
              <Link to="/notifications" onClick={() => setMobileMenuOpen(false)}>Notifications ({unreadCount})</Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>My Profile</Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--color-marigold)' }}>
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="btn btn-outline btn-sm"
                style={{ marginTop: '0.5rem' }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline btn-sm" style={{ flex: 1 }}>Sign In</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-forest btn-sm" style={{ flex: 1 }}>Register</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 860px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .mobile-drawer {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
