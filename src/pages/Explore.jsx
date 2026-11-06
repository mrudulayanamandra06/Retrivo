import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { itemService } from '../services/itemService';
import { ItemCard } from '../components/items/ItemCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  FileQuestion,
  PlusCircle,
  RotateCcw,
  Sparkles,
  Tag
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Electronics',
  'ID Cards',
  'Books & Notes',
  'Bags',
  'Clothing',
  'Accessories',
  'Keys',
  'Other'
];

export const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync state with URL params
  useEffect(() => {
    const params = {};
    if (query) params.q = query;
    if (type) params.type = type;
    if (category && category !== 'All') params.category = category;
    if (status) params.status = status;
    if (sort !== 'newest') params.sort = sort;
    setSearchParams(params, { replace: true });
  }, [query, type, category, status, sort, setSearchParams]);

  // Fetch Items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const results = await itemService.getItems({
          query,
          type,
          category: category === 'All' ? '' : category,
          status,
          sort
        });
        setItems(results);
      } catch (err) {
        console.error('Error fetching items in explore:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [query, type, category, status, sort]);

  const handleClearFilters = () => {
    setQuery('');
    setType('');
    setCategory('All');
    setStatus('');
    setSort('newest');
  };

  const hasActiveFilters = Boolean(query || type || (category && category !== 'All') || status || sort !== 'newest');

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Editorial Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <span className="rubber-stamp stamp-found" style={{ fontSize: '0.7rem' }}>
            CAMPUS CENTRAL INDEX
          </span>
          <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
            [ALL PROPERTY DIVISIONS]
          </span>
        </div>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--color-forest)' }}>
          Campus Property Archive
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>
          Explore, filter, and cross-reference verified lost and found item tags across university buildings.
        </p>
      </div>

      {/* Tactile Filter & Search Console */}
      <div style={{
        backgroundColor: '#FFFEFA',
        border: '2px solid var(--color-forest)',
        borderRadius: 'var(--radius-sm)',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '4px 4px 0px var(--color-forest)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {/* Main Search Bar */}
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-forest)'
          }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search keywords, brands, colors, locations (e.g. MacBook, Main Library, blue bottle, student ID)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ paddingLeft: '2.75rem', fontSize: '1rem', height: '48px', border: '1.5px solid var(--color-forest)' }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-muted)'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.85rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Classification Switcher (All / Lost / Found) */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'var(--color-ivory)',
            borderRadius: 'var(--radius-xs)',
            border: '1.5px solid var(--color-forest)',
            padding: '3px',
            boxShadow: '1.5px 1.5px 0px var(--color-forest)'
          }}>
            <button
              type="button"
              onClick={() => setType('')}
              style={{
                background: type === '' ? 'var(--color-forest)' : 'transparent',
                color: type === '' ? '#FFFFFF' : 'var(--color-forest)',
                border: 'none',
                borderRadius: '2px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.1s ease'
              }}
            >
              All Tags
            </button>

            <button
              type="button"
              onClick={() => setType('lost')}
              style={{
                background: type === 'lost' ? 'var(--color-terracotta)' : 'transparent',
                color: type === 'lost' ? '#FFFFFF' : 'var(--color-forest)',
                border: 'none',
                borderRadius: '2px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.1s ease'
              }}
            >
              Lost Only
            </button>

            <button
              type="button"
              onClick={() => setType('found')}
              style={{
                background: type === 'found' ? 'var(--color-forest)' : 'transparent',
                color: type === 'found' ? '#FFFFFF' : 'var(--color-forest)',
                border: 'none',
                borderRadius: '2px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.1s ease'
              }}
            >
              Found Only
            </button>
          </div>

          {/* Category Dropdowns */}
          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              className="form-control"
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{ width: 'auto', minWidth: '160px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            <select
              className="form-control"
              value={status}
              onChange={e => setStatus(e.target.value)}
              style={{ width: 'auto', minWidth: '140px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
            >
              <option value="">Any Status</option>
              <option value="active">Active Search</option>
              <option value="under_claim">Under Claim</option>
              <option value="recovered">Recovered</option>
              <option value="closed">Closed</option>
            </select>

            <select
              className="form-control"
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{ width: 'auto', minWidth: '140px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="btn btn-ghost btn-sm"
                title="Reset all filters"
                style={{ color: 'var(--color-error)' }}
              >
                <RotateCcw size={15} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Category Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px dashed var(--color-border)' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', alignSelf: 'center', marginRight: '0.25rem' }}>
            QUICK CATEGORY:
          </span>
          {CATEGORIES.filter(c => c !== 'All').map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c === category ? 'All' : c)}
              style={{
                backgroundColor: category === c ? 'var(--color-forest)' : 'var(--color-ivory)',
                color: category === c ? '#FFFFFF' : 'var(--color-forest)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xs)',
                padding: '0.2rem 0.55rem',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                transition: 'all 0.1s ease'
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Result Count Meta Bar */}
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-forest)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
          [MATCH COUNT: {items.length} TAGS FOUND]
          {type && ` • TYPE: ${type.toUpperCase()}`}
          {category !== 'All' && ` • CAT: ${category.toUpperCase()}`}
        </span>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to="/report-lost" className="btn btn-terracotta btn-sm">
            <PlusCircle size={14} />
            <span>File Lost Tag</span>
          </Link>
          <Link to="/report-found" className="btn btn-marigold btn-sm">
            <PlusCircle size={14} />
            <span>File Found Tag</span>
          </Link>
        </div>
      </div>

      {/* Property Tags Grid */}
      {loading ? (
        <div className="grid-cols-auto">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="property-tag" style={{ height: '360px', padding: '1rem' }}>
              <div className="skeleton" style={{ width: '100%', height: '180px', marginBottom: '1rem' }} />
              <div className="skeleton" style={{ width: '60%', height: '24px', marginBottom: '0.5rem' }} />
              <div className="skeleton" style={{ width: '40%', height: '16px' }} />
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid-cols-auto">
          {items.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div style={{
          backgroundColor: '#FFFEFA',
          border: '2px dashed var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '4rem 2rem',
          textAlign: 'center',
          maxWidth: '540px',
          margin: '2rem auto'
        }}>
          <FileQuestion size={48} style={{ color: 'var(--color-muted)', margin: '0 auto 1.25rem' }} />
          <h3 style={{ fontSize: '1.4rem', color: 'var(--color-forest)', marginBottom: '0.5rem' }}>
            No Matching Property Records Found
          </h3>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            No campus listings match your selected search terms or filters.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            {hasActiveFilters && (
              <button onClick={handleClearFilters} className="btn btn-outline">
                Clear Filters
              </button>
            )}
            <Link to="/report-lost" className="btn btn-terracotta">
              Report Lost Belonging
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
