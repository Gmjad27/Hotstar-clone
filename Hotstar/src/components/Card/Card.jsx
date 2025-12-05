import React from 'react'
import styles from './Card.module.css'
import Watch from '../Watch/Watch'
import { Data } from '../../content/movie'

const Card = (props) => {
  return (
    <div className={styles.card} style={{ backgroundImage: `url(${props.img})` }} onClick={()=>{props.sow(props.id)}
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
    }>

      <div className={styles.info}>
        <div className={styles.img} style={{ backgroundImage: `url(${props.img})`, marginBottom: '5px' }}>

        </div>
        <div className={styles.btn}>
          <button className={styles.play}><i className="fa-solid fa-play"></i> Watch Now</button>
          <button className={styles.add}>+</button>
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
