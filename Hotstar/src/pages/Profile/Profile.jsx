import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './profile.module.css';
import { Data } from '../../content/movie';
import Card from '../../components/Card/Card';
import Footer from '../../components/Footer/Footer';
import Watch from '../../components/Watch/Watch';

const DEFAULT_WATCH_ITEM = Data[0];

const Profile = (props) => {
  const navigate = useNavigate();
  const [watchItem, setWatchItem] = useState(DEFAULT_WATCH_ITEM);

  const username = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch (error) {
      return {};
    }
  }, []);

  const watchListItems = useMemo(() => {
    if (!Array.isArray(props.E)) return [];
    return Data.filter((item) => props.E.includes(item.id));
  }, [props.E]);

  const movieItems = watchListItems.filter((item) => item.type === 'movie');
  const seriesItems = watchListItems.filter((item) => item.type === 'tv');

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


  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const renderRail = (items) => (
    <div className={styles.track}>
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
    <>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.info}>
            <div className={styles.p_img}></div>
            <div>
              <p className={styles.label}>PROFILE</p>
              <h1 className={styles.name}>{String(username?.name || 'Guest')}</h1>
              <p className={styles.sub}>Manage your saved titles and continue watching.</p>
            </div>
          </div>

          <div className={styles.actions}>
            <div className={styles.stat}>
              <span>{watchListItems.length}</span>
              <p>Watchlist</p>
            </div>
            <div className={styles.stat}>
              <span>{movieItems.length}</span>
              <p>Movies</p>
            </div>
            <div className={styles.stat}>
              <span>{seriesItems.length}</span>
              <p>Series</p>
            </div>
            <button type="button" className={styles.logout} onClick={logout}>
              Logout
            </button>
          </div>
        </section>

        {watchListItems.length === 0 ? (
          <section className={styles.empty}>
            <h2>Your watchlist is empty</h2>
            <p>Add titles from Home, Movies, TV, or Search to see them here.</p>
            <button type="button" onClick={() => navigate('/search')}>
              Explore Titles
            </button>
          </section>
        ) : (
          <div className={styles.rails}>
            {movieItems.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.heading}>Saved Movies</h2>
                {renderRail(movieItems)}
              </section>
            )}

            {seriesItems.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.heading}>Saved Series</h2>
                {renderRail(seriesItems)}
              </section>
            )}

            <section className={styles.section}>
              <h2 className={styles.heading}>All Watchlist</h2>
              {renderRail(watchListItems)}
            </section>
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
      <Footer />
    </>
  );
};

export default Profile;
