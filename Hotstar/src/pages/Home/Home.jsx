import { useEffect, useState } from "react";
import Banner from "../../components/Banner/Banner";
import { mediaData } from "../../content/contect";
import { studio } from "../../content/contect";
import Card from "../../components/Card/Card";
// import Nav from "../../components/Nav/Nav";
import Watch from "../../components/Watch/Watch";
import Footer from "../../components/Footer/Footer";
import { Data } from '../../content/movie'
import Card2 from "../../components/Card/Card2";
// import "../../App.css";
import "./Home.css"





// watch.style.display = 'block';

// export const sow = (id) => {
//   // alert(id);
//   call(id);

// }

function Home(props) {

    const id = mediaData.map(item => item.id);
    const type = mediaData.map(item => item.type);
    const tid = mediaData.map(item => item.tmdbId);
    const images = mediaData.map(item => item.img);
    const name = mediaData.map(item => item.nameImg);
    // const name2 = Data.map(item => item.name2);
    const I = mediaData.map(item => item.name)
    const lan = mediaData.map(item => item.language);
    const ua = mediaData.map(item => item.ua);
    const ry = mediaData.map(item => item.releaseYear);
    const category = mediaData.map(item => item.category);
    const desc = mediaData.map(item => item.desc);
    const season = mediaData.map(item => item.season);




    const [index, setIndex] = useState(0);
    const [ID, setID] = useState();
    const [TID, setTID] = useState();
    const [Type, setType] = useState();

    const [i, seti] = useState()
    const [Name, setName] = useState();
    const [Lan, setLan] = useState();
    const [UA, setUA] = useState();
    const [RY, setRY] = useState();
    const [Cat, setCat] = useState();
    const [Desc, setDesc] = useState();
    const [Season, setSeason] = useState();

    // const [w, setW] = useState([{


    //     id: 1,
    //     img: "https://img10.hotstar.com/image/upload/f_auto,q_auto/sources/r1/cms/prod/8834/808834-i",
    //     nameImg: "https://img10.hotstar.com/image/upload/f_auto/sources/r1/cms/prod/1202/1371202-t-8b12119920aa",
    //     name: "https://img10.hotstar.com/image/upload/f_auto/sources/r1/cms/prod/5589/675589-h",
    //     name2: 'Zootopia',
    //     releaseYear: 2016,
    //     ua: "U/A 7+",
    //     season: "1h 48m",
    //     language: ["English", "Hindi", "Spanish", " German", "Japanese", "Tamil", "Korean"],
    //     desc: "Judy Hopps, the first rabbit police officer, is determined to solve a dangerous case.",
    //     category: ["Kids", "Family"],
    //     type: "movie",
    //     studio: "Disney"
    // }]);

    const [img, setImg] = useState('https://img10.hotstar.com/image/upload/f_auto,q_auto/sources/r1/cms/prod/8834/808834-i')
    const [nameImg, setNameImg] = useState("https://img10.hotstar.com/image/upload/f_auto/sources/r1/cms/prod/1202/1371202-t-8b12119920aa")
    const [Name2, setName2] = useState()

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
                setName2(keys.name2)
                setReleaseYear(keys.releaseYear)
                setUa(keys.ua)
                setSea(keys.season)
                setLang(keys.language)
                setDe(keys.desc)
                setCate(keys.category)

            }
        })
        const watch = document.querySelector('#watch');
        watch.style.display = 'block';
        // const trailer = document.getElementById('trailer');
        // trailer.style.display = 'block';


    }


    useEffect(() => {

        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % images.length); // loop smoothly
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    useEffect(() => {
        const body = document.querySelector(".body");
        const d1 = document.getElementById('img1');
        const d2 = document.getElementById('img2');
        const d3 = document.getElementById('img3');
        const d4 = document.getElementById('img4');
        const d5 = document.getElementById('img5');

        if (body) {


            body.style.backgroundImage = `url(${images[index]})`;
            if (index === 0) {
                d5.style.border = 'none';
                d1.style.border = '2px solid';
            }
            else if (index === 1) {
                d2.style.border = '2px solid';
                d1.style.border = 'none';
            }
            else if (index === 2) {
                d3.style.border = '2px solid';
                d2.style.border = 'none';
            }
            else if (index === 3) {
                d4.style.border = '2px solid';
                d3.style.border = 'none';
            }
            else {
                d5.style.border = '2px solid';
                d4.style.border = 'none';
            }
            // if (index === 4) {d5.style.border = '2px solid'; d4.style.border = 'none';}


            // body.style.transition = "background-image 1s ease-out";
            setName(name[index]);
            setType(type[index])
            setID(id[index])
            setTID(tid[index])
            seti(I[index])
            setLan(lan[index].length)
            setUA(ua[index])
            setRY(ry[index])
            setCat(category[index])
            setDesc(desc[index])
            setSeason(season[index])
        }
    }, [index, images]);





    return (
        <div className="body" id="body">


            {/* <Nav /> */}

            <div className="bundle">

                <div className="con">
                    {/* <div className="body" id="body"> */}

                    <Banner id={ID} tid={TID} type={Type} name={Name} i={i} imgs={images} lan={Lan} ua={UA} ry={RY} cat={Cat} desc={Desc} season={Season} add={(e) => { props.add(e) }} play={(tid) => { props.play(tid) }} />

                    {/* </div> */}
                </div>
                {/* <br /><br /><br /><br /><br /> */}
                <div className="content" style={{

                }}>
                    {
                        Data.map((keys) => {

                            if (keys.id >= 41 && keys.id <= 56) return <Card sow={(i) => {
                                sow(i);
                            }} id={keys.id} img={keys.name} ry={keys.releaseYear} ua={keys.ua} lan={keys.language.length} desc={keys.desc} s={keys.season} type={keys.type} tid={keys.tmdbId} add={(e) => { props.add(e) }} e={props.e} play={(tid) => { props.play(tid) }} />
                        })
                    }

                </div>
                <section className="sections">
                    <h2 className="title">Kids</h2>
                    <div className="content">
                        {
                            Data.map((keys) => {
                                if (keys.category.includes('Kids')) {
                                    return <Card sow={(i) => {
                                        sow(i);
                                    }} id={keys.id} img={keys.name} ry={keys.releaseYear} ua={keys.ua} lan={keys.language.length} desc={keys.desc} s={keys.season} type={keys.type} tid={keys.tmdbId} add={(e) => { props.add(e) }} e={props.e} play={(tid) => { props.play(tid) }} />
                                }

                            })
                        }

                    </div>
                </section>
                <section className="sections">
                    <h2 className="title">For You</h2>
                    <div className="content">
                        {
                            Data.map((keys) => {
                                if (keys.id >= 21 && keys.id <= 30) {
                                    return <Card sow={(i) => {
                                        sow(i);
                                    }} id={keys.id} img={keys.name} ry={keys.releaseYear} ua={keys.ua} lan={keys.language.length} desc={keys.desc} s={keys.season} type={keys.type} tid={keys.tmdbId} add={(e) => { props.add(e) }} e={props.e} play={(tid) => { props.play(tid) }} />
                                }

                            })
                        }

                    </div>
                </section>
                <section className="sections">
                    <h2 className="title">Action</h2>
                    <div className="content">
                        {
                            Data.map((keys) => {
                                if (keys.id >= 31 && keys.id <= 40) {
                                    return <Card sow={(i) => {
                                        sow(i);
                                    }} id={keys.id} img={keys.name} ry={keys.releaseYear} ua={keys.ua} lan={keys.language.length} desc={keys.desc} s={keys.season} type={keys.type} tid={keys.tmdbId} add={(e) => { props.add(e) }} e={props.e} play={(tid) => { props.play(tid) }} />
                                }

                            })
                        }

                    </div>
                </section>
                <section className="sections">
                    <h2 className="title">Shuperhero</h2>
                    <div className="content">
                        {
                            Data.map((keys) => {
                                if (keys.category.includes('Superhero')) {
                                    return <Card sow={(i) => {
                                        sow(i);
                                    }} id={keys.id} img={keys.name} ry={keys.releaseYear} ua={keys.ua} lan={keys.language.length} desc={keys.desc} s={keys.season} type={keys.type} tid={keys.tmdbId} add={(e) => { props.add(e) }} e={props.e} play={(tid) => { props.play(tid) }} />
                                }
                            })
                        }

                    </div>
                </section>
                <section className="sections">
                    <h2 className="title">Sci-fi</h2>
                    <div className="content">
                        {
                            Data.map((keys) => {
                                if (keys.category.includes('Sci-Fi')) {
                                    return <Card sow={(i) => {
                                        sow(i);
                                    }} id={keys.id} img={keys.name} ry={keys.releaseYear} ua={keys.ua} lan={keys.language.length} desc={keys.desc} s={keys.season} type={keys.type} tid={keys.tmdbId} add={(e) => { props.add(e) }} e={props.e} play={(tid) => { props.play(tid) }} />
                                }
                            })
                        }

                    </div>
                </section>
                <section className="sections">
                    <h2 className="title">Netflix</h2>
                    <div className="content">
                        {
                            Data.map((keys) => {
                                if (keys.studio.includes('Netflix')) {
                                    return <Card sow={(i) => {
                                        sow(i);
                                    }} id={keys.id} img={keys.name} ry={keys.releaseYear} ua={keys.ua} lan={keys.language.length} desc={keys.desc} s={keys.season} type={keys.type} tid={keys.tmdbId} add={(e) => { props.add(e) }} e={props.e} play={(tid) => { props.play(tid) }} />
                                }
                            })
                        }

                    </div>
                </section>
                <section className="sections">
                    {/* <h2 className="title">Kids</h2> */}
                    <div className="content">
                        {
                            Data.map((keys) => {
                                if (keys.id >= 71 && keys.id <= 80) {
                                    return <Card sow={(i) => {
                                        sow(i);
                                    }} id={keys.id} img={keys.name} ry={keys.releaseYear} ua={keys.ua} lan={keys.language.length} desc={keys.desc} s={keys.season} type={keys.type} tid={keys.tmdbId} add={(e) => { props.add(e) }} e={props.e} play={(tid) => { props.play(tid) }} />
                                }
                            })
                        }

                    </div>
                </section>
                <section className="sections2">
                    {
                        studio.map((key) => {
                            return <Card2 bg={key.bg} himg={key.himg} img={key.img} studio={key.studio} stu={() => {
                                props.stu(key.studio, key.img)
                            }} />
                        })
                    }
                </section>
                <Footer />
            </div>


            <Watch img={img} name={nameImg} name2={Name2} yr={releaseYear} ua={Ua} season={Sea} lan={lang.length} desc={de} cat={cat} language={lang} />



        </div>
    );
}

export default Home;
