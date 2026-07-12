import React, { useEffect, useMemo, useState, useCallback, lazy, Suspense, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Watch from '../../components/Watch/Watch';
import RailRow from '../../components/RailRow/RailRow.jsx';
import { useRailScroll } from '../../hooks/useRailScroll';

const Card = lazy(() => import('../../components/Card/Card'));
const Card2 = lazy(() => import('../../components/Card/Card2'));
const Footer = lazy(() => import('../../components/Footer/Footer'));

import Skeleton from '../../components/Skeleton/Skeleton';
import { STUDIO_COLLECTIONS, filterByStudioCollection } from '../../content/studios.js';

const HERO_ROTATE_MS = 6000;

function Home(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const data = Array.isArray(props.data) ? props.data : [];
  const homeSections = props.homeSections || { heroBanner: [], rails: [] };
  const heroData = Array.isArray(homeSections.heroBanner) ? homeSections.heroBanner : [];
  const [heroIndex, setHeroIndex] = useState(0);
  const [watchItem, setWatchItem] = useState(data[0] || null);
  const [watchOpen, setWatchOpen] = useState(false);

  const mediaData = useMemo(
    () => (heroData.length > 0 ? heroData.slice(0, 5) : data.slice(0)),
    [data, heroData]
  );
  const currentHero = mediaData[heroIndex % Math.max(mediaData.length, 1)] || null;

  useEffect(() => {
    if (!watchItem && data.length > 0) setWatchItem(data[0]);
  }, [data, watchItem]);

  useEffect(() => {
    if (mediaData.length < 2) return undefined;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % mediaData.length);
    }, HERO_ROTATE_MS);
    return () => clearInterval(interval);
  }, [mediaData]);

  // Warm the browser's image cache for the next hero slide (both mobile and
  // desktop art) so the crossfade below never has to wait on a network
  // round-trip mid-transition — this is what caused the visible "hitch"
  // every ~6s on the original carousel.
  useEffect(() => {
    if (mediaData.length < 2) return;
    const next = mediaData[(heroIndex + 1) % mediaData.length];
    if (!next) return;
    [next.img, next.name].filter(Boolean).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [heroIndex, mediaData]);

  const openWatch = useCallback((id) => {
    const selected = [...mediaData, ...data].find((item) => item.id === id);
    if (!selected) return;
    setWatchItem(selected);
    setWatchOpen(true);
    navigate(`${location.pathname}?watch=${selected.id}&name=${encodeURIComponent(selected.name2)}`);
  }, [mediaData, data, navigate, location.pathname]);

  const clearWatchFromUrl = useCallback(() => {
    setWatchOpen(false);
    setWatchItem(null);
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

  const playHero = useCallback(() => {
    if (!currentHero) return;
    const streamId =
      currentHero.type === 'movie'
        ? `${currentHero.type}/${currentHero.tmdbId}`
        : `${currentHero.type}/${currentHero.tmdbId}/1/1`;

    props.play(streamId);
    navigate('/stream');
  }, [currentHero, props, navigate]);

  const rails = useMemo(
    () => (Array.isArray(homeSections.rails) && homeSections.rails.length > 0 ? homeSections.rails : [
      { title: 'TOP 10', items: data.slice(0, 10) },
      { title: 'Popular Movies', items: data.filter((item) => item.type === 'movie').slice(0, 20) },
      { title: 'Popular Shows', items: data.filter((item) => item.type === 'tv').slice(0, 20) },
      { title: 'Top Rated', items: data.filter((item) => item.type === 'movie').slice(20, 40) },
      { title: 'Action Movies', items: data.filter((item) => item.category.includes('Action')).slice(0, 20) },
      { title: 'Comedy Movies', items: data.filter((item) => item.category.includes('Comedy')).slice(0, 20) },
      { title: 'New Episodes', items: data.filter((item) => item.type === 'tv').slice(20, 40) },
    ]),
    [data, homeSections.rails]
  );

  const railKeys = useMemo(
    () => [...rails.map((rail, index) => `${rail.title}-${index}`), 'Studio'],
    [rails]
  );

  const { scrollState, setTrackRef, onRailScroll, handleRailScroll } = useRailScroll(railKeys);

  const studios = useMemo(
    () =>
      STUDIO_COLLECTIONS.map((studio) => {
        const titles = filterByStudioCollection(data, studio.key);
        const sample = titles[0] || data[0];
        return {
          color: studio.color,
          studio: studio.label,
          img: studio.img,
          bg: studio.bg,
          himg: studio.img,
        };
      }),
    [data]
  );

  if (props.loading) {
    return (
      <div className="min-h-screen bg-black text-white" id="homepage">
        <Skeleton type="banner" />
        <div className="px-4 sm:px-6 md:px-12 mt-4 space-y-8">
          {[1, 2, 3, 4, 5].map((section) => (
            <Skeleton key={section} type="section" count={10} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white" id="homepage">
      {/* ===== HERO BANNER ===== */}
      <section className="relative w-full h-[64vh] sm:h-[75vh] md:h-[85vh] lg:h-[90vh] overflow-hidden">
        {/* Background art — two device-specific layers, swapped purely by
            CSS breakpoint (no JS matchMedia reflow, no flash on resize) */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center block md:hidden transition-[background-image] duration-700 ease-in-out"
            style={currentHero?.name ? { backgroundImage: `url(${currentHero.name})` } : undefined}
          />
          <div
            className="absolute inset-0 bg-cover bg-center hidden md:block transition-[background-image] duration-700 ease-in-out"
            style={currentHero?.img ? { backgroundImage: `url(${currentHero.img})` } : undefined}
          />
        </div>
        {/* Gradient overlay for fade effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {/* Trending pill */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 sm:top-6 md:top-8 md:left-8 md:translate-x-0">
          <span className="px-3 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider bg-red-600 text-white rounded-full shadow-lg">
            🔥 Now Trending
          </span>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-16 sm:bottom-20 left-0 w-full p-4 sm:p-6 md:p-12 lg:p-16 flex flex-col items-start gap-3 sm:gap-4 max-w-full sm:max-w-lg md:max-w-2xl">
          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            {currentHero?.category?.slice(0, 2).map((tag) => (
              <span key={tag} className="px-3 py-1 text-xs font-medium bg-white/20 backdrop-blur-md rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg line-clamp-2">
            {currentHero?.name2}
          </h1>

          <p className="hidden sm:block text-sm md:text-base text-gray-300 max-w-xl line-clamp-3">
            {currentHero?.desc}
          </p>

          <div className="flex gap-2 sm:gap-3 mt-1 sm:mt-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={playHero}
              className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 bg-white text-black font-semibold text-sm sm:text-base rounded hover:bg-gray-200 active:scale-95 transition"
            >
              <span className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-black" />
              Watch Now
            </button>
            <button
              type="button"
              onClick={() => openWatch(currentHero?.id)}
              className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 bg-gray-600/80 text-white font-semibold text-sm sm:text-base rounded hover:bg-gray-500/80 active:scale-95 transition backdrop-blur-md"
              title="More Info"
            >
              ⓘ More Info
            </button>
          </div>
        </div>

        {/* Prev / Next arrows — desktop only; mobile relies on the dots + autoplay */}
        <button
          type="button"
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-black/50 text-white text-2xl hover:bg-black/80 transition"
          aria-label="Previous featured title"
          onClick={() => setHeroIndex((heroIndex - 1 + mediaData.length) % mediaData.length)}
        >
          ‹
        </button>
        <button
          type="button"
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-black/50 text-white text-2xl hover:bg-black/80 transition"
          aria-label="Next featured title"
          onClick={() => setHeroIndex((heroIndex + 1) % mediaData.length)}
        >
          ›
        </button>

        {/* Progress dots */}
        <div className="absolute bottom-16 sm:bottom-20 md:bottom-28 left-1/2 -translate-x-1/2 flex gap-2">
          {mediaData.slice(0, 5).map((_, i) => (
            <button
              key={i}
              type="button"
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${heroIndex % 5 === i ? 'bg-red-600 w-6 sm:w-7' : 'bg-white/50 hover:bg-white/80 w-2 sm:w-2.5'
                }`}
              onClick={() => setHeroIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <div className="px-4 sm:px-6 md:px-12 lg:px-14 xl:px-16 -mt-16 sm:-mt-20 md:-mt-24 relative z-10 space-y-8 sm:space-y-10">
        <Suspense fallback={<Skeleton type="section" count={10} />}>
          {rails.map((rail, index) => {
            const railKey = `${rail.title}-${index}`;
            const isTop10 = rail.title === 'TOP 10';
            const visibleItems = rail.items.filter((item) => Number(item.rating.toFixed(0)) !== 0);

            return (
              <RailRow
                key={railKey}
                title={rail.title}
                railKey={railKey}
                items={visibleItems}
                scrollState={scrollState}
                setTrackRef={setTrackRef}
                onRailScroll={onRailScroll}
                handleRailScroll={handleRailScroll}
                eager={index === 0}
                renderItem={(item, idx) =>
                  isTop10 ? (
                    <div className="relative">
                      <div className="absolute -top-2 -left-2 text-4xl sm:text-5xl md:text-7xl font-extrabold text-white/20 select-none z-10">
                        {idx + 1}
                      </div>
                      <Card
                        sow={openWatch}
                        id={item.id}
                        img={item.name}
                        name={item.name2}
                        type={item.type}
                        rating={item.rating}
                      />
                    </div>
                  ) : (
                    <Card
                      sow={openWatch}
                      id={item.id}
                      img={item.name}
                      name={item.name2}
                      type={item.type}
                      rating={item.rating}
                    />
                  )
                }
              />
            );
          })}

          {/* Studios rail */}
          <RailRow
            title="Studios"
            railKey="Studio"
            items={studios}
            scrollState={scrollState}
            setTrackRef={setTrackRef}
            onRailScroll={onRailScroll}
            handleRailScroll={handleRailScroll}
            renderItem={(item) => (
              <Card2
                color={item.color}
                bg={item.img}
                himg={item.himg}
                img={item.img}
                studio={item.studio}
                stu={() => props.stu(item.studio, item.bg)}
              />
            )}
          />

          <Footer />
        </Suspense>
      </div>

      {/* Watch component (modal) */}
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
          name={watchItem?.nameImg2 || watchItem?.name2}
          name2={watchItem?.name}
          yr={watchItem?.releaseYear}
          ua={watchItem?.ua}
          season={watchItem?.season}
          lan={watchItem?.language?.length || 0}
          desc={watchItem?.desc}
          cat={watchItem?.category}
          language={watchItem?.language}
          rating={watchItem?.rating}
          add={props.add}
          e={props.e}
          play={props.play}
        />
      )}
    </div>
  );
}

export default React.memo(Home);