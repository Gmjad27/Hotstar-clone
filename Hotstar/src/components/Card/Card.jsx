import React, { useState } from 'react'
import styles from './Card.module.css'
// import Watch from '../Watch/Watch'
// import { Data } from '../../content/movie'
import { Link } from 'react-router-dom'
// import Movie from '../../pages/Movies/Movie'

const Card = (props) => {

  const [add, setAdd] = useState("+")
  const added = () => {
    setAdd(add === "+" ? "✓" : "+");

  }

  const md = window.matchMedia("(max-width: 768px)");


  return (
    <div className={styles.card} style={{ backgroundImage: `url(${props.img}), linear-gradient(to top left,#1119,#1119)` }}
      // {
      // props.sow

      // alert('hello')
      // const watch = document.querySelector('#watch');
      // Data.map((keys) => {
      //   if (keys.id == props.id) {
      //     console.log(keys);

      //     return <Watch img={keys.img} name={keys.nameImg} yr={keys.releaseYear} ua={keys.ua} season={keys.season} lan={keys.language.length} desc={keys.desc} cat={keys.category} language={keys.language} />
      //   }
      // })
      // watch.style.display = 'block';

      // }
      onClick={() => { md.matches ? props.sow(props.id) : '' }}
    >

      {
        props.img === '' ? <h1 className={styles.mname}>{props.name}</h1> : ''
      }


      <div className={styles.info}>
        <div className={styles.img} style={{ backgroundImage: `url(${props.img}),linear-gradient(to top left,#1119,#1119)`, marginBottom: '5px' }} onClick={() => { props.sow(props.id) }}>

        </div>
        <div className={styles.btn}>
          <Link to={`/stream?gm_${props.type === 'movie' ? `${props.type}/${props.name}` : `${props.type}/${props.name}/1/1`}`}>
            <button className={styles.play} onClick={() => {
              props.play(props.type === 'movie' ? `${props.type}/${props.tid}` : `${props.type}/${props.tid}/1/1`)
            }}><i className="fa-solid fa-play"></i> Watch Now</button>
          </Link>
          <input type='button' value={add} id='add' className={styles.add} onClick={() => {
            // alert(props.e)
            props.add(props.id);
            // added();
          }} />
        </div>
        <div className={styles.info2}>
          <span>{props.ry}</span>
          <span>{props.ua}</span>
          <span>{props.s}</span>
          <span>{props.lan} language</span>
        </div>
        <div className={styles.desc2}>{props.desc}</div>

      </div>
    </div >
  )
}

export default Card
