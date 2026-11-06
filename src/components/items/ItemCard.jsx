import React from 'react';
import { Link } from 'react-router-dom';
import { ItemVisual } from './ItemVisual';
import { MapPin, Calendar, ArrowUpRight, Award, QrCode } from 'lucide-react';

export const ItemCard = ({ item, onOpenQR }) => {
  if (!item) return null;

  const isLost = item.item_type === 'lost';
  const isRecovered = item.status === 'recovered';
  const isClosed = item.status === 'closed';

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const tagId = `TAG #RET-${item.id.replace('item-', '').padStart(4, '0')}`;

  return (
    <div
      className="property-tag"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#FFFEFA'
      }}
    >
      {/* Top Evidence Tag Header Bar */}
      <div style={{
        padding: '0.65rem 1rem',
        borderBottom: '1.5px solid var(--color-border)',
        backgroundColor: 'var(--color-ivory)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.725rem',
        fontFamily: 'var(--font-mono)'
      }}>
        <span style={{ fontWeight: 700, color: 'var(--color-forest)', letterSpacing: '0.05em' }}>
          {tagId}
        </span>
        <span style={{
          color: isLost ? 'var(--color-terracotta)' : 'var(--color-forest)',
          fontWeight: 700,
          textTransform: 'uppercase'
        }}>
          ● {isLost ? 'MISSING' : 'FOUND'}
        </span>
      </div>

      {/* Visual Artwork Box with Built-In Guaranteed Rendering (Zero Broken Images) */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <ItemVisual
          category={item.category}
          itemType={item.item_type}
          imageUrl={item.image_url}
          title={item.title}
          aspectRatio="16/10"
        />

        {/* Physical Rubber Stamp */}
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          zIndex: 2
        }}>
          {isRecovered ? (
            <span className="rubber-stamp stamp-recovered">RECOVERED</span>
          ) : isClosed ? (
            <span className="rubber-stamp stamp-lost">CLOSED</span>
          ) : isLost ? (
            <span className="rubber-stamp stamp-lost">LOST REPORT</span>
          ) : (
            <span className="rubber-stamp stamp-found">CAMPUS FOUND</span>
          )}
        </div>

        {/* Reward Tape Marker */}
        {item.reward_information && (
          <div style={{
            position: 'absolute',
            bottom: '0.65rem',
            left: '0.65rem',
            backgroundColor: 'var(--color-marigold)',
            color: 'var(--color-forest-dark)',
            border: '1px solid var(--color-forest)',
            padding: '0.2rem 0.55rem',
            fontSize: '0.725rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            boxShadow: '1.5px 1.5px 0px var(--color-forest)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <Award size={13} />
            <span>REWARD OFFERED</span>
          </div>
        )}
      </div>

      {/* Ticket Perforated Divider */}
      <div className="ticket-perforation">
        <div className="perforation-line" />
      </div>

      {/* Ticket Body Content */}
      <div style={{
        padding: '0 1.25rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        gap: '0.65rem'
      }}>
        {/* Category & Date */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--color-muted)'
        }}>
          <span style={{
            backgroundColor: 'var(--color-sage-light)',
            color: 'var(--color-forest)',
            padding: '0.15rem 0.45rem',
            borderRadius: '2px',
            border: '1px solid var(--color-border)',
            fontWeight: 600,
            textTransform: 'uppercase'
          }}>
            {item.category}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={13} />
            {formatDate(item.event_date)}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1.15rem',
          lineHeight: '1.25',
          fontWeight: 700,
          color: 'var(--color-forest)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minHeight: '2.5rem'
        }}>
          <Link to={`/items/${item.id}`} style={{ color: 'inherit' }}>
            {item.title}
          </Link>
        </h3>

        {/* Location with Pin */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.85rem',
          color: 'var(--color-text)',
          fontWeight: 500
        }}>
          <MapPin size={15} style={{ color: isLost ? 'var(--color-terracotta)' : 'var(--color-forest)', flexShrink: 0 }} />
          <span style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {item.location}
          </span>
        </div>

        {/* Description Excerpt */}
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--color-muted)',
          lineHeight: 1.45,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {item.description}
        </p>

        {/* Footer: Barcode & Actions */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--color-border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Faux mini barcode pattern */}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--color-muted)',
            letterSpacing: '0.08em'
          }}>
            <span style={{ letterSpacing: '2px', fontWeight: 'bold' }}>||| | |||| | ||</span>
          </div>

          <Link
            to={`/items/${item.id}`}
            className="btn btn-outline btn-sm"
            style={{ fontWeight: 700, fontSize: '0.8rem' }}
          >
            <span>Examine Tag</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
