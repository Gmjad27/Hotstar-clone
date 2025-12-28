import { useEffect, useState } from "react";
// import Banner from "./components/Banner/Banner";
// import { mediaData } from "./content/contect";
// import Card from "./components/Card/Card";
import Nav from "./components/Nav/Nav";
// import Watch from "./components/Watch/Watch";
// import Footer from "./components/Footer/Footer";
// import { Data } from './content/movie'
import Home from "./pages/Home/Home";
import Movie from "./pages/Movies/Movie";
import Tv from "./pages/TV/Tv";
import Search from './pages/Search/Search'
// import Login from "./pages/Auth/Login";
// import Card2 from "./components/Card/Card2";
import Studio from "./pages/Studio/Studio";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import "./App.css";
// import Signup from "./pages/Auth/Signup";
import Profile from "./pages/Profile/Profile";
import Stream from "./pages/Stream/Stream";

// watch.style.display = 'block';


function App() {


  // let E = [];

  // Data.map((key)=>{
  //   console.log(key.name2);

  // })



  const [El, setEl] = useState(() => {
    const saved = localStorage.getItem('El');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('El', JSON.stringify(El));
  }, [El]);




  const add = (e) => {
    alert('added to ' + e);

    setEl(prevEl => {
      if (prevEl.includes(e)) {
        console.log('Removed:', e);
        return prevEl.filter(item => item !== e);
      } else {
        console.log('Added:', e);
        return [...prevEl, e];
      }
    });
  };

  const [Img, setImg] = useState(() => {
    const save = localStorage.getItem('IMG');
    return save ? JSON.parse(save) : [];
  })
  const [studio, setStudio] = useState(() => {
    const save = localStorage.getItem('STUDIO');
    return save ? JSON.parse(save) : [];
  })

  useEffect(() => {
    localStorage.setItem('IMG', JSON.stringify(Img));
    localStorage.setItem('STUDIO', JSON.stringify(studio));
  }, [Img, studio])

  const sow = (stud, img) => {

    setStudio(stud)
    setImg(img)
  }



  const [TID, setTID] = useState(() => {

    const save = localStorage.getItem('TID');
    return save ? JSON.parse(save) : [];

  })

  useEffect(() => {
    localStorage.setItem('TID', JSON.stringify(TID))
  }, [TID]);

  // const [tid, setTid] = useState()
  const play = (tid) => {
    alert(tid);
    setTID(tid);
  }

  return (
    <>
      <Router>

        <Routes>
          <Route path='/' element={
            <>
              <Nav />
              <Home stu={(stud, img) => {
                sow(stud, img)
              }} add={(e) => {
                add(e);
              }}
                play={(tid) => {
                  play(tid)
                }} />
            </>
          } />
          <Route path="/movies" element={
            <>
              <Nav />
              <Movie
                tu={(stud, img) => {
                  sow(stud, img)
                }} add={(e) => {
                  add(e);
                }}
                play={(tid) => {
                  play(tid)
                }}
              />
            </>
          } />
          <Route path="/tv" element={
            <>
              <Nav />
              <Tv
                tu={(stud, img) => {
                  sow(stud, img)
                }}
                add={(e) => {
                  add(e);
                }}
                play={(tid) => {
                  play(tid)
                }}
              />
              {/* <Login /> */}
            </>
          } />

          <Route path="/search" element={
            <>
              <Nav />
              <Search
                tu={(stud, img) => {
                  sow(stud, img)
                }} add={(e) => {
                  add(e);
                }}
                play={(tid) => {
                  play(tid)
                }}
              />
              {/* <Signup /> */}
            </>
          } />
          <Route path="/studio" element={
            <>
              <Nav />
              <Studio studio={studio} img={Img}
                tu={(stud, img) => {
                  sow(stud, img)
                }}
                add={(e) => {
                  add(e);
                }}
                play={(tid) => {
                  play(tid)
                }}
              />
            </>
          } />
          <Route path="/profile" element={
            <>
              <Nav />
              <Profile
                E={El}
                tu={(stud, img) => {
                  sow(stud, img)
                }}
                add={(e) => {
                  add(e);
                }}
                play={(tid) => {
                  play(tid)
                }}
              />
            </>
          } />
          <Route path="/stream" element={
            <Stream tid={TID} />
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

      </Router>
      <h1 className="owner">Made by Girish</h1>
    </>
  );
}

export default App;
