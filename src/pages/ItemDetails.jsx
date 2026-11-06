import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { itemService } from '../services/itemService';
import { claimService } from '../services/claimService';
import { getMatchesForItem } from '../services/matchDataService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ItemVisual } from '../components/items/ItemVisual';
import { QRModal } from '../components/items/QRModal';
import { ClaimModal } from '../components/claims/ClaimModal';
import { ReviewModal } from '../components/claims/ReviewModal';
import { HandoverModal } from '../components/claims/HandoverModal';
import {
  MapPin,
  Calendar,
  Clock,
  QrCode,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  User,
  HeartHandshake,
  CheckCircle2,
  FileCheck2,
  AlertTriangle,
  Lock,
  Edit,
  Trash2,
  XCircle,
  Building,
  Tag
} from 'lucide-react';

export const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [item, setItem] = useState(null);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [qrOpen, setQrOpen] = useState(false);
  const [claimOpen, setClaimOpen] = useState(false);
  const [reviewModalData, setReviewModalData] = useState({ isOpen: false, claim: null });
  const [handoverModalData, setHandoverModalData] = useState({ isOpen: false, claim: null });

  // Inline edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editLoc, setEditLoc] = useState('');

  const loadItemDetails = async () => {
    try {
      setLoading(true);
      const data = await itemService.getItemById(id);
      if (!data) {
        navigate('/explore');
        return;
      }
      setItem(data);
      setEditTitle(data.title);
      setEditDesc(data.description);
      setEditLoc(data.location);

      // Find potential matches using matching engine
      const allItems = await itemService.getItems();
      const matches = await getMatchesForItem(data, allItems);
      setPotentialMatches(matches);

      // Fetch claims on this item
      const itemClaims = await claimService.getClaimsForItem(data.id, currentUser);
      setClaims(itemClaims);
    } catch (err) {
      console.error('Error loading item details:', err);
      showToast('Could not load item details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItemDetails();
  }, [id, currentUser]);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <div className="skeleton" style={{ width: '40%', height: '36px', marginBottom: '1.5rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <div className="skeleton" style={{ height: '380px' }} />
          <div className="skeleton" style={{ height: '380px' }} />
        </div>
      </div>
    );
  }

  if (!item) return null;

  const isOwner = currentUser && item.user_id === currentUser.id;
  const isLost = item.item_type === 'lost';
  const isRecovered = item.status === 'recovered';
  const isClosed = item.status === 'closed';

  const myExistingClaim = claims.find(c => currentUser && c.claimant_id === currentUser.id);

  const handleCloseReport = async () => {
    if (!window.confirm('Are you sure you want to close this listing? It will no longer appear in active searches.')) return;
    try {
      await itemService.closeItem(item.id, currentUser);
      showToast('Report marked as closed.', 'info');
      loadItemDetails();
    } catch (err) {
      showToast(err.message || 'Failed to close report', 'error');
    }
  };

  const handleSaveEdit = async () => {
    try {
      await itemService.updateItem(
        item.id,
        {
          title: editTitle,
          description: editDesc,
          location: editLoc
        },
        currentUser
      );
      showToast('Listing updated successfully.', 'success');
      setIsEditing(false);
      loadItemDetails();
    } catch (err) {
      showToast(err.message || 'Failed to update item', 'error');
    }
  };

  const tagId = `TAG #RET-${item.id.replace('item-', '').padStart(4, '0')}`;

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Breadcrumb Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.85rem',
        fontFamily: 'var(--font-mono)',
        color: 'var(--color-muted)',
        marginBottom: '1.5rem'
      }}>
        <Link to="/explore" style={{ color: 'var(--color-forest)', fontWeight: 600 }}>
          ARCHIVE REGISTRY
        </Link>
        <span>/</span>
        <span style={{ textTransform: 'uppercase' }}>{item.item_type} TAGS</span>
        <span>/</span>
        <span style={{ color: 'var(--color-text)', fontWeight: 700 }}>
          {tagId}
        </span>
      </div>

      {/* Recovered Banner */}
      {isRecovered && (
        <div style={{
          backgroundColor: '#FFFEFA',
          border: '2px solid var(--color-success)',
          boxShadow: '4px 4px 0px var(--color-success)',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              backgroundColor: 'var(--color-success)',
              color: '#FFFFFF',
              padding: '0.5rem',
              borderRadius: '4px',
              display: 'flex'
            }}>
              <HeartHandshake size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-forest)', marginBottom: '0.2rem' }}>
                Item Successfully Recovered &amp; Returned!
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                Official campus handover protocol completed. Property returned to rightful owner.
              </p>
            </div>
          </div>
          <span className="rubber-stamp stamp-recovered">
            CASE RESOLVED
          </span>
        </div>
      )}

      {/* Main Two-Column Physical Evidence Tag Sheet */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '2.5rem',
        alignItems: 'flex-start',
        marginBottom: '3rem'
      }}>
        {/* Left Column: Visual Artwork & QR Generator */}
        <div>
          <div style={{
            backgroundColor: '#FFFEFA',
            border: '2px solid var(--color-forest)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '4px 4px 0px var(--color-forest)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Visual Box with Zero-Broken-Image Artwork */}
            <ItemVisual
              category={item.category}
              itemType={item.item_type}
              imageUrl={item.image_url}
              title={item.title}
              aspectRatio="16/11"
            />

            {/* Stamp Overlay */}
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              zIndex: 3
            }}>
              {isRecovered ? (
                <span className="rubber-stamp stamp-recovered">RECOVERED</span>
              ) : isClosed ? (
                <span className="rubber-stamp stamp-lost">CLOSED</span>
              ) : isLost ? (
                <span className="rubber-stamp stamp-lost">LOST INCIDENT</span>
              ) : (
                <span className="rubber-stamp stamp-found">CAMPUS CUSTODY</span>
              )}
            </div>

            {/* Reward Banner */}
            {item.reward_information && (
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                backgroundColor: 'var(--color-marigold)',
                color: 'var(--color-forest-dark)',
                border: '1px solid var(--color-forest)',
                boxShadow: '2px 2px 0px var(--color-forest)',
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <Award size={15} />
                <span>REWARD OFFERED: {item.reward_information}</span>
              </div>
            )}
          </div>

          {/* Action buttons beneath artwork */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button
              onClick={() => setQrOpen(true)}
              className="btn btn-outline"
              style={{ flex: 1 }}
            >
              <QrCode size={16} />
              <span>Printable Item QR</span>
            </button>

            {isOwner && !isRecovered && !isClosed && (
              <>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn btn-outline"
                >
                  <Edit size={16} />
                  <span>{isEditing ? 'Cancel Edit' : 'Edit'}</span>
                </button>
                <button
                  onClick={handleCloseReport}
                  className="btn btn-ghost"
                  style={{ color: 'var(--color-error)' }}
                >
                  <XCircle size={16} />
                  <span>Close</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Physical Property Tag Information */}
        <div style={{
          backgroundColor: '#FFFEFA',
          border: '2px solid var(--color-forest)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: '5px 5px 0px var(--color-forest)',
          padding: '2rem',
          position: 'relative'
        }}>
          {isEditing ? (
            /* Editing form */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Edit Listing Details</h3>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={editLoc}
                  onChange={e => setEditLoc(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button onClick={() => setIsEditing(false)} className="btn btn-ghost">Cancel</button>
                <button onClick={handleSaveEdit} className="btn btn-forest">Save Changes</button>
              </div>
            </div>
          ) : (
            <div>
              {/* Slip Metadata Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1.5px dashed var(--color-border)',
                paddingBottom: '0.85rem',
                marginBottom: '1rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.775rem'
              }}>
                <span style={{ fontWeight: 700, color: 'var(--color-forest)' }}>
                  {tagId}
                </span>
                <span className="badge badge-active">
                  {item.category}
                </span>
              </div>

              <h1 style={{ fontSize: '2.1rem', color: 'var(--color-forest)', lineHeight: 1.15, marginBottom: '0.85rem' }}>
                {item.title}
              </h1>

              {/* Location & Date */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                fontSize: '0.9rem',
                color: 'var(--color-text)',
                marginBottom: '1.25rem',
                padding: '0.75rem',
                backgroundColor: 'var(--color-ivory)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xs)'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={16} style={{ color: isLost ? 'var(--color-terracotta)' : 'var(--color-forest)' }} />
                  <strong>{item.location}</strong>
                </span>

                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={16} style={{ color: 'var(--color-forest)' }} />
                  {new Date(item.event_date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>

                {item.approximate_time && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={16} style={{ color: 'var(--color-forest)' }} />
                    {item.approximate_time}
                  </span>
                )}
              </div>

              {/* Description Box */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.35rem' }}>
                  [INCIDENT / REPORT DETAILS]
                </div>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--color-text)' }}>
                  {item.description}
                </p>
              </div>

              {/* Distinguishing Features */}
              {item.distinguishing_features && (
                <div style={{
                  backgroundColor: 'var(--color-sage-light)',
                  border: '1.5px solid var(--color-forest)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '0.85rem 1rem',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-forest)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    marginBottom: '0.25rem'
                  }}>
                    <Sparkles size={14} style={{ color: 'var(--color-marigold)' }} />
                    Distinguishing Physical Markers
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text)', margin: 0 }}>
                    {item.distinguishing_features}
                  </p>
                </div>
              )}

              {/* Storage location for found items */}
              {item.storage_location && (
                <div style={{
                  backgroundColor: 'var(--color-ivory)',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  marginBottom: '1.25rem'
                }}>
                  <Building size={18} style={{ color: 'var(--color-forest)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
                      OFFICIAL CUSTODY CHECKPOINT
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-forest)' }}>
                      {item.storage_location}
                    </div>
                  </div>
                </div>
              )}

              {/* Reporter Info with Privacy Controls */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: '#FFFFFF',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-forest)' }}>
                    {item.user?.full_name || 'Campus Student'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                    {item.user?.department || 'Verified Campus Affiliate'}
                  </div>
                </div>
                <span className="rubber-stamp stamp-found" style={{ fontSize: '0.65rem' }}>
                  ID VERIFIED
                </span>
              </div>

              {/* PRIMARY ACTION BUTTON */}
              <div>
                {!isLost && item.status !== 'recovered' && item.status !== 'closed' && (
                  <div>
                    {!isOwner ? (
                      myExistingClaim ? (
                        <div style={{
                          backgroundColor: 'var(--color-marigold-light)',
                          border: '1.5px solid var(--color-marigold)',
                          borderRadius: 'var(--radius-xs)',
                          padding: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--color-forest)' }}>
                              Claim Status: {myExistingClaim.status.toUpperCase()}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text)' }}>
                              Submitted on {new Date(myExistingClaim.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <Link to="/my-claims" className="btn btn-forest btn-sm">
                            Track Claim
                          </Link>
                        </div>
                      ) : (
                        <button
                          onClick={() => setClaimOpen(true)}
                          className="btn btn-marigold btn-lg"
                          style={{ width: '100%', fontSize: '1.1rem' }}
                        >
                          <FileCheck2 size={20} />
                          <span>This is My Belonging — File Ownership Claim</span>
                        </button>
                      )
                    ) : (
                      <div style={{
                        backgroundColor: 'var(--color-sage-light)',
                        border: '1.5px solid var(--color-forest)',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.85rem',
                        color: 'var(--color-forest)',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        [FINDER CONTROL]: You filed this found tag. Review submitted evidence below.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: SMART MATCHING PREDICTIONS (Tactile Cards) */}
      <div style={{
        backgroundColor: '#FFFEFA',
        border: '2px solid var(--color-forest)',
        borderRadius: 'var(--radius-sm)',
        padding: '2rem',
        boxShadow: '4px 4px 0px var(--color-forest)',
        marginBottom: '3rem'
      }}>
        <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} style={{ color: 'var(--color-marigold)' }} />
              <h2 style={{ fontSize: '1.6rem', color: 'var(--color-forest)' }}>
                Smart Match Engine Predictions
              </h2>
            </div>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Algorithmic scoring model comparing category (25), name (30), location (20), date (15), and markers (10)
            </p>
          </div>
          <span className="font-mono text-muted" style={{ fontSize: '0.8rem' }}>
            MAX SCORE: 100 PTS
          </span>
        </div>

        {potentialMatches.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {potentialMatches.map(match => (
              <div
                key={match.id}
                style={{
                  backgroundColor: 'var(--color-ivory)',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      backgroundColor: 'var(--color-forest)',
                      color: 'var(--color-marigold)',
                      padding: '0.5rem 0.85rem',
                      borderRadius: 'var(--radius-xs)',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      fontSize: '1.3rem',
                      border: '1.5px solid var(--color-forest-dark)',
                      boxShadow: '2px 2px 0px var(--color-forest-dark)'
                    }}>
                      {match.score}%
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h4 style={{ fontSize: '1.15rem', color: 'var(--color-forest)' }}>
                          {match.counterpart.title}
                        </h4>
                        <span className={`badge ${match.badgeVariant}`}>
                          {match.classification}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                        {match.counterpart.item_type === 'lost' ? 'Reported Lost at' : 'Reported Found at'} {match.counterpart.location} • {match.counterpart.event_date}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/items/${match.counterpart.id}`}
                    className="btn btn-outline btn-sm"
                  >
                    <span>Inspect Counterpart Slip</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Score breakdown metrics */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '0.5rem',
                  backgroundColor: '#FFFFFF',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.775rem',
                  fontFamily: 'var(--font-mono)'
                }}>
                  <div>Category: <strong>{match.matched_attributes.category}/25</strong></div>
                  <div>Name Tokens: <strong>{match.matched_attributes.name}/30</strong></div>
                  <div>Campus Zone: <strong>{match.matched_attributes.location}/20</strong></div>
                  <div>Date Proximity: <strong>{match.matched_attributes.date}/15</strong></div>
                  <div>Markers: <strong>{match.matched_attributes.description}/10</strong></div>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--color-forest)', lineHeight: 1.5 }}>
                  {match.explanation}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '2.5rem 1rem',
            backgroundColor: 'var(--color-ivory)',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-xs)'
          }}>
            <Sparkles size={32} style={{ color: 'var(--color-muted)', margin: '0 auto 0.5rem' }} />
            <h4 style={{ color: 'var(--color-forest)', fontSize: '1.1rem' }}>No Matches Detected Yet</h4>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', maxWidth: '440px', margin: '0.25rem auto' }}>
              The matching engine runs continuously. When an aligned counterpart property tag is filed, you will receive an in-app notification.
            </p>
          </div>
        )}
      </div>

      {/* SECTION 3: CLAIMS OVERSIGHT (Finder or Admin) */}
      {(isOwner || isAdmin) && !isLost && (
        <div style={{
          backgroundColor: '#FFFEFA',
          border: '2px solid var(--color-forest)',
          borderRadius: 'var(--radius-sm)',
          padding: '2rem',
          boxShadow: '4px 4px 0px var(--color-forest)'
        }}>
          <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--color-forest)' }}>
                Evidence Claims Received ({claims.length})
              </h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>
                Examine submitted proof and confidential details to confirm genuine ownership.
              </p>
            </div>
          </div>

          {claims.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {claims.map(claim => (
                <div
                  key={claim.id}
                  style={{
                    backgroundColor: 'var(--color-ivory)',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-forest)' }}>
                        Claimant: {claim.claimant?.full_name || 'Campus Student'}
                      </span>
                      <span className="font-mono text-muted" style={{ fontSize: '0.75rem' }}>
                        Filed: {new Date(claim.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <span className={`badge ${
                      claim.status === 'approved' ? 'badge-approved' :
                      claim.status === 'rejected' ? 'badge-rejected' :
                      claim.status === 'completed' ? 'badge-recovered' : 'badge-pending'
                    }`}>
                      {claim.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text)' }}>
                    <strong>Public Proof Description:</strong> {claim.proof_description}
                  </div>

                  {claim.private_verification_details && (
                    <div style={{
                      backgroundColor: 'rgba(233, 161, 91, 0.15)',
                      border: '1.5px dashed var(--color-marigold)',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.825rem',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      <strong style={{ color: 'var(--color-forest)' }}>Confidential Evidence:</strong> {claim.private_verification_details}
                    </div>
                  )}

                  {claim.review_note && (
                    <div style={{ fontSize: '0.825rem', color: 'var(--color-muted)' }}>
                      <em>Reviewer Note: {claim.review_note}</em>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    {claim.status !== 'completed' && claim.status !== 'rejected' && (
                      <button
                        onClick={() => setReviewModalData({ isOpen: true, claim })}
                        className="btn btn-outline btn-sm"
                      >
                        <ShieldCheck size={14} />
                        <span>Review Evidence</span>
                      </button>
                    )}

                    {claim.status === 'approved' && (
                      <button
                        onClick={() => setHandoverModalData({ isOpen: true, claim })}
                        className="btn btn-forest btn-sm"
                      >
                        <HeartHandshake size={14} />
                        <span>Complete Handover &amp; Recover</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
              No claims submitted for this found item yet.
            </p>
          )}
        </div>
      )}

      {/* MODALS */}
      <QRModal
        isOpen={qrOpen}
        onClose={() => setQrOpen(false)}
        item={item}
      />

      <ClaimModal
        isOpen={claimOpen}
        onClose={() => setClaimOpen(false)}
        item={item}
        onClaimSuccess={() => loadItemDetails()}
      />

      <ReviewModal
        isOpen={reviewModalData.isOpen}
        onClose={() => setReviewModalData({ isOpen: false, claim: null })}
        claim={reviewModalData.claim}
        item={item}
        onReviewSuccess={() => loadItemDetails()}
      />

      <HandoverModal
        isOpen={handoverModalData.isOpen}
        onClose={() => setHandoverModalData({ isOpen: false, claim: null })}
        claim={handoverModalData.claim}
        item={item}
        onHandoverSuccess={() => loadItemDetails()}
      />
    </div>
  );
};
