import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mediaData, studio } from '../../content/contect';
import Card from '../../components/Card/Card';
import Watch from '../../components/Watch/Watch';
import Footer from '../../components/Footer/Footer';
import { Data } from '../../content/movie';
import Card2 from '../../components/Card/Card2';
import './Home.css';

const DEFAULT_WATCH_ITEM = Data[0];

function Home(props) {
  const media = window.matchMedia('(max-width: 480px)');

  const navigate = useNavigate();
  const location = useLocation();
  const [heroIndex, setHeroIndex] = useState(0);
  const [watchItem, setWatchItem] = useState(DEFAULT_WATCH_ITEM);

  const currentHero = mediaData[heroIndex] || mediaData[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % mediaData.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const openWatch = (id) => {
    const selected = Data.find((item) => item.id === id);
    if (!selected) return;

    setWatchItem(selected);
    const watch = document.querySelector('#watch');
    // const home = document.querySelector('#homepage');
    if (watch) watch.style.display = 'block';
    // if (watch) document.body.style.overflow = 'hidden';
    // if (watch) document.body.classList.add("stop");

    // if (watch) home.style.overflow = 'hidden';

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
    // if (watch) document.body.classList.add("stop");

  }, [location.search]);

  const playHero = () => {
    if (!currentHero) return;
    const streamId =
      currentHero.type === 'movie'
        ? `${currentHero.type}/${currentHero.tmdbId}`
        : `${currentHero.type}/${currentHero.tmdbId}/1/1`;

    props.play(streamId);
    navigate('/stream');
  };

  const rails = useMemo(
    () => [
      { title: 'Continue Watching', items: Data.filter((item) => item.id >= 41 && item.id <= 56) },
      { title: 'Kids & Family', items: Data.filter((item) => item.category.includes('Kids') || item.category.includes('Family')) },
      { title: 'For You', items: Data.filter((item) => item.id >= 21 && item.id <= 40) },
      { title: 'Superhero Universe', items: Data.filter((item) => item.category.includes('Superhero')) },
      { title: 'Sci-Fi Worlds', items: Data.filter((item) => item.category.includes('Sci-Fi') || item.category.includes('Fantasy')) },
      { title: 'Thrillers', items: Data.filter((item) => item.category.includes('Thriller')) },
      { title: 'Netflix Picks', items: Data.filter((item) => item.studio.includes('Netflix')) },
    ],
    []
  );

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
    <div className="homePage" id="homepage">
      <section
        className="heroBanner"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.88), rgba(0,0,0,0.2)), url(${media.matches ? currentHero?.mimg : currentHero?.img || ''})`,
        }}
      >
        <div className="heroContent">
          <p className="heroBadge">{currentHero?.type === 'tv' ? 'SERIES' : 'MOVIE'}</p>
          <img
            src={currentHero?.nameImg}
            alt={currentHero?.name2 || 'Featured'}
            className="heroTitleImage"
          />
          <p className="heroMeta">
            • {currentHero?.releaseYear} • {currentHero?.ua} • {currentHero?.season}
          </p>
          <p className="heroDescription">{currentHero?.desc}</p>
          <div className="heroActions">
            <button type="button" className="playAction" onClick={playHero}>
              <i className="fa-solid fa-play"></i> Play
            </button>
            <button
              type="button"
              className="infoAction"
              onClick={() => openWatch(currentHero?.id)}
            >
              More Info
            </button>
          </div>
          <div className="heroThumbs">
            {mediaData.slice(0, 5).map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`thumb ${heroIndex % 5 === index ? 'thumbActive' : ''}`}
                style={{ backgroundImage: `url(${item.name})` }}
                onClick={() => setHeroIndex(index)}
                aria-label={item.name2}
              ></button>
            ))}
          </div>
        </div>
      </section>

      <div className="homeShell">
        {rails.map((rail) => (
          <section className="homeSection" key={rail.title}>
            <h2 className="homeTitle">{rail.title}</h2>
            {/* <div className="layer1"> */}
            <div className="homeTrack">{rail.items.map(renderCard)}</div>
            {/* </div> */}
          </section>
        ))}

        <section className="homeSection">
          <h2 className="homeTitle">Studios</h2>
          <div className="studioTrack">
            {studio.map((item) => (
              <Card2
                key={item.studio}
                bg={item.bg}
                himg={item.himg}
                img={item.img}
                studio={item.studio}
                stu={() => props.stu(item.studio, item.img)}
              />
            ))}
          </div>
        </section>

        <Footer />
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
}

export default Home;
