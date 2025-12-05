import React, { useState } from 'react'
import styles from './Watch.module.css'




const close = () => {
    const watch = document.getElementById('watch');
    watch.style.display = 'none';
}

const Watch = (props) => {
    return (
        <div className={styles.con} id='watch'>
            <div className={styles.cl} onClick={() => {
                close();
            }}></div>

            <div className={styles.watch}>

                <div className={styles.sec1} style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.51)), url('${props.img}')` }}>
                    <div className={styles.psec}>
                        <img src={props.name} className={styles.name}></img>
                        <div className={styles.info}>
                            <span> {props.yr} </span>
                            <span> {props.ua}</span>
                            <span> {props.season}</span>
                            <span> {props.lan} Languages</span>
                        </div>
                        <div className={styles.desc}>{props.desc}</div>

                        <div className={styles.cat}>
                            {
                                props.cat.map((keys) => {
                                    return <span>{keys}</span>
                                })
                            }
                        </div>
                        <div className={styles.lan}>
                            {
                                props.language.map((keys) => {
                                    return <span>{keys}</span>
                                })
                            }
                        </div>

                        <div className={styles.btns}>
                            <button className={styles.play}>Watch Now</button>
                            <button className={styles.add}>+</button>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Watch
