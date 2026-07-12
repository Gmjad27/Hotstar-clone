import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import Watch from '../../components/Watch/Watch';
import { searchTMDBTitles } from '../../content/tmdb';
import Footer from '../../components/Footer/Footer';
import Skeleton from '../../components/Skeleton/Skeleton';
import RailRow from '../../components/RailRow/RailRow';
import { useRailScroll } from '../../hooks/useRailScroll';

const scoreItem = (item, value) => {
  const name = String(item.name2 || '').toLowerCase();
  const studio = String(item.studio || '').toLowerCase();
  const categories = (item.category || []).map((c) => String(c).toLowerCase());
  const languages = (item.language || []).map((l) => String(l).toLowerCase());

  if (name.startsWith(value)) return 100;
  if (name.includes(value)) return 80;
  if (categories.some((c) => c.includes(value))) return 60;
  if (studio.includes(value)) return 50;
  if (languages.some((l) => l.includes(value))) return 40;
  return 0;
};

const Search = (props) => {
  const [query, setQuery] = useState('');
  const [remoteResults, setRemoteResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [watchOpen, setWatchOpen] = useState(false);
  const [watchItem, setWatchItem] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const data = Array.isArray(props.data) ? props.data : [];
  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    if (!watchItem && data.length > 0) setWatchItem(data[0]);
  }, [data, watchItem]);

  // ==========================================
  // API Fetch with Debounce & AbortController
  // ==========================================
  useEffect(() => {
    if (normalizedQuery.length < 2) {
      setRemoteResults([]);
      setSearchLoading(false);
      return undefined;
    }

    let active = true;
    setSearchLoading(true);

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const results = await searchTMDBTitles(normalizedQuery, { signal: controller.signal });
        if (active) setRemoteResults(results);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Search request aborted.');
        } else {
          console.error('TMDB search failed:', error);
          if (active) setRemoteResults([]);
        }
      } finally {
        if (active) setSearchLoading(false);
      }
    }, 500);

    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [normalizedQuery]);

  // ==========================================
  // Local & remote merging
  // ==========================================
  const localResults = useMemo(() => {
    if (!normalizedQuery) return [];
    return data
      .map((item) => ({ item, score: scoreItem(item, normalizedQuery) }))
      .filter((e) => e.score > 0)
      .sort((a, b) => b.score - a.score || b.item.releaseYear - a.item.releaseYear)
      .map((e) => e.item);
  }, [data, normalizedQuery]);

  const rankedResults = remoteResults.length > 0 ? remoteResults : localResults;

  const movieResults = useMemo(() => rankedResults.filter((i) => i.type === 'movie'), [rankedResults]);
  const seriesResults = useMemo(() => rankedResults.filter((i) => i.type === 'tv'), [rankedResults]);

  const trendingItems = data.slice(0, 20);
  const combinedForLookup = useMemo(() => [...rankedResults, ...data], [data, rankedResults]);

  const railKeys = useMemo(() => {
    const keys = [];
    if (!normalizedQuery) keys.push('trending');
    if (movieResults.length > 0) keys.push('movies');
    if (seriesResults.length > 0) keys.push('series');
    return keys;
  }, [normalizedQuery, movieResults, seriesResults]);

  const { scrollState, setTrackRef, onRailScroll, handleRailScroll } = useRailScroll(railKeys);

  // ==========================================
  // Watch modal logic
  // ==========================================
  const openWatch = useCallback((id) => {
    const selected = combinedForLookup.find((item) => item.id === id);
    if (!selected) return;
    setWatchItem(selected);
    setWatchOpen(true);
    navigate(`${location.pathname}?watch=${selected.id}&name=${encodeURIComponent(selected.name2)}`);
  }, [combinedForLookup, navigate, location.pathname]);

  const clearWatchFromUrl = useCallback(() => {
    setWatchOpen(false);
    navigate(location.pathname);
  }, [navigate, location.pathname]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const watchId = Number(params.get('watch'));
    if (!watchId) return;

    const selected = combinedForLookup.find((item) => item.id === watchId);
    if (!selected) return;

    setWatchItem(selected);
    setWatchOpen(true);
  }, [combinedForLookup, location.search]);

  const renderCard = useCallback(
    (item) => (
      <Card
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
    ),
    [openWatch, props.add, props.e, props.play]
  );

  // ==========================================
  // Loading state
  // ==========================================
  if (props.loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="pt-6 pb-4 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
          <div className="h-11 sm:h-12 bg-gray-800 rounded-full animate-pulse w-full max-w-xl mx-auto" />
        </div>
        <Skeleton type="card" count={12} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Search Header */}
      <div className="pt-4 sm:pt-6 pb-4 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <div className="relative w-full max-w-xl mx-auto">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base sm:text-lg" />
          <input
            type="text"
            inputMode="search"
            className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/20 transition"
            placeholder="Search titles, genres, languages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Results / Trending */}
      <div className="pb-20">
        {normalizedQuery ? (
          <>
            <p className="text-sm text-gray-400 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto mb-4">
              {rankedResults.length} result{rankedResults.length === 1 ? '' : 's'} for "{query}"
            </p>
            {searchLoading && (
              <p className="text-sm text-gray-500 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto mb-4 animate-pulse">
                Searching TMDB...
              </p>
            )}

            {movieResults.length > 0 && (
              <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto mb-6 sm:mb-10">
                <RailRow
                  title="Movies"
                  railKey="movies"
                  items={movieResults}
                  scrollState={scrollState}
                  setTrackRef={setTrackRef}
                  onRailScroll={onRailScroll}
                  handleRailScroll={handleRailScroll}
                  eager
                  renderItem={renderCard}
                />
              </div>
            )}
            {seriesResults.length > 0 && (
              <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto mb-6 sm:mb-10">
                <RailRow
                  title="Series"
                  railKey="series"
                  items={seriesResults}
                  scrollState={scrollState}
                  setTrackRef={setTrackRef}
                  onRailScroll={onRailScroll}
                  handleRailScroll={handleRailScroll}
                  eager
                  renderItem={renderCard}
                />
              </div>
            )}

            {rankedResults.length === 0 && !searchLoading && (
              <div className="text-center py-16 sm:py-20 px-4">
                <h3 className="text-xl sm:text-2xl font-semibold mb-2">No matches found</h3>
                <p className="text-gray-400 text-sm sm:text-base">Try a different title, genre, or language.</p>
              </div>
            )}
          </>
        ) : (
          <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
            <RailRow
              title="Trending Now"
              railKey="trending"
              items={trendingItems}
              scrollState={scrollState}
              setTrackRef={setTrackRef}
              onRailScroll={onRailScroll}
              handleRailScroll={handleRailScroll}
              eager
              renderItem={renderCard}
            />
          </div>
        )}
      </div>

      <Footer />

      {watchOpen && (
        <Watch
          data={combinedForLookup}
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
          name2={watchItem?.name}
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

export default React.memo(Search);