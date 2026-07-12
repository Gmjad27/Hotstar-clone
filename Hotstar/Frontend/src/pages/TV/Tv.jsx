import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import Watch from '../../components/Watch/Watch';
import { fetchTMDBTVSections } from '../../content/tmdb';
import Footer from '../../components/Footer/Footer';
import RailRow from '../../components/RailRow/RailRow';
import { useRailScroll } from '../../hooks/useRailScroll';

const Tv = (props) => {
  const [watchOpen, setWatchOpen] = useState(false);
  const [watchItem, setWatchItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const data = Array.isArray(props.data) ? props.data : [];
  const series = useMemo(() => data.filter((item) => item.type === 'tv'), [data]);
  const [pageSections, setPageSections] = useState({ heroBanner: [], rails: [] });
  const [sectionsLoading, setSectionsLoading] = useState(true);

  // Fetch TMDB TV sections
  useEffect(() => {
    let active = true;
    const loadSections = async () => {
      setSectionsLoading(true);
      try {
        const sections = await fetchTMDBTVSections();
        if (active) setPageSections(sections);
      } catch {
        if (active) setPageSections({ heroBanner: [], rails: [] });
      } finally {
        if (active) setSectionsLoading(false);
      }
    };
    loadSections();
    return () => { active = false; };
  }, []);

  // Set default watch item
  useEffect(() => {
    if (!watchItem && series.length > 0) setWatchItem(series[0]);
  }, [series, watchItem]);

  // Featured hero item
  const featured = useMemo(() => {
    if (Array.isArray(pageSections.heroBanner) && pageSections.heroBanner.length > 0)
      return pageSections.heroBanner[0];
    if (series.length === 0) return null;
    return [...series].sort((a, b) => b.releaseYear - a.releaseYear)[0];
  }, [pageSections.heroBanner, series]);

  // Section rails (fallback to local data if TMDB fails)
  const sections = useMemo(
    () =>
      Array.isArray(pageSections.rails) && pageSections.rails.length > 0
        ? pageSections.rails
        : [
            { title: 'Trending Now', items: series.slice(0, 20) },
            { title: 'Popular Shows', items: series.slice(20, 40) },
            { title: 'New Episodes', items: series.slice(40, 60) },
          ],
    [pageSections.rails, series]
  );

  // Combined lookup array for Watch modal
  const allItems = useMemo(
    () => [
      ...series,
      ...(pageSections.heroBanner || []),
      ...sections.flatMap((section) => section.items || []),
    ],
    [pageSections.heroBanner, sections, series]
  );

  const railKeys = useMemo(() => sections.map((_, idx) => `rail-${idx}`), [sections]);
  const { scrollState, setTrackRef, onRailScroll, handleRailScroll } = useRailScroll(railKeys);

  // ==========================================
  // Watch modal logic (state-driven, no DOM manipulation)
  // ==========================================
  const openWatch = useCallback((id) => {
    const selected = allItems.find((item) => item.id === id);
    if (!selected) return;
    setWatchItem(selected);
    setWatchOpen(true);
    navigate(`${location.pathname}?watch=${selected.id}&name=${encodeURIComponent(selected.name2)}`);
  }, [allItems, navigate, location.pathname]);

  const clearWatchFromUrl = useCallback(() => {
    setWatchOpen(false);
    navigate(location.pathname);
  }, [navigate, location.pathname]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const watchId = Number(params.get('watch'));
    if (!watchId) return;
    const selected = allItems.find((item) => item.id === watchId);
    if (!selected) return;
    setWatchItem(selected);
    setWatchOpen(true);
  }, [allItems, location.search]);

  const playFeatured = useCallback(() => {
    if (!featured) return;
    const streamId = `${featured.type}/${featured.tmdbId}/1/1`;
    props.play(streamId);
    navigate('/stream');
  }, [featured, props, navigate]);

  // ==========================================
  // Loading state
  // ==========================================
  if (props.loading || (sectionsLoading && sections.length === 0)) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-lg animate-pulse">Loading TMDB series...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ── Hero Banner ── */}
      {featured && (
        <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[85vh] overflow-hidden">
          {/* Device-specific art, CSS-driven (no matchMedia reflow) */}
          <div
            className="absolute inset-0 bg-cover bg-center block md:hidden"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.88), rgba(0,0,0,0.25)), url(${featured.name})`,
            }}
          />
          <div
            className="absolute inset-0 bg-cover bg-center hidden md:block"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.88), rgba(0,0,0,0.25)), url(${featured.img})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 md:p-12 lg:p-16 flex flex-col items-start gap-3 sm:gap-4 max-w-full sm:max-w-lg md:max-w-2xl">
            <span className="px-3 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-red-600 text-white rounded-full">
              TV SHOW
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-lg line-clamp-2">
              {featured.name2}
            </h1>
            <p className="hidden sm:block text-sm md:text-base text-gray-300 max-w-xl line-clamp-3">
              {featured.desc}
            </p>
            <div className="flex gap-2 sm:gap-3 mt-1 sm:mt-2 w-full sm:w-auto">
              <button
                onClick={playFeatured}
                className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 bg-white text-black font-semibold text-sm sm:text-base rounded hover:bg-gray-200 active:scale-95 transition"
              >
                <i className="fa-solid fa-play text-sm" /> Play
              </button>
              <button
                onClick={() => openWatch(featured.id)}
                className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 bg-gray-600/80 text-white font-semibold text-sm sm:text-base rounded hover:bg-gray-500/80 active:scale-95 transition backdrop-blur-md"
              >
                ⓘ More Info
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── Content Rails ── */}
      <div className="px-4 sm:px-6 md:px-12 lg:px-14 xl:px-16 -mt-14 sm:-mt-16 relative z-10 space-y-8 sm:space-y-10">
        {sections.map((section, idx) => {
          const railKey = `rail-${idx}`;
          return (
            <RailRow
              key={section.title}
              title={section.title}
              railKey={railKey}
              items={section.items}
              scrollState={scrollState}
              setTrackRef={setTrackRef}
              onRailScroll={onRailScroll}
              handleRailScroll={handleRailScroll}
              eager={idx === 0}
              renderItem={(item) => (
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
              )}
            />
          );
        })}

        <Footer />
      </div>

      {/* ── Watch Modal (conditionally rendered) ── */}
      {watchOpen && (
        <Watch
          data={allItems}
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

export default React.memo(Tv);