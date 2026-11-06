import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { itemService } from '../services/itemService';
import { ItemCard } from '../components/items/ItemCard';
import { ItemVisual } from '../components/items/ItemVisual';
import {
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  ArrowUpRight,
  Radio,
  FileQuestion,
  Layers,
  HeartHandshake,
  QrCode,
  MapPin,
  Calendar,
  Award
} from 'lucide-react';

export const Home = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    recoveredCount: 0,
    activeCount: 0,
    lostCount: 0,
    foundCount: 0,
    pendingClaims: 0
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statData, allItems] = await Promise.all([
          itemService.getStatistics(),
          itemService.getItems({ sort: 'newest' })
        ]);
        setStats(statData);
        setItems(allItems);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeReports = items.filter(i => i.status !== 'closed').slice(0, 4);
  const featuredItem = items.find(i => i.id === 'item-201') || items[0];
  const recoveredList = items.filter(i => i.status === 'recovered').slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingBottom: '5rem' }}>
      {/* 1. CAMPUS TICKER TAPE BAR */}
      <div style={{
        backgroundColor: 'var(--color-forest-dark)',
        color: 'var(--color-ivory)',
        borderBottom: '1.5px solid var(--color-forest)',
        padding: '0.45rem 1rem',
        fontSize: '0.75rem',
        fontFamily: 'var(--font-mono)',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ color: 'var(--color-marigold)', fontWeight: 700 }}>
              ● LIVE CAMPUS RETRIEVAL REGISTRY
            </span>
            <span>[DESK STATUS: OPERATIONAL]</span>
            <span style={{ display: 'none' }} className="desktop-ticker">
              CIRCULATION DESKS: MAIN LIBRARY (1F) • STUDENT UNION SOUTH (GF) • SAFETY OFFICE
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', color: 'rgba(245, 240, 230, 0.7)' }}>
            <span>TOTAL LOGGED: {stats.totalItems}</span>
            <span>RECOVERED: {stats.recoveredCount}</span>
          </div>
        </div>
      </div>

      {/* 2. EDITORIAL HERO — Asymmetric Newspaper / Archival Composition */}
      <section style={{ position: 'relative', paddingTop: '1.5rem' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            {/* Left Column: Bold Editorial Headline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span className="rubber-stamp stamp-found" style={{ fontSize: '0.7rem' }}>
                  CAMPUS ARCHIVE № 2026
                </span>
                <span style={{
                  fontSize: '0.775rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-muted)',
                  textTransform: 'uppercase'
                }}>
                  Decentralized Property Recovery
                </span>
              </div>

              <h1 style={{
                color: 'var(--color-forest)',
                lineHeight: 1.05,
                letterSpacing: '-0.035em'
              }}>
                What was lost <br />
                <span style={{
                  backgroundColor: 'var(--color-marigold)',
                  color: 'var(--color-forest-dark)',
                  padding: '0 0.25rem',
                  display: 'inline-block',
                  transform: 'rotate(-1deg)',
                  boxShadow: '3px 3px 0px var(--color-forest-dark)'
                }}>
                  can be retrieved.
                </span>
              </h1>

              <p style={{
                fontSize: '1.15rem',
                color: 'var(--color-text)',
                lineHeight: 1.55,
                maxWidth: '520px',
                borderLeft: '3px solid var(--color-forest)',
                paddingLeft: '1rem'
              }}>
                A verified digital recovery service built for university students and staff. No more chaotic WhatsApp groups or unattended pin-boards.
              </p>

              {/* Action Buttons with Tactile Brutalist Ink Shadows */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.85rem',
                alignItems: 'center',
                marginTop: '0.5rem'
              }}>
                <Link to="/report-lost" className="btn btn-terracotta btn-lg">
                  <span>Report a Lost Item</span>
                  <ArrowRight size={18} />
                </Link>

                <Link to="/report-found" className="btn btn-marigold btn-lg">
                  <span>I Found Something</span>
                </Link>

                <Link to="/explore" className="btn btn-outline btn-lg">
                  <Search size={18} />
                  <span>Browse All Tags</span>
                </Link>
              </div>

              {/* Verified Protocols strip */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-muted)',
                paddingTop: '0.5rem'
              }}>
                <span>✓ Private Verification Only</span>
                <span>✓ Verified Handover Hubs</span>
                <span>✓ Printable QR Stickers</span>
              </div>
            </div>

            {/* Right Column: Physical "CAMPUS DESK INCIDENT REPORT SLIP" */}
            <div style={{ position: 'relative' }}>
              {/* Paper Washi Tape top banner */}
              <div className="washi-tape" />

              <div style={{
                backgroundColor: '#FFFEFA',
                border: '2px solid var(--color-forest)',
                borderRadius: 'var(--radius-sm)',
                boxShadow: '6px 6px 0px var(--color-forest)',
                padding: '1.75rem',
                position: 'relative'
              }}>
                {/* Stamp at top right */}
                <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
                  <span className="rubber-stamp stamp-verified">
                    DESK VERIFIED
                  </span>
                </div>

                {/* Slip Header */}
                <div style={{
                  borderBottom: '1.5px dashed var(--color-border)',
                  paddingBottom: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                    UNIVERSITY PROPERTY RETRIEVAL FORM • SLIP #4092-B
                  </div>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--color-forest)', marginTop: '0.25rem' }}>
                    Live Case Match in Progress
                  </h3>
                </div>

                {/* Visual artwork mock for MacBook */}
                <div style={{
                  border: '1.5px solid var(--color-border)',
                  borderRadius: '4px',
                  marginBottom: '1rem',
                  overflow: 'hidden'
                }}>
                  <ItemVisual
                    category="Electronics"
                    itemType="found"
                    title="Apple MacBook Pro in Gray Case"
                    aspectRatio="16/9"
                  />
                </div>

                {/* Match Score Meter */}
                <div style={{
                  backgroundColor: 'var(--color-ivory)',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem'
                }}>
                  <div className="flex-between" style={{ marginBottom: '0.35rem' }}>
                    <span className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-forest)' }}>
                      SMART MATCH ALGORITHM:
                    </span>
                    <span className="badge badge-active font-mono" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                      93.0% CONFIDENCE
                    </span>
                  </div>

                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'var(--color-border)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: '93%',
                      height: '100%',
                      backgroundColor: 'var(--color-forest)',
                      borderRadius: '4px'
                    }} />
                  </div>

                  <div style={{
                    fontSize: '0.725rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-muted)',
                    marginTop: '0.4rem',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>CAT: +25pts</span>
                    <span>TITLE: +28.5pts</span>
                    <span>LOC: +20pts</span>
                    <span>DATE: +15pts</span>
                  </div>
                </div>

                {/* Perforation Line */}
                <div className="ticket-perforation" style={{ margin: '0.75rem -1.75rem' }}>
                  <div className="perforation-line" />
                </div>

                {/* Handover location strip */}
                <div className="flex-between" style={{ paddingTop: '0.25rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                      CUSTODY LOCATION
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-forest)' }}>
                      Main Library Circulation Desk (1F)
                    </div>
                  </div>

                  <Link to="/items/item-201" className="btn btn-forest btn-sm">
                    <span>Inspect Slip</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TACTILE CAMPUS REGISTRY METRICS (Physical Stamp Slips) */}
      <section className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}>
          {/* Metric 1 */}
          <div style={{
            backgroundColor: '#FFFEFA',
            border: '1.5px solid var(--color-forest)',
            borderRadius: 'var(--radius-xs)',
            padding: '1.25rem',
            boxShadow: '3px 3px 0px var(--color-forest)'
          }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', textTransform: 'uppercase' }}>
              [LOGGED INVENTORY]
            </div>
            <div className="font-mono" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-forest)', lineHeight: 1.1, margin: '0.25rem 0' }}>
              {stats.totalItems}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text)' }}>
              Total university incident records
            </div>
          </div>

          {/* Metric 2 */}
          <div style={{
            backgroundColor: '#FFFEFA',
            border: '1.5px solid var(--color-success)',
            borderRadius: 'var(--radius-xs)',
            padding: '1.25rem',
            boxShadow: '3px 3px 0px var(--color-success)'
          }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-success)', textTransform: 'uppercase' }}>
              [RETURNED TO OWNER]
            </div>
            <div className="font-mono" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-success)', lineHeight: 1.1, margin: '0.25rem 0' }}>
              {stats.recoveredCount}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text)' }}>
              Verified physical handovers
            </div>
          </div>

          {/* Metric 3 */}
          <div style={{
            backgroundColor: '#FFFEFA',
            border: '1.5px solid var(--color-terracotta)',
            borderRadius: 'var(--radius-xs)',
            padding: '1.25rem',
            boxShadow: '3px 3px 0px var(--color-terracotta)'
          }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-terracotta)', textTransform: 'uppercase' }}>
              [SEEKING MATCH]
            </div>
            <div className="font-mono" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-terracotta)', lineHeight: 1.1, margin: '0.25rem 0' }}>
              {stats.activeCount}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text)' }}>
              Active lost &amp; found listings
            </div>
          </div>

          {/* Metric 4 */}
          <div style={{
            backgroundColor: '#FFFEFA',
            border: '1.5px solid var(--color-marigold)',
            borderRadius: 'var(--radius-xs)',
            padding: '1.25rem',
            boxShadow: '3px 3px 0px var(--color-marigold)'
          }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#915316', textTransform: 'uppercase' }}>
              [CLAIMS UNDER REVIEW]
            </div>
            <div className="font-mono" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-forest)', lineHeight: 1.1, margin: '0.25rem 0' }}>
              {stats.pendingClaims}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text)' }}>
              Evidence verification active
            </div>
          </div>
        </div>
      </section>

      {/* 4. RECENTLY LOGGED PROPERTY TAGS */}
      <section className="container">
        <div className="flex-between" style={{ marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="rubber-stamp stamp-found" style={{ fontSize: '0.65rem' }}>
                PROPERTY ARCHIVE
              </span>
              <h2 style={{ fontSize: '2rem' }}>Recently Logged Property Tags</h2>
            </div>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.925rem', marginTop: '0.2rem' }}>
              Live filings submitted across campus buildings and libraries
            </p>
          </div>

          <Link to="/explore" className="btn btn-outline">
            <span>View All Filed Tags</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid-cols-auto">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="property-tag" style={{ height: '360px', padding: '1.5rem' }}>
                <div className="skeleton" style={{ width: '100%', height: '170px', marginBottom: '1rem' }} />
                <div className="skeleton" style={{ width: '60%', height: '20px', marginBottom: '0.5rem' }} />
                <div className="skeleton" style={{ width: '40%', height: '14px' }} />
              </div>
            ))}
          </div>
        ) : activeReports.length > 0 ? (
          <div className="grid-cols-auto">
            {activeReports.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: '#FFFEFA',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)'
          }}>
            <FileQuestion size={40} style={{ color: 'var(--color-muted)', margin: '0 auto 1rem' }} />
            <p>No listings currently logged.</p>
          </div>
        )}
      </section>

      {/* 5. HOW IT WORKS: THE 4-STEP RECOVERY PROTOCOL */}
      <section style={{
        backgroundColor: 'var(--color-forest)',
        color: 'var(--color-ivory)',
        padding: '4.5rem 0',
        borderTop: '2px solid var(--color-forest-dark)',
        borderBottom: '2px solid var(--color-forest-dark)'
      }}>
        <div className="container">
          <div style={{ maxWidth: '640px', marginBottom: '3.5rem' }}>
            <span style={{
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              color: 'var(--color-marigold)',
              letterSpacing: '0.1em'
            }}>
              [STANDARD OPERATING PROCEDURE]
            </span>
            <h2 style={{ fontSize: '2.4rem', color: '#FFFFFF', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
              The 4-Step Verifiable Handover
            </h2>
            <p style={{ color: 'rgba(245, 240, 230, 0.8)', fontSize: '1.05rem', lineHeight: 1.5 }}>
              Engineered to replace informal guesswork with verifiable identification and safe public campus checkpoints.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Step 1 */}
            <div style={{
              backgroundColor: '#1B312D',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              boxShadow: '3px 3px 0px rgba(0,0,0,0.2)'
            }}>
              <div className="flex-between">
                <span className="font-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-marigold)' }}>
                  01
                </span>
                <span className="rubber-stamp stamp-found" style={{ color: 'var(--color-ivory)', borderColor: 'rgba(255,255,255,0.3)' }}>
                  INTAKE
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF' }}>File Property Tag</h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(245, 240, 230, 0.75)', lineHeight: 1.5 }}>
                Submit description, date, campus zone, and distinguishing markers. System generates a physical-safe QR tag.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{
              backgroundColor: '#1B312D',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              boxShadow: '3px 3px 0px rgba(0,0,0,0.2)'
            }}>
              <div className="flex-between">
                <span className="font-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-marigold)' }}>
                  02
                </span>
                <span className="rubber-stamp stamp-found" style={{ color: 'var(--color-ivory)', borderColor: 'rgba(255,255,255,0.3)' }}>
                  PREDICTION
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF' }}>Smart Matching</h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(245, 240, 230, 0.75)', lineHeight: 1.5 }}>
                Algorithm scores category, name tokens, building zones, and dates to rank potential pairings with explainable breakdowns.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{
              backgroundColor: '#1B312D',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              boxShadow: '3px 3px 0px rgba(0,0,0,0.2)'
            }}>
              <div className="flex-between">
                <span className="font-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-terracotta)' }}>
                  03
                </span>
                <span className="rubber-stamp stamp-lost" style={{ color: 'var(--color-terracotta)', borderColor: 'var(--color-terracotta)' }}>
                  SECRET PROOF
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF' }}>Confidential Claim</h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(245, 240, 230, 0.75)', lineHeight: 1.5 }}>
                Claimant provides serial numbers, hidden stickers, or lockscreen hints hidden from public view and reviewed securely.
              </p>
            </div>

            {/* Step 4 */}
            <div style={{
              backgroundColor: '#1B312D',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              boxShadow: '3px 3px 0px rgba(0,0,0,0.2)'
            }}>
              <div className="flex-between">
                <span className="font-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-success)' }}>
                  04
                </span>
                <span className="rubber-stamp stamp-verified">
                  HANDOVER
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF' }}>Safe Checkpoint Handover</h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(245, 240, 230, 0.75)', lineHeight: 1.5 }}>
                Meet at official campus desk (Library or Safety Office), complete physical verification, and confirm retrieval in the registry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED RECOVERIES WALL */}
      {recoveredList.length > 0 && (
        <section className="container">
          <div style={{ marginBottom: '1.5rem' }}>
            <span className="rubber-stamp stamp-recovered" style={{ fontSize: '0.65rem' }}>
              CAMPUS COMMUNITY ARCHIVE
            </span>
            <h2 style={{ fontSize: '2rem', marginTop: '0.35rem' }}>Successfully Reunited Belongings</h2>
          </div>

          <div className="grid-cols-auto">
            {recoveredList.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* 7. PHYSICAL CALL TO ACTION BANNER */}
      <section className="container">
        <div style={{
          backgroundColor: '#FFFEFA',
          border: '2px solid var(--color-forest)',
          borderRadius: 'var(--radius-md)',
          padding: '3rem 2rem',
          boxShadow: '6px 6px 0px var(--color-forest)',
          position: 'relative'
        }}>
          <div className="washi-tape" />

          <div style={{ maxWidth: '620px', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-muted)', textTransform: 'uppercase' }}>
              [CAMPUS CIVIC PARTICIPATION]
            </div>
            <h2 style={{ fontSize: '2.3rem', color: 'var(--color-forest)', lineHeight: 1.15 }}>
              Picked up an item on campus?
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text)', lineHeight: 1.6 }}>
              It takes 45 seconds to log a found property tag. You save a fellow student hours of stress, midterm panic, or financial loss.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <Link to="/report-found" className="btn btn-marigold btn-lg">
                Log a Found Property Tag
              </Link>
              <Link to="/explore" className="btn btn-outline btn-lg">
                Search the Archive
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (min-width: 860px) {
          .desktop-ticker {
            display: inline !important;
          }
        }
      `}</style>
    </div>
  );
};
