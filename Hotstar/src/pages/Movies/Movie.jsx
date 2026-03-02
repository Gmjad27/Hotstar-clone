import React, { useMemo, useState,useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './movie.module.css';
import Card from '../../components/Card/Card';
import Watch from '../../components/Watch/Watch';
import { Data } from '../../content/movie';

const DEFAULT_WATCH_ITEM = Data[0];

const Movie = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [watchItem, setWatchItem] = useState(DEFAULT_WATCH_ITEM);
  const movies = useMemo(() => Data.filter((item) => item.type === 'movie'), []);

  const featured = useMemo(() => {
    if (movies.length === 0) return null;
    return [...movies].sort((a, b) => b.releaseYear - a.releaseYear)[0];
  }, [movies]);

  const sections = useMemo(
    () => [
      { title: 'Trending Movies', items: movies.slice(0, 20) },
      { title: 'Action Blockbusters', items: movies.filter((item) => item.category.includes('Action') || item.category.includes('Superhero')) },
      { title: 'Thrillers', items: movies.filter((item) => item.category.includes('Thriller')) },
      { title: 'Sci-Fi & Fantasy', items: movies.filter((item) => item.category.includes('Sci-Fi') || item.category.includes('Fantasy')) },
      { title: 'Family & Animation', items: movies.filter((item) => item.category.includes('Family') || item.category.includes('Animation') || item.category.includes('Kids')) },
    ],
    [movies]
  );

  // const openWatch = (id) => {
  //   const selected = Data.find((item) => item.id === id);
  //   if (!selected) return;

  //   setWatchItem(selected);
  //   const watch = document.querySelector('#watch');
  //   if (watch) watch.style.display = 'block';
  // };
  ////////////////////////////////////////////////////////////////////////////////////
  const openWatch = (id) => {
    const selected = Data.find((item) => item.id === id);
    if (!selected) return;

    setWatchItem(selected);
    const watch = document.querySelector('#watch');
    if (watch) watch.style.display = 'block';
    navigate(`${location.pathname}?watch/id=${selected.id}&name=${selected.name2}`);
  };

  const clearWatchFromUrl = () => {
    navigate(location.pathname);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const watchId = Number(params.get('watch'));
    if (!watchId) return;

    const selected = Data.find((item) => item.id === watchId);
    if (!selected) return;

    setWatchItem(selected);
    const watch = document.querySelector('#watch');
    if (watch) watch.style.display = 'block';
  }, [location.search]);
  //////////////////////////////////////////////////////////////////////////////

  const playFeatured = () => {
    if (!featured) return;
    const streamId = `${featured.type}/${featured.tmdbId}`;
    props.play(streamId);
    navigate('/stream');
  };

  const renderCard = (item) => (
    <Card
      key={item.id}
      sow={openWatch}
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
      add={props.add}
      e={props.e}
      play={props.play}
    />
  );

  return (
    <div className={styles.page}>
      {featured && (
        <section
          className={styles.hero}
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.88), rgba(0,0,0,0.25)), url(${featured.img || featured.name})`,
          }}
        >
          <div className={styles.heroContent}>
            <p className={styles.badge}>FEATURED MOVIE</p>
            {/* <h1 className={styles.heading}>{featured.nameImg}</h1> */}
            <img className={styles.heading} src={featured.nameImg} alt={featured.name2} />
            <p className={styles.meta}>
              {featured.releaseYear} • {featured.ua} • {featured.season}
            </p>
            <p className={styles.desc}>{featured.desc}</p>
            <div className={styles.actions}>
              <button type="button" className={styles.playBtn} onClick={playFeatured}>
                <i className="fa-solid fa-play"></i> Play
              </button>
              <button
                type="button"
                className={styles.moreBtn}
                onClick={() => openWatch(featured.id)}
              >
                More Info
              </button>
            </div>
          </div>
        </section>
      )}

      <div className={styles.rails}>
        {sections.map((section) => (
          <section key={section.title} className={styles.section}>
            <h2 className={styles.title}>{section.title}</h2>
            <div className={styles.track}>{section.items.map(renderCard)}</div>
          </section>
        ))}
      </div>

      <Watch
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
        language={watchItem?.language}
        add={props.add}
        e={props.e}
        play={props.play}
      />
    </div>
  );
};

export default Movie;
