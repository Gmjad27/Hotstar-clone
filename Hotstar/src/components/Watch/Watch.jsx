import React, { useState, useEffect } from 'react'
import styles from './Watch.module.css'

// import Zotopia from '../../assets/zootopia.mp4'




const close = () => {
    const watch = document.getElementById('watch');
    watch.style.display = 'none';
}

const Watch = (props) => {


    const [videoId, setVideoId] = useState(null);
    const getTrailerId = async () => {
        const res = await fetch(
            // `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${props.name2}+trailer&type=video&key=AIzaSyAWkoWUtb540XbGGINhQQkLVl-WpHjXzfI&maxResults=1`
        );

        const data = await res.json();
        // alert(data.items[0].id.videoId)
        return data.items[0].id.videoId;
    };

    useEffect(() => {
        // alert(props.name2)
        getTrailerId().then(setVideoId);
    }, [props.name2]);

    return (
        <div className={styles.con} id='watch'>
            <div className={styles.cl} onClick={() => {
                close();
            }}></div>

            <div className={styles.watch}>

                <div className={styles.sec1} style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.51)), url('${props.img}')` }}>
                    <div className={styles.trailer}>
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=0&playlist=${videoId}&modestbranding=0&showinfo=0&rel=0&iv_load_policy=0&fs=0&disablekb=0`}
                            width="100%"
                            height="500"
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen={false}
                        />

                    </div>
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
