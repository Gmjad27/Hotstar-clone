import React from 'react';
import { useNavigate } from 'react-router-dom';

const Card = (props) => {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const poster = props.img || '';

  const openWatch = () => {
    if (typeof props.sow === 'function') {
      props.sow(props.id, props.type);
    }
  };

  return (
    <div
      className={`
        relative flex-shrink-0 w-36 md:w-44 lg:w-52 aspect-[2/3] 
        bg-cover bg-center rounded-md overflow-hidden cursor-pointer 
        transition-transform duration-200 hover:scale-105 hover:z-10
        shadow-lg hover:shadow-2xl border border-white/10
      `}
      style={{
        backgroundImage: `url(${poster}), linear-gradient(to top left, rgba(17,17,25,0.8), rgba(17,17,25,0.8))`
      }}
      onClick={openWatch}
      title={props.name}
    >
      {/* Fallback title when no poster */}
      {!poster && (
        <div className="absolute inset-0 flex items-center justify-center p-2 text-center text-white text-xs md:text-sm font-semibold bg-black/60 backdrop-blur-sm">
          <span className="line-clamp-3">{props.name}</span>
        </div>
      )}

      {/* Rating badge */}
      <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[10px] md:text-xs font-bold text-yellow-400 bg-black/70 backdrop-blur-sm rounded-sm">
        {props.rating?.toFixed(1)}
      </div>
    </div>
  );
};

export default React.memo(Card);