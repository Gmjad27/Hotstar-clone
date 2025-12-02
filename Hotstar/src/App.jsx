import { useEffect, useState } from "react";
import Banner from "./components/Banner/Banner";
import { mediaData } from "./content/contect";
import Card from "./components/Card/Card";
import Nav from "./components/Nav/Nav";
import Footer from "./components/Footer/Footer";
import { Data } from './content/movie'
import "./App.css";


function App() {
  // Extract all image URLs from mediaData
  const images = mediaData.map(item => item.img);
  const name = mediaData.map(item => item.name);
  const lan = mediaData.map(item => item.language);
  const ua = mediaData.map(item => item.ua);
  const ry = mediaData.map(item => item.releaseYear);
  const category = mediaData.map(item => item.category);
  const desc = mediaData.map(item => item.desc);
  const season = mediaData.map(item => item.season);




  const [index, setIndex] = useState(0);
  const [Name, setName] = useState();
  const [Lan, setLan] = useState();
  const [UA, setUA] = useState();
  const [RY, setRY] = useState();
  const [Cat, setCat] = useState();
  const [Desc, setDesc] = useState();
  const [Season, setSeason] = useState();

  useEffect(() => {
    const body = document.getElementById("body");

    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % images.length); // loop smoothly
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const body = document.querySelector(".body");
    if (body) {


      body.style.backgroundImage = `url(${images[index]})`;
      // body.style.transition = "background-image 1s ease-out";
      setName(name[index]);
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
      <div className="nav">

        <Nav />
      </div>
      <div className="bundle">

        <div className="con">

          <Banner name={Name} lan={Lan} ua={UA} ry={RY} cat={Cat} desc={Desc} season={Season} />

        </div>
        <div className="content" style={{

        }}>
          {
            Data.map((keys) => {
              return <Card img={keys.name} ry={keys.releaseYear} ua={keys.ua} lan={keys.language.length} desc={keys.desc} s={keys.season}/>
            })
          }

        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
