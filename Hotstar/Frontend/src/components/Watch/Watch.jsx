import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Card/Card';
import RailRow from '../RailRow/RailRow';
import { useRailScroll } from '../../hooks/useRailScroll';
import { fetchTMDBDetails, fetchTMDBSeasonDetails } from '../../content/tmdb.js';

const getSeasonNumber = (seasonKey) => {
  const parsed = Number(String(seasonKey).replace('s', ''));
  return Number.isNaN(parsed) || parsed <= 0 ? 1 : parsed;
};

const formatRuntime = (minutes) => {
  const totalMinutes = Number(minutes) || 0;
  if (!totalMinutes) return '';
  return `${totalMinutes}m`;
};

const Watch = (props) => {
  const navigate = useNavigate();
  const data = Array.isArray(props.data) ? props.data : [];
  const [details, setDetails] = useState(null);
  const [seasonDetails, setSeasonDetails] = useState(null);
  const [activeLang, setActiveLang] = useState(null);

  const effectiveEpisodes = details?.episodes || props.s || {};
  const seasonKeys = Object.keys(effectiveEpisodes);
  const effectiveSeasonKeys = props.type === 'tv' && seasonKeys.length === 0 ? ['s1'] : seasonKeys;
  const [ep, setEp] = useState(seasonKeys[0] || 's1');

  const { scrollState, setTrackRef, onRailScroll, handleRailScroll } = useRailScroll(['related']);

  // Load Main Details
  useEffect(() => {
    let active = true;
    const loadDetails = async () => {
      if (!props.type || !props.id) {
        if (active) setDetails(null);
        return;
      }
      try {
        const payload = await fetchTMDBDetails(props.type, props.id);
        if (active) setDetails(payload);
      } catch {
        if (active) setDetails(null);
      }
    };
    loadDetails();
    return () => { active = false; };
  }, [props.id, props.type]);

  // Set default active language when languages load
  useEffect(() => {
    const langs = details?.languages?.length ? details.languages : props.language;
    if (langs?.length && !activeLang) {
      setActiveLang(langs[0]);
    }
  }, [details, props.language]);

  // Reset Season Selection on Title Change
  useEffect(() => {
    setEp(effectiveSeasonKeys[0] || 's1');
  }, [props.mname, effectiveSeasonKeys.join(',')]);

  // Load Season Details (Episodes)
  useEffect(() => {
    let active = true;
    const loadSeasonDetails = async () => {
      if (props.type !== 'tv' || !props.id) {
        if (active) setSeasonDetails(null);
        return;
      }
      try {
        const payload = await fetchTMDBSeasonDetails(props.id, getSeasonNumber(ep));
        if (active) setSeasonDetails(payload);
      } catch {
        if (active) setSeasonDetails(null);
      }
    };
    loadSeasonDetails();
    return () => { active = false; };
  }, [ep, props.id, props.type]);

  const closeWatch = useCallback(() => {
    setEp(effectiveSeasonKeys[0] || 's1');
    const watch = document.getElementById('watch');
    if (watch) watch.style.display = 'none';
    if (typeof props.onClose === 'function') props.onClose();
  }, [effectiveSeasonKeys, props.onClose]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeWatch();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeWatch]);

  // Lock background scroll while the modal is open — prevents the page
  // behind it from jumping/scrolling on mobile while swiping inside rails.
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const selectedSeason = getSeasonNumber(ep);
  const episodeCount = effectiveEpisodes?.[ep] || (props.type === 'tv' ? 10 : 0);
  const shownDesc = details?.desc || props.desc;

  const episodeCards = useMemo(() => {
    if (Array.isArray(seasonDetails?.episodes) && seasonDetails.episodes.length > 0) {
      return seasonDetails.episodes;
    }
    return Array.from({ length: episodeCount }).map((_, index) => ({
      id: `${selectedSeason}-${index + 1}`,
      number: index + 1,
      name: `Episode ${index + 1}`,
      overview: shownDesc || 'Episode details are not available yet.',
      image: props.img,
      runtime: 0,
      airDate: '',
    }));
  }, [episodeCount, props.img, seasonDetails, selectedSeason, shownDesc]);

  const handlePlayNow = useCallback(() => {
    const streamId = props.type === 'movie' ? `${props.type}/${props.id}` : `${props.type}/${props.id}/1/1`;
    props.play(streamId);
    const queryData = {
      title: props.mname,
      type: props.type,
      tmdbId: props.id,
      currentSeason: selectedSeason,
      defaultImage: props.img,
      episodes: JSON.stringify(episodeCards)
    };
    const queryString = new URLSearchParams(queryData).toString();
    navigate(`/stream?name=${props.mname}&tmdb=${streamId}&${queryString}`);
  }, [props.type, props.id, props.play, props.mname, selectedSeason, props.img, episodeCards, navigate]);

  const onSelectSeason = useCallback((event) => {
    setEp(event.target.value);
  }, []);

  const seasonLabel = props.type === 'tv'
    ? details?.seasonLabel || `${effectiveSeasonKeys.length} Season${effectiveSeasonKeys.length > 1 ? 's' : ''}`
    : details?.seasonLabel || props.season;

  const year = details?.year;
  const mbg = details?.mbg;
  const logo = details?.nameImg2;
  const trailer = details?.trailerUrl;
  const shownCategories = details?.categories?.length ? details.categories : props.cat;
  const shownLanguages = details?.languages?.length ? details.languages : props.language;
  const shownLanguageCount = shownLanguages?.length || props.lan || 0;
  const shownAgeRating = details?.ageRating || props.ua || 'UA 13+';

  const cast = details?.cast || [];
  const mood = details?.mood || [];

  const related = useMemo(() => {
    const mainCategory = props.cat?.[0];
    if (!mainCategory) return [];
    return data
      .filter((item) =>
        item.name2 !== props.mname &&
        Array.isArray(item.category) &&
        item.category.includes(mainCategory)
      )
      .slice(0, 18);
  }, [data, props.cat, props.mname]);

  const renderRelatedCard = useCallback(
    (item) => (
      <Card
        sow={props.sow || (() => {})}
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
        add={(value) => props.add(value)}
        e={props.e}
        play={(tid) => props.play(tid)}
        onClick={() => {
          if (typeof props.sow === 'function') props.sow(item.id);
          const container = document.getElementById('container');
          container?.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    ),
    [props]
  );

  return (
    <div className="fixed inset-0 z-50" id="watch">
      {/* Overlay background */}
      <div className="absolute inset-0 bg-black/80" onClick={closeWatch}></div>

      {/* Close button */}
      <button
        type="button"
        className="absolute top-3 right-4 sm:top-4 sm:right-5 md:top-20 md:right-10 z-10 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/60 text-white text-lg sm:text-xl hover:bg-black/80 transition"
        onClick={closeWatch}
        aria-label="Close Modal"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>

      {/* Scrollable content */}
      <div className="relative h-full overflow-y-auto overscroll-contain bg-[#141414] text-white" id="container">
        {/* Hero Banner */}
        <div
          className="relative w-full h-[42vh] sm:h-[50vh] md:h-[70vh] bg-cover bg-center flex items-end pb-6 sm:pb-8"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.25) 30%, #141414 100%), url('${props.img || mbg}')`,
          }}
        >
          <div className="px-4 sm:px-6 md:px-12 w-full max-w-6xl mx-auto">
            {logo ? (
              <img src={logo} alt={props.mname} className="max-w-[160px] sm:max-w-[200px] md:max-w-[300px] object-contain" />
            ) : (
              <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold drop-shadow-lg">{props.mname}</h1>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 sm:px-6 md:px-12 mt-4 sm:mt-6 flex items-center gap-3 sm:gap-4 flex-wrap max-w-6xl mx-auto">
          <button
            className="flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 bg-white text-black text-sm sm:text-base font-semibold rounded hover:bg-gray-200 active:scale-95 transition"
            onClick={handlePlayNow}
          >
            <i className="fa-solid fa-play"></i>
            {props.type === 'movie' ? 'Play' : 'Play S1:E1'}
          </button>
          <button
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border-2 transition"
            style={{
              borderColor: props.El === 'ADDED' ? '#ffffff' : 'rgba(255,255,255,0.7)',
              backgroundColor: props.El === 'ADDED' ? 'rgba(255,255,255,0.1)' : 'transparent',
            }}
            onClick={() => props.add(props.sid)}
            aria-label={props.El === 'ADDED' ? 'Added to list' : 'Add to list'}
          >
            {props.El === 'ADDED' ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-plus"></i>}
          </button>
          <button className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border-2 border-white/30 text-white hover:border-white/70 transition" aria-label="Rate">
            <i className="fa-regular fa-thumbs-up"></i>
          </button>
        </div>

        {/* Two-Column Body */}
        <div className="px-4 sm:px-6 md:px-12 mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Left Column */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-green-500 font-semibold">
                {(parseFloat((props.rating || 0) / 10) * 100).toFixed(0)}% match
              </span>
              <span className="text-gray-300">{props.yr || year}</span>
              <span className="border border-white/40 px-1.5 py-0.5 text-xs font-bold text-white/80 rounded">HD</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="border border-white/40 px-2 py-0.5 text-xs font-semibold text-white/80">{shownAgeRating}</span>
              {shownCategories?.slice(0, 1).map((tag) => (
                <span key={tag} className="text-sm text-gray-300">{tag}</span>
              ))}
            </div>

            <p className="text-sm text-gray-200 leading-relaxed line-clamp-4">
              {shownDesc?.length > 180 ? `${shownDesc.substring(0, 180)}...` : shownDesc}
            </p>

            {/* Language strip */}
            {shownLanguages?.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {shownLanguages.map((lang) => (
                  <button
                    key={lang}
                    className={`px-3 py-1 text-xs border rounded-full transition ${activeLang === lang
                      ? 'bg-white text-black border-white'
                      : 'border-white/30 text-white/70 hover:border-white/60'
                      }`}
                    onClick={() => setActiveLang(lang)}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-3 sm:space-y-4 text-sm">
            {cast.length > 0 && (
              <div>
                <span className="text-gray-400">Cast: </span>
                <span className="text-gray-200">
                  {cast.slice(0, 8).map(actor => actor.name).join(', ')}
                  {cast.length > 8 ? '...' : ''}
                </span>
              </div>
            )}

            {shownCategories?.length > 0 && (
              <div>
                <span className="text-gray-400">Genres: </span>
                <span className="text-gray-200">{shownCategories.join(', ')}</span>
              </div>
            )}

            {mood.length > 0 && (
              <div>
                <span className="text-gray-400">This {props.type === 'movie' ? 'Movie' : 'Show'} is: </span>
                <span className="text-gray-200">{mood.join(', ')}</span>
              </div>
            )}

            <div>
              {props.type === 'tv' && seasonLabel ? (
                <>
                  <span className="text-gray-400">Seasons: </span>
                  <span className="text-gray-200">{seasonLabel}</span>
                </>
              ) : (
                details?.runtime && (
                  <>
                    <span className="text-gray-400">Run Time: </span>
                    <span className="text-gray-200">{formatRuntime(details.runtime)}</span>
                  </>
                )
              )}
            </div>

            <div>
              <span className="text-gray-400">Languages: </span>
              <span className="text-gray-200">{shownLanguageCount}</span>
            </div>
          </div>
        </div>

        {/* Episodes Section */}
        {props.type === 'tv' && effectiveSeasonKeys.length > 0 && (
          <div className="px-4 sm:px-6 md:px-12 mt-8 sm:mt-12 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Episodes</h3>
              <select
                value={ep}
                onChange={onSelectSeason}
                className="bg-black border border-white/30 text-white px-3 py-1.5 rounded-md text-sm focus:outline-none focus:border-white"
              >
                {effectiveSeasonKeys.map((key, index) => (
                  <option key={key} value={key}>
                    SEASON {index + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {episodeCards.map((episode, index) =>
                episode.runtime ? (
                  <div
                    key={episode.id || index}
                    className="flex gap-3 sm:gap-4 bg-black/40 rounded-lg overflow-hidden cursor-pointer hover:bg-black/60 active:bg-black/70 transition"
                    onClick={() => {
                      const episodeNumber = episode.number || index + 1;
                      const streamId = `${props.type}/${props.id}/${selectedSeason}/${episodeNumber}`;
                      props.play(streamId);
                      const queryData = {
                        title: props.mname,
                        type: props.type,
                        tmdbId: props.id,
                        currentSeason: selectedSeason,
                        defaultImage: props.img,
                        episodes: JSON.stringify(episodeCards),
                      };
                      const queryString = new URLSearchParams(queryData).toString();
                      navigate(`/stream?name=${props.mname}&tmdb=${streamId}&${queryString}`);
                    }}
                  >
                    <div
                      className="w-28 sm:w-40 md:w-48 h-20 sm:h-24 bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url('${episode.image || props.img}')` }}
                    ></div>
                    <div className="flex flex-col justify-center pr-3 sm:pr-4 py-2 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-semibold">
                          {index + 1}. {episode.name || `Episode ${index + 1}`}
                        </span>
                        {episode.runtime && (
                          <span className="text-xs text-gray-400">{formatRuntime(episode.runtime)}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">{episode.overview || 'Coming soon.'}</p>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}

        {/* More Like This & Trailer */}
        <div className="px-4 sm:px-6 md:px-12 mt-8 sm:mt-12 max-w-6xl mx-auto">
          {related.length > 0 && (
            <RailRow
              title="More Like This"
              railKey="related"
              items={related}
              scrollState={scrollState}
              setTrackRef={setTrackRef}
              onRailScroll={onRailScroll}
              handleRailScroll={handleRailScroll}
              eager
              renderItem={renderRelatedCard}
            />
          )}

          {trailer && (
            <div className="mt-8 sm:mt-12 rounded-xl overflow-hidden aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${trailer}?loop=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Watch);