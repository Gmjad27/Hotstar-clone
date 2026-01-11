import React, { useState, useEffect, useRef } from 'react'
import styles from './Watch.module.css'
import { useNavigate } from 'react-router-dom';
import { Data } from '../../content/movie';
import Card from '../Card/Card';

const Watch = (props) => {
    let i = 0;
    const navigate = useNavigate();
    // const [seasonKey, setSeasonKey] = useState("");
    const [videoId, setVideoId] = useState(null);
    const [showTrailer, setShowTrailer] = useState(false);
    const iframeRef = useRef(null);
    const [ep, setep] = useState('s1')
    // setep()
    // iframeRef.current.src = '';
    const closeWatch = () => {
        setep('s1')
        // console.log('s1');

        const watch = document.getElementById('watch');
        const trailer = document.getElementById('trailer');

        // Stop the video by removing and re-adding the iframe
        if (iframeRef.current) {
            const src = iframeRef.current.src;
            // alert("video stoped.")
            iframeRef.current.src = '';
            iframeRef.current.src = src.replace('autoplay=1', 'autoplay=0');
        }

        watch.style.display = 'none';
        trailer.style.display = 'none';
    }

    const getTrailerId = async () => {
        const res = await fetch(
            // `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${props.name2}+trailer&type=video&key=AIzaSyAWkoWUtb540XbGGINhQQkLVl-WpHjXzfI&maxResults=1`
        );

        const data = await res.json();
        return data.items[0].id.videoId;
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            const src = iframeRef.current.src;

            iframeRef.current.src = src.replace('autoplay=0', 'autoplay=1');
            setTimeout(() => {
                const trailer = document.getElementById('trailer');
                if (trailer) {
                    trailer.style.display = 'block';
                }
            }, [3000]);
        }, 3000);

        getTrailerId().then(setVideoId);

        // Cleanup function
        return () => {
            clearTimeout(timer);
        };
    }, [props.name2]);

    // Handle iframe load and add event listener for video end
    useEffect(() => {
        if (!videoId || !showTrailer) return;

        const handleMessage = (event) => {
            if (event.origin !== 'https://www.youtube.com') return;

            let data;
            try {
                data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            } catch (e) {
                return;
            }

            // Listen for state change events
            if (data.event === 'onStateChange') {
                // State 0 = video ended
                if (data.info === 0) {
                    setShowTrailer(false);
                }
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [videoId, showTrailer]);

    return (
        <div className={styles.con} id='watch'>
            <div className={styles.cl} onClick={closeWatch}></div>

            <div className={styles.watch}>
                <div className={styles.sec1} style={{ backgroundImage: `url('${props.img}')` }}>
                    {/* <div>
                        <iframe
                            id='trailer'
                            ref={iframeRef}
                            className={styles.trailer}
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&loop=1&mute=0&controls=0&enablejsapi=1&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&fs=1&disablekb=0`}
                            width="100%"
                            height="500"
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen={true}
                        />
                    </div> */}

                    <div className={styles.psec}>
                        <img src={props.name} className={styles.name} alt={props.mname} />
                        <div className={styles.info}>
                            <span>{props.yr}</span>
                            <span>{props.ua}</span>
                            <span>{props.season}</span>
                            <span>{props.lan} Languages</span>
                        </div>
                        <div className={styles.desc}>{props.desc}</div>

                        <div className={styles.cat}>
                            {props.cat?.map((key, index) => (
                                <span key={index}>{key}</span>
                            ))}
                        </div>
                        <div className={styles.lan}>
                            {props.language?.map((key, index) => (
                                <span key={index} className={styles.lang}>{key}</span>
                            ))}
                        </div>

                        <div className={styles.btns}>
                            <button className={styles.play} onClick={() => {
                                props.play(props.type === 'movie' ? `${props.type}/${props.id}` : `${props.type}/${props.id}/1/1`);
                                navigate(`/stream?${props.mname}`)
                            }}>Watch Now</button>
                            <button className={styles.add}>+</button>
                        </div>
                    </div>
                </div>
                <div className={styles.con2}>
                    {

                        props.type === 'tv' ?

                            // return (
                            // {setep()}
                            <>
                                <select  name="" onChange={(e) => {
                                    setep(e.target.value);
                                }} className={styles.select}>
                                    {

                                        Object.keys(props.s || {}).map((key, index) => (
                                            <option key={key} value={key}>
                                                SEASON-{index + 1}
                                            </option>
                                        ))
                                    }

                                </select>
                                {ep && (
                                    <>
                                        <p className={styles.pa}>Episodes: {props.s[ep]}</p>


                                        {
                                            Array.from({ length: props.s[ep] }).map((_, i) => (
                                                <div className={styles.epi} key={i}>EPISODE {i + 1}</div>
                                            ))
                                        }

                                    </>
                                )}
                            </>
                            // )
                            :
                            <section className="sections">
                                <h2 className="title">More like</h2>
                                <div className="content">{
                                    Data.map((keys, index) => {

                                        if (props.mname !== keys.name2) {

                                            if (keys.category.includes(props.cat[0])) {
                                                return (

                                                    <Card key={index} sow={(i) => {
                                                        sow(i);
                                                    }} id={keys.id} img={keys.name} name={keys.name2} ry={keys.releaseYear} ua={keys.ua} lan={keys.language.length} desc={keys.desc} s={keys.season} type={keys.type} tid={keys.tmdbId} add={(e) => { props.add(e) }} e={props.e} play={(tid) => { props.play(tid) }} />
                                                )
                                            }
                                        }
                                        // else {
                                        //     if (keys.category.includes(props.cat[0])) {
                                        //         return (
                                        //             <Card sow={(i) => {
                                        //                 sow(i);
                                        //             }} id={keys.id} img={keys.name} name={keys.name2} ry={keys.releaseYear} ua={keys.ua} lan={keys.language.length} desc={keys.desc} s={keys.season} type={keys.type} tid={keys.tmdbId} add={(e) => { props.add(e) }} e={props.e} play={(tid) => { props.play(tid) }} />
                                        //         )
                                        //     }
                                        // }

                                    })
                                }
                                </div>
                            </section>
                    }
                    {
                        // Object.keys(props.s || {}).map((keys, index) => {
                        // console.log(ep)

                        // })
                    }
                </div>
            </div>
        </div>
    )
}

export default Watch