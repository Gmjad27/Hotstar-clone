import React from 'react'
import styles from './Card.module.css'

const Card = (props) => {
  return (
    <div className={styles.card} style={{backgroundImage:`url(${props.img})`}}>
      
      <div className={styles.info}>
        <div className={styles.img} style={{backgroundImage:`url(${props.img})`}}>

        </div>
        <div className={styles.btn}>
          <button className={styles.play}><i class="fa-solid fa-play"></i> Watch Now</button>
          <button className={styles.add}>+</button>
        </div>
        <div className={styles.info2}>
          <span>{props.ry}</span>
          <span>{props.ua}</span>
          <span>{props.s}</span>
          <span>{props.lan}</span>
        </div>
        <div className={styles.desc2}>{props.desc}</div>
        
      </div>
    </div>
  )
}

export default Card
