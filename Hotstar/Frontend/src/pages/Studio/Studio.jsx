import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import Watch from '../../components/Watch/Watch';
import { fetchTMDBStudioTitles } from '../../content/tmdb';
import Footer from '../../components/Footer/Footer';

// Simple SVG icons as inline components (unchanged)
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </svg>
);

const GENRE_FILTERS = ['All', 'Action', 'Sci-Fi', 'Thriller', 'Adventure', 'Drama', 'Animation', 'TV Shows', 'Movies'];

const Studio = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = Array.isArray(props.data) ? props.data : [];
  const [studioData, setStudioData] = useState([]);
  const [studioLoading, setStudioLoading] = useState(false);
  const [watchItem, setWatchItem] = useState(null);
  const [watchOpen, setWatchOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const studioFromQuery = new URLSearchParams(location.search).get('studio_name');
  const studioName = String(studioFromQuery || props.studio || '').trim();

  const trackRefs = useRef({});
  const [scrollState, setScrollState] = useState({});

  // Fetch studio data
  useEffect(() => {
    let active = true;
    const loadStudioData = async () => {
      if (!studioName) { if (active) setStudioData([]); return; }
      setStudioLoading(true);
      try {
        const items = await fetchTMDBStudioTitles(studioName, { moviePages: 3, tvPages: 3 });
        if (active) setStudioData(items);
      } catch {
        if (active) setStudioData([]);
      } finally {
        if (active) setStudioLoading(false);
      }
    };
    loadStudioData();
    return () => { active = false; };
  }, [studioName]);

  // Filtered data based on active filter
  const filteredData = useMemo(() => {
    if (activeFilter === 'All') return studioData;
    if (activeFilter === 'Movies') return studioData.filter(i => i.type === 'movie');
    if (activeFilter === 'TV Shows') return studioData.filter(i => i.type === 'tv');
    return studioData.filter(i =>
      (i.category || []).some(g => g.toLowerCase().includes(activeFilter.toLowerCase()))
    );
  }, [studioData, activeFilter]);

  const allData = useMemo(() => [...studioData, ...data], [data, studioData]);

  // Set initial watch item
  useEffect(() => {
    if (!watchItem && filteredData.length > 0) setWatchItem(filteredData[0]);
  }, [filteredData, watchItem]);

  // Compute rails
  const recentlyAdded = useMemo(() =>
    [...studioData].sort((a, b) => {
      const da = new Date(a.releaseDate || a.firstAirDate || 0);
      const db = new Date(b.releaseDate || b.firstAirDate || 0);
      return db - da;
    }).slice(0, 12),
    [studioData]
  );

  const rails = useMemo(() => {
    if (filteredData.length === 0) return [];
    const movies = filteredData.filter(i => i.type === 'movie');
    const tvShows = filteredData.filter(i => i.type === 'tv');
    const result = [];
    if (activeFilter === 'All' && recentlyAdded.length > 0) result.push({ title: 'Recently Added', items: recentlyAdded });
    if (movies.length > 0) result.push({ title: 'Movies', items: movies });
    if (tvShows.length > 0) result.push({ title: 'TV Shows', items: tvShows });
    return result;
  }, [filteredData, recentlyAdded, activeFilter]);

  // ==========================================
  // Scroll state management
  // ==========================================
  const updateScrollState = useCallback((railKey) => {
    const el = trackRefs.current[railKey];
    if (!el) return;
    const atStart = el.scrollLeft <= 4;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    const canScroll = el.scrollWidth > el.clientWidth + 4;
    setScrollState((prev) => {
      const existing = prev[railKey];
      if (existing && existing.atStart === atStart && existing.atEnd === atEnd && existing.canScroll === canScroll)
        return prev;
      return { ...prev, [railKey]: { atStart, atEnd, canScroll } };
    });
  }, []);

  const handleRailScroll = useCallback((railKey, offset) => {
    const el = trackRefs.current[railKey];
    if (!el) return;
    el.scrollBy({ left: offset, behavior: 'smooth' });
    setTimeout(() => updateScrollState(railKey), 350);
  }, [updateScrollState]);

  const railKeys = useMemo(() => rails.map((_, idx) => `rail-${idx}`), [rails]);

  useEffect(() => {
    railKeys.forEach((key) => updateScrollState(key));
    const handleResize = () => railKeys.forEach((key) => updateScrollState(key));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [railKeys, updateScrollState]);

  // ==========================================
  // Watch modal logic (state-driven)
  // ==========================================
  const openWatch = useCallback((id) => {
    const selected = allData.find(i => i.id === id);
    if (!selected) return;
    setWatchItem(selected);
    setWatchOpen(true);
    navigate(`${location.pathname}?studio_name=${encodeURIComponent(studioName)}&watch=${selected.id}`);
  }, [allData, location.pathname, navigate, studioName]);

  const clearWatchFromUrl = useCallback(() => {
    setWatchOpen(false);
    navigate(`${location.pathname}?studio_name=${encodeURIComponent(studioName)}`);
  }, [navigate, location.pathname, studioName]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const watchId = Number(params.get('watch'));
    if (!watchId) return;
    const selected = allData.find(i => i.id === watchId);
    if (!selected) return;
    setWatchItem(selected);
    setWatchOpen(true);
  }, [allData, location.search]);

  // Loading state
  if (props.loading || (studioLoading && filteredData.length === 0)) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4" />
        <p className="text-lg animate-pulse">Loading {studioName || 'Studio'} catalog...</p>
      </div>
    );
  }

  // Rail component with arrows
  const Rail = ({ title, items, railKey }) => {
    const state = scrollState[railKey] || {};
    return (
      <section className="mb-10">
        <div className="flex items-center justify-between px-4 md:px-8 max-w-7xl mx-auto mb-3">
          <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
          <span className="text-sm text-gray-400">{items.length} titles</span>
        </div>
        <div className="relative group max-w-[100vw] px-4 md:px-8 mx-auto">
          {/* Left arrow */}
          <button
            type="button"
            className={`absolute left-0 md:left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 text-white text-xl backdrop-blur-sm hover:bg-black/90 transition ${
              !state.canScroll || state.atStart ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'
            }`}
            aria-label={`Scroll ${title} left`}
            onClick={() => handleRailScroll(railKey, -(trackRefs.current[railKey]?.clientWidth || 600) * 0.85)}
          >
            ‹
          </button>

          {/* Scrollable track */}
          <div
            ref={(node) => { trackRefs.current[railKey] = node; }}
            onScroll={() => updateScrollState(railKey)}
            className="flex gap-3 overflow-x-auto scroll-smooth pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {items.map((item) => (
              <Card
                key={item.id}
                sow={openWatch}
                id={item.id}
                img={item.name}
                name={item.name2}
                ry={item.releaseYear}
                ua={item.ua}
                lan={item.language?.length || 0}
                desc={item.desc}
                s={item.season}
                type={item.type}
                tid={item.tmdbId}
                add={props.add}
                e={props.e}
                play={props.play}
              />
            ))}
          </div>

          {/* Right arrow */}
          <button
            type="button"
            className={`absolute right-0 md:right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 text-white text-xl backdrop-blur-sm hover:bg-black/90 transition ${
              !state.canScroll || state.atEnd ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'
            }`}
            aria-label={`Scroll ${title} right`}
            onClick={() => handleRailScroll(railKey, (trackRefs.current[railKey]?.clientWidth || 600) * 0.85)}
          >
            ›
          </button>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero header with studio name and background */}
      <div
        className="relative w-full h-[40vh] md:h-[50vh] flex items-end bg-cover bg-center"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.54) 50%, rgba(0,0,0,0.1) 100%),
            linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%),
            url(${props.bg || studioData[0]?.img || ''})
          `,
        }}
      >
        <div className="px-4 md:px-12 pb-8 w-full max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">{studioName || 'Studio'}</h1>
          <p className="mt-2 text-gray-300 text-sm md:text-base">
            {studioData.length} titles available
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="px-4 md:px-8 max-w-7xl mx-auto py-3 flex flex-wrap gap-2">
          {GENRE_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition whitespace-nowrap ${
                activeFilter === f
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white/70 border-white/30 hover:border-white/70'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="pb-20">
        {filteredData.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-2">No titles found</h2>
            <p className="text-gray-400">Try adjusting your filters or explore other studios.</p>
          </div>
        ) : (
          rails.map((rail, idx) => (
            <Rail key={rail.title} title={rail.title} items={rail.items} railKey={`rail-${idx}`} />
          ))
        )}
      </div>

      <Footer />

      {/* Watch Modal */}
      {watchOpen && (
        <Watch
          data={allData}
          sow={openWatch}
          onClose={clearWatchFromUrl}
          sid={watchItem?.id}
          El={Array.isArray(props.e) && props.e.includes(watchItem?.id) ? 'ADDED' : '+'}
          img={watchItem?.img}
          type={watchItem?.type}
          id={watchItem?.tmdbId}
          s={watchItem?.episodes}
          mname={watchItem?.name2}
          name={watchItem?.nameImg}
          name2={watchItem?.name2}
          yr={watchItem?.releaseYear}
          ua={watchItem?.ua}
          season={watchItem?.season}
          lan={watchItem?.language?.length || 0}
          desc={watchItem?.desc}
          cat={watchItem?.category}
          rating={watchItem?.rating}
          language={watchItem?.language}
          add={props.add}
          e={props.e}
          play={props.play}
        />
      )}
    </div>
  );
};

export default React.memo(Studio);