import React, { useState } from 'react'
import styles from './Watch.module.css'

import Zotopia from '../../assets/zootopia.mp4'




const close = () => {
    const watch = document.getElementById('watch');
    watch.style.display = 'none';
}

const Watch = (props) => {
    // const videoDiv = document.getElementById('video');
    // setTimeout(() => {
    //   videoDiv.play().then(() => {
    //     // Fade the video in once it starts playing
    //     videoDiv.style.opacity = "1";
    //   }).catch(err => {
    //     console.error("Video play failed:", err);
    //   });
    // }, 1000);
    return (
        <div className={styles.con} id='watch'>
            <div className={styles.cl} onClick={() => {
                close();
            }}></div>

            <div className={styles.watch}>

                <div className={styles.sec1} style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.51)), url('${props.img}')` }}>
                    {/* <video id='video' className={styles.video} playsInline poster={props.img}>
                        <source src={Zotopia} />
                    </video> */}
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
                {/* <iframe src="https://speedostream1.com/embed-rltbjoo0u03e.html" frameborder="0" marginwidth="0" marginheight="0" scrolling="NO" width="640" height="360" allowfullscreen=""></iframe> */}
                {/* <iframe width="969" height="545" src="https://www.youtube.com/embed/PxjPg1C5V_8?list=RDdR9B_gPxjkk" title="Leo - Ordinary Person 8K/4K Video Song | Thalapathy Vijay | Trisha | Anirudh Ravichander" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> */}
            </div>

        </div>
    )
}

export default Watch
