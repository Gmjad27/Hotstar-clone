import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './stream.module.css';

const Stream = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const queryParams = new URLSearchParams(location.search);



  // Retrieve state passed from Watch.jsx navigate()
  const navState = location.state || {};
  const episodesString = queryParams.get('episodes');
  const passedEpisodes = JSON.parse(episodesString) || props.episodes || [];
  const defaultImage = queryParams.get('defaultImage') || props.img || '';
  const streamId = queryParams.get('tmdb') || props.tid || '';

  // Parse the incoming stream ID (e.g., "tv/12345/1/1" or "movie/12345")
  // Prioritize URL query, fallback to props

  const parts = streamId.split('/');
  const streamType = parts[0] ? parts[0].toLowerCase() : '';
  const id = parts[1] || '';

  // State for TV shows
  const [currentSeason, setCurrentSeason] = useState(parts[2] ? parseInt(parts[2]) : (Number(queryParams.get('currentSeason')) || 1));
  const [currentEpisode, setCurrentEpisode] = useState(parts[3] ? parseInt(parts[3]) : 1);

  // Dynamic Video Source
  const src = useMemo(() => {
    if (!streamType || !id) return '';
    if (streamType === 'tv') {
      return `https://player.videasy.net/tv/${id}/${currentSeason}/${currentEpisode}?color=D52E3C`;
    }
    return `https://player.videasy.net/movie/${id}?color=D52E3C`;
  }, [streamType, id, currentSeason, currentEpisode]);

  // Handle iframe resize safely
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update episode and URL without leaving the page
  const handleEpisodeChange = (episodeNum) => {
    setIsLoading(true);
    setCurrentEpisode(episodeNum);
    // Optionally update the URL to reflect the new episode
    navigate(`/stream?name=${navState.title || 'Stream'}&tmdb=tv/${id}/${currentSeason}/${episodeNum}`, {
      state: navState,
      replace: true
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.topBar}>
        <div className={styles.meta}>
          <p className={styles.title}>
            {navState.title ? `${navState.title.toUpperCase()}` : (streamType ? `${streamType.toUpperCase()} STREAM` : 'STREAM')}
          </p>
          {streamType === 'tv' && (
            <span className={styles.streamTag}>
              Season {currentSeason} | Episode {currentEpisode}
            </span>
          )}
        </div>
      </header>

      {src ? (
        <div className={styles.contentLayout}>
          {/* Main Video Player */}
          <div className={styles.playerWrapper}>
            <div className={styles.playerFrame}>
              {isLoading && <div className={styles.loader}>Loading stream...</div>}
              <iframe
                src={src}
                id="video-iframe"
                className="aspect-video w-full h-auto rounded-lg"
                width="100%"
                height={isDesktop ? "600" : "270"}
                frameBorder="0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title="Video Stream"
                onLoad={() => setIsLoading(false)}
              ></iframe>
            </div>
          </div>

          {/* Detailed TV Show Episode Sidebar */}
          {streamType === 'tv' && passedEpisodes.length > 0 && (
            <div className={styles.episodesSidebar}>
              <div className={styles.sidebarHeader}>
                <h3 className={styles.sidebarTitle}>Season {currentSeason}</h3>
                <p className={styles.epCount}>{passedEpisodes.length} Episodes</p>
              </div>

              <div className={styles.episodesList}>
                {passedEpisodes.map((episode, index) => {
                  const epNum = episode.number || index + 1;
                  const isActive = currentEpisode === epNum;

                  return (
                    <div
                      key={episode.id || epNum}
                      className={`${styles.detailedEpisodeCard} ${isActive ? styles.activeDetailed : ''}`}
                      onClick={() => handleEpisodeChange(epNum)}
                    >
                      <div
                        className={styles.epThumb}
                        style={{ backgroundImage: `url('${episode.image || defaultImage}')` }}
                      >
                        {isActive && <div className={styles.playingOverlay}><i className="fa-solid fa-play"></i></div>}
                      </div>

                      <div className={styles.epInfo}>
                        <h4 className={styles.epTitle}>
                          {epNum}. {episode.name || `Episode ${epNum}`}
                        </h4>
                        {episode.runtime > 0 && <span className={styles.epRuntime}>{episode.runtime}m</span>}
                        <p className={styles.epDesc}>
                          {episode.overview ? episode.overview : 'No description available.'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.emptyWrap}>
          <p className={styles.empty}>No stream selected.</p>
          <button type="button" className={styles.goHome} onClick={() => navigate('/')}>
            Browse Home
          </button>
        </div>
      )}
    </div>
  );
};

export default Stream;