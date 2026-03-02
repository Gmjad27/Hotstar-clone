import React, { useMemo, useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Studio.module.css';
import { Data } from '../../content/movie';
import Card from '../../components/Card/Card';
import Watch from '../../components/Watch/Watch';

const DEFAULT_WATCH_ITEM = Data[0];

const Studio = (props) => {
  const navigate = useNavigate();
  const [watchItem, setWatchItem] = useState(DEFAULT_WATCH_ITEM);

  const studioName = String(props.studio || '').trim();
  const filteredData = useMemo(() => {
    const selectedStudio = studioName.toLowerCase();
    if (!selectedStudio) return [];
    return Data.filter((item) =>
      String(item.studio || '').toLowerCase().includes(selectedStudio)
    );
  }, [studioName]);

  const featured = filteredData[0] || null;

  const rails = useMemo(() => {
    if (filteredData.length === 0) return [];
    return [
      { title: 'Popular on This Studio', items: filteredData.slice(0, 18) },
      {
        title: 'Action & Adventure',
        items: filteredData.filter((item) =>
          item.category.some((c) => ['Action', 'Adventure', 'Superhero'].includes(c))
        ),
      },
      {
        title: 'Drama & Thriller',
        items: filteredData.filter((item) =>
          item.category.some((c) => ['Drama', 'Thriller', 'Mystery'].includes(c))
        ),
      },
      {
        title: 'Family & Fun',
        items: filteredData.filter((item) =>
          item.category.some((c) => ['Kids', 'Family', 'Comedy', 'Animation'].includes(c))
        ),
      },
    ].filter((rail) => rail.items.length > 0);
  }, [filteredData]);

  // const openWatch = (id) => {
  //   const selected = Data.find((item) => item.id === id);
  //   if (!selected) return;

  //   setWatchItem(selected);
  //   const watch = document.querySelector('#watch');
  //   if (watch) watch.style.display = 'block';
  // };
/////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////



  const playFeatured = () => {
    if (!featured) return;
    const streamId =
      featured.type === 'movie'
        ? `${featured.type}/${featured.tmdbId}`
        : `${featured.type}/${featured.tmdbId}/1/1`;
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
      <section
        className={styles.hero}
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.35)), url(${props.img || featured?.img || ''})`,
        }}
      >
        <div className={styles.heroContent}>
          <p className={styles.badge}>STUDIO COLLECTION</p>
          <h1 className={styles.heading}>{studioName || 'Studio'}</h1>
          <p className={styles.meta}>
            {filteredData.length} title{filteredData.length === 1 ? '' : 's'} available
          </p>
          <p className={styles.desc}>
            Curated films and series from {studioName || 'this studio'}.
          </p>
      
        </div>
      </section>

      {filteredData.length === 0 ? (
        <section className={styles.emptyState}>
          <h2>No titles found for this studio.</h2>
          <p>Try opening another studio from Home.</p>
        </section>
      ) : (
        <div className={styles.rails}>
          {rails.map((rail) => (
            <section className={styles.section} key={rail.title}>
              <h2 className={styles.title}>{rail.title}</h2>
              <div className={styles.track}>{rail.items.map(renderCard)}</div>
            </section>
          ))}
        </div>
      )}

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

export default Studio;
