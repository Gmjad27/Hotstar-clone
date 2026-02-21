import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './stream.module.css';

const Stream = (props) => {
  const mediaQuery = window.matchMedia('(min-width: 480px)');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const streamId = props.tid || '';
  const src = useMemo(() => (streamId ? `https://vidsrc.cc/v2/embed/${streamId}` : ''), [streamId]);
  const streamType = streamId ? String(streamId).split('/')[0].toUpperCase() : '';

  return (
    <div className={styles.container}>
      {/* <br /><br /> */}
      <header className={styles.topBar}>
        <button type="button" className={styles.navBtn} onClick={() => navigate(-1)}>
          <i className="fa-solid fa-chevron-left"></i> Back
        </button>

        <div className={styles.meta}>
          <p className={styles.title}>{streamType ? `${streamType} STREAM` : 'STREAM'}</p>
          {streamId ? <span className={styles.streamTag}>{streamId}</span> : null}
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.navBtn} onClick={() => window.location.reload()}>
            <i className="fa-solid fa-rotate-right"></i> Reload
          </button>
          <button type="button" className={styles.navBtn} onClick={() => navigate('/')}>
            <i className="fa-solid fa-house"></i> Home
          </button>
        </div>
      </header>

      {src ? (
        <div className={styles.playerFrame}>
          <iframe
            src={src}
            className={styles.player}
            width="100%"
            height={mediaQuery.matches ? "770" : "270"}
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-same-origin allow-scripts allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-top-navigation-by-user-activation"
            title="VidsrcCC"
            onLoad={() => setIsLoading(false)}
          ></iframe>
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
