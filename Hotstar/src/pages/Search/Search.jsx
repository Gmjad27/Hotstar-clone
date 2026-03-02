import React, { useMemo, useState, useEffect } from 'react';
import Card from '../../components/Card/Card';
import { Data } from '../../content/movie';
import styles from './search.module.css';
import Watch from '../../components/Watch/Watch';
import { data, useNavigate } from 'react-router-dom';

const DEFAULT_WATCH_ITEM = Data[0];
// const [WatchItem, setWatchItem] = useState(second)
const TRENDING_QUERIES = [
  'Action',
  'Sci-Fi',
  'Thriller',
  'Marvel',
  'Netflix',
  'Comedy',
  'Adventure',
];

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
  const navigate = useNavigate();
  const [watchItem, setWatchItem] = useState(DEFAULT_WATCH_ITEM);

  // const openWatch = (id) => {
  //   const selected = Data.find((item) => item.id === id);
  //   if (!selected) return;

  //   setWatchItem(selected);
  //   const watch = document.querySelector('#watch');
  //   if (watch) watch.style.display = 'block';
  // };
  /////////////////////////////////////////////////////////////////
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
  ////////////////////////////////////////////////////////////////////////////

  const normalizedQuery = query.trim().toLowerCase();

  const rankedResults = useMemo(() => {
    if (!normalizedQuery) return [];

    return Data.map((item) => ({ item, score: scoreItem(item, normalizedQuery) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || b.item.releaseYear - a.item.releaseYear)
      .map((entry) => entry.item);
  }, [normalizedQuery]);

  const movieResults = rankedResults.filter((item) => item.type === 'movie');
  const seriesResults = rankedResults.filter((item) => item.type === 'tv');
  const trendingItems = Data.slice(0, 20);

  const renderRow = (items) => (
    <div className={styles.rowTrack}>
      {items.map((item) => (
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
      ))}
    </div>
  );

  return (
    <div className={styles.con}>
      <div className={styles.extra}></div>
      <div className={styles.shell}>
        <div className={styles.searchHeader}>
          <div className={styles.searchWrap}>
            <i className={`fa-solid fa-magnifying-glass ${styles.icon}`}></i>
            <input
              type="text"
              className={styles.search}
              placeholder="Titles, people, genres"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          {!normalizedQuery && (
            <div className={styles.tags}>
              {TRENDING_QUERIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={styles.tag}
                  onClick={() => setQuery(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        {normalizedQuery ? (
          <>
            <p className={styles.meta}>
              {rankedResults.length} result{rankedResults.length === 1 ? '' : 's'} for "{query}"
            </p>

            {movieResults.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.title}>Movies</h2>
                {renderRow(movieResults)}
              </section>
            )}

            {seriesResults.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.title}>Series</h2>
                {renderRow(seriesResults)}
              </section>
            )}

            {rankedResults.length === 0 && (
              <div className={styles.empty}>
                <h3>No matches found</h3>
                <p>Try a different title, genre, language, or studio.</p>
              </div>
            )}
          </>
        ) : (
          <section className={styles.section}>
            <h2 className={styles.title}>Trending Now</h2>
            {renderRow(trendingItems)}
          </section>
        )}
      </div>

      {
        Data.map((key) => {
          <p>,</p>
          return `, ${key.name2} `
        })
      }

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

export default Search;
