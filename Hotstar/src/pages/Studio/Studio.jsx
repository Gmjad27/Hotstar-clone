import React from 'react'
import styles from './Studio.module.css'
import { Data } from '../../content/movie'
import Card from '../../components/Card/Card'


const Studio = (props) => {
  return (
    <div className={styles.con}>
      <div className={styles.sec1} style={{ backgroundImage: `url(${props.img})` }}></div>
      <div className={styles.sec2}>
        {
          Data.map((keys) => {
            if (keys.studio.toLowerCase().includes(props.studio)) {
              return <Card sow={(i) => {
                sow(i);
              }} id={keys.id} img={keys.name} ry={keys.releaseYear}
                ua={keys.ua} lan={keys.language.length} desc={keys.desc}
                s={keys.season} type={keys.type} tid={keys.tmdbId}
                add={(e) => { props.add(e) }} e={props.e} play={(tid) => { props.play(tid) }}
              />
            }
          })
        }
      </div>
    </div>
  )
}

export default Studio
