import React, { useState } from 'react'
import Card from '../../components/Card/Card'
import { Data } from '../../content/movie'
import styles from './search.module.css'
import Watch from '../../components/Watch/Watch'


const Search = (props) => {


    const [img, setImg] = useState('https://img10.hotstar.com/image/upload/f_auto,q_auto/sources/r1/cms/prod/8834/808834-i')
    const [nameImg, setNameImg] = useState("https://img10.hotstar.com/image/upload/f_auto/sources/r1/cms/prod/1202/1371202-t-8b12119920aa")
    const [Name2, setName2] = useState()
    const [Tid, setTid] = useState()
    const [Tp, setTp] = useState()
    const [ep, setep] = useState()

    const [Seasons, setSeasons] = useState()
    const [releaseYear, setReleaseYear] = useState(2016)
    const [Ua, setUa] = useState("U/A 7+")
    const [Sea, setSea] = useState("1h 48m")
    const [lang, setLang] = useState(["English", "Hindi", "Spanish", " German", "Japanese", "Tamil", "Korean"])
    const [de, setDe] = useState("Judy Hopps, the first rabbit police officer, is determined to solve a dangerous case.",)
    const [cat, setCate] = useState(["Kids", "Family"])

    const sow = (id) => {
        Data.map((keys) => {
            if (keys.id === id) {
                setImg(keys.img)
                setNameImg(keys.nameImg)
                setTid(keys.tmdbId)
                setTp(keys.type)
                setName2(keys.name2)
                setReleaseYear(keys.releaseYear)
                setUa(keys.ua)
                setSea(keys.season)
                setLang(keys.language)
                setDe(keys.desc)
                setCate(keys.category)
                setSeasons(keys.episodes);
                setep('s1')

            }
        })
        const watch = document.querySelector('#watch');
        watch.style.display = 'block';
        // const trailer = document.getElementById('trailer');
        // trailer.style.display = 'block';


    }


    const [s, setS] = useState(null)
    // const search = (e) =>{
    //     setS(e);
    // }
    return (
        <div className={styles.con}>
            <h1 className={styles.h}>SEARCH</h1>

            <div className={styles.con2}>
                <div className={styles.section1}>
                    <input type="text" className={styles.search} placeholder='Search your test...' onChange={(e) => {
                        // console.log(e.target.value);
                        if (e.target.value === "") setS(null);
                        else setS(e.target.value.toLowerCase());

                    }} />
                    {/* <button className={styles.btn}>SEARCH</button> */}
                </div>

                {/* <h1 style={{ color: 'white' }}>{s}</h1> */}
                <div className={styles.section2}>
                    {
                        Data.map((keys) => {
                            if (keys.name2.toLowerCase().includes(s)) return <Card sow={(i) => {
                                sow(i);
                            }} id={keys.id} img={keys.name} ry={keys.releaseYear} ua={keys.ua} lan={keys.language.length} desc={keys.desc} s={keys.season} type={keys.type} tid={keys.tmdbId} add={(e) => { props.add(e) }} e={props.e} play={(tid) => { props.play(tid) }} />
                        })
                    }
                </div>
            </div>
            <Watch img={img} ep={ep} type={Tp} id={Tid} s={Seasons} mname={Name2} name={nameImg} name2={Name2} yr={releaseYear} ua={Ua} season={Sea} lan={lang.length} desc={de} cat={cat} language={lang} add={(e) => { props.add(e) }} e={props.e} play={(tid) => { props.play(tid) }} />
            {/* {
                Data.map((keys) => {
                    if (keys.type.includes('tv')) {
                        return <p style={{ color: 'white' }}>{keys.name2}</p>
                    }
                })
            } */}
        </div>
    )
}

export default Search
