import React, { useEffect, useMemo, useState } from 'react';
import styles from './Watch.module.css';
import { useNavigate } from 'react-router-dom';
import { Data } from '../../content/movie';
import Card from '../Card/Card';

const getSeasonNumber = (seasonKey) => {
  const parsed = Number(String(seasonKey).replace('s', ''));
  return Number.isNaN(parsed) || parsed <= 0 ? 1 : parsed;
};

const Watch = (props) => {
  const navigate = useNavigate();
  const seasonKeys = Object.keys(props.s || {});
  const [ep, setEp] = useState(seasonKeys[0] || 's1');

  useEffect(() => {
    setEp(seasonKeys[0] || 's1');
  }, [props.mname, seasonKeys.join(',')]);

  const closeWatch = () => {
    setEp(seasonKeys[0] || 's1');

    const watch = document.getElementById('watch');
    const trailer = document.getElementById('trailer');

    if (watch) watch.style.display = 'none';
    if (trailer) trailer.style.display = 'none';
    // if (watch) document.body.style.overflow = 'auto';
    // if (watch) document.body.classList.remove("stop");

    if (typeof props.onClose === 'function') props.onClose();
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeWatch();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handlePlayNow = () => {
    const streamId =
      props.type === 'movie'
        ? `${props.type}/${props.id}`
        : `${props.type}/${props.id}/1/1`;

    props.play(streamId);
    navigate(`/stream?name=${props.mname}&tmdb=${props.id}`);
  };

  const onSelectSeason = (event) => {
    setEp(event.target.value);
  };

  const selectedSeason = getSeasonNumber(ep);
  const episodeCount = props.s?.[ep] || 0;

  const related = useMemo(() => {
    const mainCategory = props.cat?.[0];
    if (!mainCategory) return [];

    return Data.filter(
      (item) =>
        item.name2 !== props.mname &&
        Array.isArray(item.category) &&
        item.category.includes(mainCategory)
    ).slice(0, 18);
  }, [props.cat, props.mname]);

  const renderMoreLikeThis = () => (
    <section className={styles.relatedSection}>
      <h2 className={styles.relatedTitle}>More Like This</h2>
      <div className={styles.relatedTrack}>
        {related.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (typeof props.sow === 'function') {
                props.sow(item.id);
              }
            }}
          >
            <Card
              sow={props.sow || (() => { })}
              id={item.id}
              img={item.name}
              name={item.name2}
              ry={item.releaseYear}
              ua={item.ua}
              lan={item.language.length}
              desc={item.desc}
              s={item.season}
              type={item.type}
              tid={item.tmdbId}
              add={(value) => props.add(value)}
              e={props.e}
              play={(tid) => props.play(tid)}
            />
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className={styles.con} id="watch">

      <div className={styles.cl} onClick={closeWatch}></div>
      <button type="button" className={styles.close} onClick={closeWatch} aria-label="Close">
        <i className="fa-solid fa-xmark"></i>
      </button>

      <div className={styles.watch}>
        <div
          className={styles.sec1}
          style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.88), rgba(0,0,0,0.2)),url('${props.img}')` }}
        >
          <div className={styles.psec}>
            <img src={props.name} className={styles.name} alt={props.mname} />
            <div className={styles.info}>
              <span>{props.yr}</span>
              <span>{props.ua}</span>
              <span>{props.season}</span>
              <span>{props.lan} Languages</span>
            </div>
            <div className={styles.desc}>{props.desc}</div>

            <div className={styles.cat}>
              {props.cat?.map((key) => (
                <span key={key}>{key}</span>
              ))}
            </div>
            <div className={styles.lan}>
              {props.language?.map((key) => (
                <span key={key} className={styles.lang}>
                  {key}
                </span>
              ))}
            </div>

            <div className={styles.btns}>
              <button className={styles.play} onClick={handlePlayNow}>
                {props.type === 'movie' ? 'Play Now' : 'Play First Episode'}
              </button>
              <button
                className={styles.add}
                style={{
                  backgroundColor: props.El === 'ADDED' ? '#ff27e242' : '#48484878',
                }}
                onClick={() => props.add(props.sid)}
                aria-label={
                  props.El === 'ADDED' ? 'Added to list' : 'Add to list'
                }
              >
                {props.El === 'ADDED' ? <i className="fa-solid fa-check"></i> : '+'}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.con2}>
          {props.type === 'tv' && seasonKeys.length > 0 && (
            <>
              <h3 className={styles.episodeTitle}>Episodes</h3>
              <select value={ep} onChange={onSelectSeason} className={styles.select}>
                {seasonKeys.map((key, index) => (
                  <option className={styles.option} key={key} value={key}>
                    SEASON-{index + 1}
                  </option>
                ))}
              </select>

              <div className={styles.episods}>
                {Array.from({ length: episodeCount }).map((_, index) => (
                  <div
                    className={styles.epi}
                    key={index}
                    onClick={() => {
                      const streamId = `${props.type}/${props.id}/${selectedSeason}/${index + 1}`;
                      props.play(streamId);
                      navigate(
                        `/stream?name=${props.mname}&tmdb=${props.id}/${selectedSeason}/${index + 1}`
                      );
                    }}
                  >
                    EPISODE {index + 1}
                  </div>
                ))}
              </div>
            </>
          )}
          {renderMoreLikeThis()}
        </div>
      </div>
    </div>
  );
};

export default Watch;
