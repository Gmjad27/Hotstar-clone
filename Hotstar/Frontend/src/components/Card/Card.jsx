import React from 'react';
import styles from './Card.module.css';
import { Link, useNavigate } from 'react-router-dom';

const Card = (props) => {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const isAdded = Array.isArray(props.e) && props.e.includes(props.id);
  const navigate = useNavigate();
  const poster = props.img || '';
  const streamId =
    props.type === 'movie'
      ? `${props.type}/${props.tid}`
      : `${props.type}/${props.tid}/1/1`;

  const openWatch = () => {
    if (typeof props.sow === 'function') {
      props.sow(props.id, props.type);
    }
  };

  // const rating = props.rating?.toFixed(1);

  return (

    <div
      className={styles.card}
      style={{ backgroundImage: `url(${poster}), linear-gradient(to top left,#1119,#1119)` }}
      onClick={() => {
        openWatch();
        // navigate(`/watch?id=${props.id}&type=${props.type}`);
      }}
      title={props.name}
    >
      {/* {props.rank && (
        <div className={styles.rank}>{props.rank}</div>
      )} */}
      {poster === '' ? <h1 className={styles.mname}>{props.name}</h1> : ''}
      <h3 className={styles.rating}>{props.rating?.toFixed(1)}</h3>
      <div className={styles.info}>
        <div
          className={styles.img}
          style={{ backgroundImage: `url(${poster}),linear-gradient(to top left,#1119,#1119)` }}
          onClick={(event) => {
            event.stopPropagation();
            openWatch();
          }}

        ></div>
        <div className={styles.btn}>
          <Link to={`/stream?name=${props.name}&tmdb=${props.tid}`}>
            <button
              type="button"
              className={styles.play}
              onClick={(event) => {
                event.stopPropagation();
                props.play(streamId);
              }}
            >
              <i className="fa-solid fa-play"></i> Watch Now
            </button>
          </Link>
          <button
            type="button"
            id="add"
            className={styles.add}
            aria-label={isAdded ? 'Added to list' : 'Add to list'}
            onClick={(event) => {
              event.stopPropagation();
              props.add(props.id);
            }}
          >
            {isAdded ? <i className="fa-solid fa-check"></i> : '+'}
          </button>
        </div>
        <div className={styles.info2}>
          <span>{props.ry}</span>
          <span>{props.ua}</span>
          <span>{props.s}</span>
          <span>{props.lan} languages</span>
        </div>
        <div className={styles.desc2}>{props.desc}</div>
      </div>
    </div>
  );
};

export default Card;
