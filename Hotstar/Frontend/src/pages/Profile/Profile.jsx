import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import Footer from '../../components/Footer/Footer';
import Watch from '../../components/Watch/Watch';
import Skeleton from '../../components/Skeleton/Skeleton';

const Profile = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = Array.isArray(props.data) ? props.data : [];
  const [watchItem, setWatchItem] = useState(data[0] || null);
  const [watchOpen, setWatchOpen] = useState(false);

  // User data from localStorage (kept in state for reactivity)
  const [userData, setUserData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  });

  const fileInputRef = useRef(null);
  const trackRefs = useRef({});
  const [scrollState, setScrollState] = useState({});

  useEffect(() => {
    if (!watchItem && data.length > 0) setWatchItem(data[0]);
  }, [data, watchItem]);

  // Watchlist logic
  const watchListItems = useMemo(() => {
    if (!Array.isArray(props.E)) return [];
    return data.filter((item) => props.E.includes(item.id));
  }, [data, props.E]);

  const movieItems = watchListItems.filter((item) => item.type === 'movie');
  const seriesItems = watchListItems.filter((item) => item.type === 'tv');

  // Profile picture upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        const updatedUser = { ...userData, profilePic: base64String };
        setUserData(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(file);
    }
  };

  // Scroll state management (reused from other pages)
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

  const railKeys = useMemo(() => {
    const keys = [];
    if (movieItems.length > 0) keys.push('movies');
    if (seriesItems.length > 0) keys.push('series');
    if (watchListItems.length > 0) keys.push('all');
    return keys;
  }, [movieItems, seriesItems, watchListItems]);

  useEffect(() => {
    railKeys.forEach((key) => updateScrollState(key));
    const handleResize = () => railKeys.forEach((key) => updateScrollState(key));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [railKeys, updateScrollState]);

  // Watch modal logic (state-driven, no DOM manipulation)
  const openWatch = useCallback((id) => {
    const selected = data.find((item) => item.id === id);
    if (!selected) return;
    setWatchItem(selected);
    setWatchOpen(true);
    navigate(`${location.pathname}?watch=${selected.id}&name=${encodeURIComponent(selected.name2)}`);
  }, [data, navigate, location.pathname]);

  const clearWatchFromUrl = useCallback(() => {
    setWatchOpen(false);
    navigate(location.pathname);
  }, [navigate, location.pathname]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const watchId = Number(params.get('watch'));
    if (!watchId) return;
    const selected = data.find((item) => item.id === watchId);
    if (!selected) return;
    setWatchItem(selected);
    setWatchOpen(true);
  }, [data, location.search]);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // Reusable rail with arrows
  const Rail = ({ title, items, railKey }) => {
    const state = scrollState[railKey] || {};
    return (
      <section className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-3 px-4 md:px-8 max-w-7xl mx-auto">{title}</h2>
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

  // Loading state
  if (props.loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Skeleton type="card" count={6} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Profile Section */}
      <section className="relative w-full bg-gradient-to-b from-neutral-900 to-black pt-8 pb-12 px-4 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile picture */}
          <div className="flex-shrink-0">
            <div
              className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition border-2 border-white/20"
              onClick={() => fileInputRef.current?.click()}
              title="Click to change profile picture"
              style={{
                backgroundImage: userData.profilePic ? `url(${userData.profilePic})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {!userData.profilePic && (
                <i className="fa-solid fa-camera text-white/60 text-2xl" />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* User info */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm uppercase tracking-wider text-gray-400 mb-1">PROFILE</p>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{String(userData?.name || 'Guest')}</h1>
            <p className="text-gray-400 max-w-md">Manage your saved titles and continue watching.</p>
          </div>

          {/* Stats & Logout */}
          <div className="flex flex-wrap items-center gap-4 md:gap-8 justify-center md:justify-end">
            <div className="text-center">
              <span className="block text-2xl font-bold">{watchListItems.length}</span>
              <span className="text-xs text-gray-400">Watchlist</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold">{movieItems.length}</span>
              <span className="text-xs text-gray-400">Movies</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold">{seriesItems.length}</span>
              <span className="text-xs text-gray-400">Series</span>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600/80 text-white rounded-full text-sm font-semibold hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </section>

      {/* Content (watchlist or empty state) */}
      <div className="pb-20">
        {watchListItems.length === 0 ? (
          <div className="text-center py-20 px-4">
            <h2 className="text-2xl font-semibold mb-2">Your watchlist is empty</h2>
            <p className="text-gray-400 mb-6">Add titles from Home, Movies, TV, or Search to see them here.</p>
            <button
              onClick={() => navigate('/search')}
              className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition"
            >
              Explore Titles
            </button>
          </div>
        ) : (
          <>
            {movieItems.length > 0 && <Rail title="Saved Movies" items={movieItems} railKey="movies" />}
            {seriesItems.length > 0 && <Rail title="Saved Series" items={seriesItems} railKey="series" />}
            {watchListItems.length > 0 && <Rail title="All Watchlist" items={watchListItems} railKey="all" />}
          </>
        )}
      </div>

      <Footer />

      {/* Watch Modal (conditionally rendered) */}
      {watchOpen && (
        <Watch
          data={data}
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

export default React.memo(Profile);