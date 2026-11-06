import React, { useState } from 'react';
import {
  Laptop,
  CreditCard,
  Headphones,
  BookOpen,
  Briefcase,
  Key,
  Watch,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const ItemVisual = ({
  category = 'Other',
  itemType = 'lost',
  imageUrl = '',
  title = '',
  aspectRatio = '16/10',
  className = '',
  style = {}
}) => {
  const [imgError, setImgError] = useState(false);

  // If valid image provided and hasn't errored
  if (imageUrl && !imgError && imageUrl.startsWith('data:image')) {
    return (
      <div style={{ width: '100%', aspectRatio, overflow: 'hidden', position: 'relative', ...style }}>
        <img
          src={imageUrl}
          alt={title}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    );
  }

  // Bespoke editorial vector artwork per category
  const renderCategoryArtwork = () => {
    const isLost = itemType === 'lost';
    const bgTone = isLost ? '#F4EAE6' : '#E8EFE6';
    const accentTone = isLost ? 'var(--color-terracotta)' : 'var(--color-forest)';

    switch (category) {
      case 'Electronics':
        return (
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: bgTone,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Architectural Grid Background */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(rgba(32, 59, 54, 0.12) 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }} />

            {/* Laptop Vector Artwork */}
            <svg width="180" height="120" viewBox="0 0 180 120" fill="none" style={{ position: 'relative', zIndex: 1 }}>
              {/* Screen Shell */}
              <rect x="25" y="15" width="130" height="82" rx="7" fill="#1C2B27" stroke="#3D524C" strokeWidth="2" />
              {/* Screen Display */}
              <rect x="31" y="21" width="118" height="70" rx="3" fill="#253833" />
              {/* Screen Content Graphics */}
              <path d="M45 40H85M45 50H70M45 60H100" stroke="rgba(233, 161, 91, 0.6)" strokeWidth="3" strokeLinecap="round" />
              {/* Sticker on screen lid / corner */}
              <rect x="110" y="35" width="26" height="26" rx="4" fill="#E9A15B" transform="rotate(8 110 35)" />
              <circle cx="123" cy="48" r="6" fill="#203B36" />
              {/* Base & Keyboard Chassis */}
              <path d="M12 97C12 97 18 102 26 102H154C162 102 168 97 168 97H12Z" fill="#D5DDD4" stroke="#A7B5A4" strokeWidth="2" />
              {/* Trackpad Notch */}
              <rect x="76" y="98" width="28" height="3" rx="1.5" fill="#889885" />
            </svg>

            {/* Archival Tag watermark */}
            <div style={{
              position: 'absolute',
              bottom: '8px',
              right: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--color-muted)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>
              [PROPERTY CLASS: ELEC]
            </div>
          </div>
        );

      case 'ID Cards':
        return (
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: bgTone,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'repeating-linear-gradient(45deg, rgba(32, 59, 54, 0.04) 0px, rgba(32, 59, 54, 0.04) 2px, transparent 2px, transparent 12px)'
            }} />

            {/* Student ID Card Artwork */}
            <svg width="190" height="130" viewBox="0 0 190 130" fill="none" style={{ position: 'relative', zIndex: 1 }}>
              {/* Lanyard Strap */}
              <path d="M95 0V26" stroke="#203B36" strokeWidth="8" strokeDasharray="3 3" />
              <rect x="87" y="24" width="16" height="8" rx="2" fill="#C2AB77" />

              {/* ID Badge Card */}
              <rect x="35" y="30" width="120" height="84" rx="6" fill="#FFFEFA" stroke="#D1CAC0" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
              {/* Badge Header Header Bar */}
              <path d="M36 31H154C154 31 154 46 154 46H36V31Z" fill="#203B36" />
              <text x="44" y="42" fill="#E9A15B" fontSize="7" fontFamily="var(--font-mono)" fontWeight="bold" letterSpacing="0.1em">CAMPUS CARD</text>

              {/* Student Photo Placeholder */}
              <rect x="44" y="52" width="28" height="34" rx="3" fill="#EAE5DB" stroke="#D5CEC2" />
              <circle cx="58" cy="64" r="7" fill="#B4ADA0" />
              <path d="M48 83C48 76 53 74 58 74C63 74 68 76 68 83" fill="#B4ADA0" />

              {/* Student Information Lines */}
              <rect x="80" y="55" width="60" height="5" rx="2" fill="#203B36" opacity="0.8" />
              <rect x="80" y="65" width="45" height="4" rx="2" fill="#889188" />
              <rect x="80" y="73" width="52" height="4" rx="2" fill="#889188" />

              {/* Barcode Strip */}
              <path d="M80 84H82M84 84H85M87 84H90M92 84H93M95 84H98M100 84H103M105 84H106M108 84H112M114 84H117M119 84H122M124 84H128M130 84H132M134 84H138" stroke="#252B28" strokeWidth="6" strokeLinecap="butt" />
            </svg>

            <div style={{
              position: 'absolute',
              bottom: '8px',
              right: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--color-muted)'
            }}>
              [RFID / SECURE BADGE]
            </div>
          </div>
        );

      case 'Accessories':
        return (
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: bgTone,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {/* Hydro Flask / Accessories Artwork */}
            <svg width="150" height="120" viewBox="0 0 150 120" fill="none">
              {/* Bottle Cap with Loop Handle */}
              <path d="M63 20H87V28H63V20Z" fill="#152723" />
              <path d="M68 12C68 8 82 8 82 12V20H68V12Z" stroke="#152723" strokeWidth="3" fill="none" />
              {/* Steel Neck Ring */}
              <rect x="61" y="28" width="28" height="5" fill="#D9DFD8" />
              {/* Bottle Cylinder */}
              <rect x="54" y="33" width="42" height="74" rx="10" fill="#435C52" stroke="#2F423A" strokeWidth="2" />
              {/* Sticker on Flask */}
              <circle cx="75" cy="62" r="12" fill="#E9A15B" />
              <path d="M68 66L75 56L82 66H68Z" fill="#203B36" />
              {/* Dent Highlight */}
              <path d="M57 90C61 93 63 97 66 98" stroke="#25352E" strokeWidth="2" strokeLinecap="round" />
            </svg>

            <div style={{
              position: 'absolute',
              bottom: '8px',
              right: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--color-muted)'
            }}>
              [ACC: INSULATED/PERSONAL]
            </div>
          </div>
        );

      case 'Keys':
        return (
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: bgTone,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <svg width="160" height="110" viewBox="0 0 160 110" fill="none">
              {/* Key Ring */}
              <circle cx="65" cy="55" r="24" stroke="#879589" strokeWidth="4" fill="none" />
              {/* Brass Campus Key */}
              <g transform="rotate(35 65 55)">
                <circle cx="65" cy="55" r="14" fill="#E9A15B" stroke="#B87834" strokeWidth="2" />
                <circle cx="65" cy="55" r="5" fill={bgTone} />
                <rect x="79" y="52" width="45" height="7" fill="#E9A15B" stroke="#B87834" strokeWidth="1.5" />
                <path d="M105 59V67M115 59V69M121 59V65" stroke="#B87834" strokeWidth="3" strokeLinecap="round" />
              </g>
              {/* Electronic Key Fob */}
              <rect x="75" y="60" width="36" height="22" rx="6" fill="#203B36" />
              <circle cx="85" cy="71" r="3" fill="#E9A15B" />
            </svg>
            <div style={{
              position: 'absolute',
              bottom: '8px',
              right: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--color-muted)'
            }}>
              [SECURITY: ENCRYPTED FOB]
            </div>
          </div>
        );

      case 'Bags':
        return (
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: bgTone,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <svg width="150" height="120" viewBox="0 0 150 120" fill="none">
              {/* Backpack Silhouette */}
              <rect x="42" y="32" width="66" height="72" rx="14" fill="#3A4D46" stroke="#253530" strokeWidth="2" />
              <path d="M60 20C60 14 90 14 90 20V32H60V20Z" stroke="#253530" strokeWidth="3" fill="none" />
              <rect x="48" y="62" width="54" height="34" rx="6" fill="#2E3D37" stroke="#202A26" strokeWidth="1.5" />
              <path d="M75 62V78" stroke="#E9A15B" strokeWidth="2" strokeDasharray="2 2" />
              <circle cx="75" cy="80" r="3" fill="#E9A15B" />
            </svg>
            <div style={{
              position: 'absolute',
              bottom: '8px',
              right: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--color-muted)'
            }}>
              [CONTAINER: PACK/LUGGAGE]
            </div>
          </div>
        );

      case 'Books & Notes':
        return (
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: bgTone,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <svg width="150" height="120" viewBox="0 0 150 120" fill="none">
              {/* Hardcover Journal */}
              <rect x="40" y="24" width="70" height="80" rx="4" fill="#D97762" stroke="#AC5340" strokeWidth="2" transform="rotate(-6 75 64)" />
              {/* Spine Band */}
              <rect x="42" y="24" width="12" height="80" rx="2" fill="#203B36" transform="rotate(-6 75 64)" />
              {/* Ribbon Bookmark */}
              <path d="M72 100L77 114L82 100" fill="#E9A15B" />
              <rect x="62" y="44" width="36" height="24" rx="2" fill="#FFFBF5" transform="rotate(-6 75 64)" />
              <line x1="68" y1="52" x2="90" y2="50" stroke="#AC5340" strokeWidth="2" />
              <line x1="68" y1="58" x2="86" y2="56" stroke="#889188" strokeWidth="1.5" />
            </svg>
            <div style={{
              position: 'absolute',
              bottom: '8px',
              right: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--color-muted)'
            }}>
              [ARCHIVE: ACADEMIC BINDING]
            </div>
          </div>
        );

      default:
        return (
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: bgTone,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{ textAlign: 'center', zIndex: 1 }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: 'rgba(32, 59, 54, 0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px'
              }}>
                <Sparkles size={24} style={{ color: accentTone }} />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'var(--color-forest)' }}>
                {category}
              </div>
            </div>
            <div style={{
              position: 'absolute',
              bottom: '8px',
              right: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--color-muted)'
            }}>
              [CAMPUS ITEM TAG]
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={className}
      style={{
        width: '100%',
        aspectRatio,
        overflow: 'hidden',
        position: 'relative',
        ...style
      }}
    >
      {renderCategoryArtwork()}
    </div>
  );
};
