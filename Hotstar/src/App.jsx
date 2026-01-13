import { useEffect, useState } from "react";
// import Banner from "./components/Banner/Banner";
// import { mediaData } from "./content/contect";
// import Card from "./components/Card/Card";
// import Nav from "./components/Nav/Nav";
import Nav from "./components/Nav/Nav";
// import Watch from "./components/Watch/Watch";
// import Footer from "./components/Footer/Footer";
// import { Data } from './content/movie'
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home/Home";
import Movie from "./pages/Movies/Movie";
import Tv from "./pages/TV/Tv";
import Search from './pages/Search/Search'
import Login from "./pages/Auth/Login";
// import Card2 from "./components/Card/Card2";
import Studio from "./pages/Studio/Studio";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import "./App.css";
import Signup from "./pages/Auth/Signup";
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
    // alert('added to ' + e);

    setEl(prevEl => {
      if (prevEl.includes(e)) {
        const alert = document.getElementById('alert-r');
        alert.style.right = '0px';
        setTimeout(() => {
          alert.style.right = '-400px';
        }, 2000);
        console.log('Removed:', e);
        return prevEl.filter(item => item !== e);
      } else {
        const alert = document.getElementById('alert');
        alert.style.right = '0px';
        setTimeout(() => {
          alert.style.right = '-400px';
        }, 2000);
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
    // alert(tid);
    setTID(tid);
  }

  return (
    <>

      <Router>
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />


          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <Nav />
                  <Home
                    stu={(stud, img) => sow(stud, img)}
                    add={(e) => add(e)}
                    play={(tid) => play(tid)}
                  />
                </>
              </ProtectedRoute>
            }
          />


          <Route
            path="/movies"
            element={
              <ProtectedRoute>
                <>
                  <Nav />
                  <Movie
                    tu={(stud, img) => sow(stud, img)}
                    add={(e) => add(e)}
                    play={(tid) => play(tid)}
                  />
                </>
              </ProtectedRoute>
            }
          />


          <Route
            path="/tv"
            element={
              <ProtectedRoute>
                <>
                  <Nav />
                  <Tv
                    tu={(stud, img) => sow(stud, img)}
                    add={(e) => add(e)}
                    play={(tid) => play(tid)}
                  />
                </>
              </ProtectedRoute>
            }
          />


          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <>
                  <Nav />
                  <Search
                    tu={(stud, img) => sow(stud, img)}
                    add={(e) => add(e)}
                    play={(tid) => play(tid)}
                  />
                </>
              </ProtectedRoute>
            }
          />


          <Route
            path="/studio"
            element={
              <ProtectedRoute>
                <>
                  <Nav />
                  <Studio
                    studio={studio}
                    img={Img}
                    tu={(stud, img) => sow(stud, img)}
                    add={(e) => add(e)}
                    play={(tid) => play(tid)}
                  />
                </>
              </ProtectedRoute>
            }
          />


          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <>
                  <Nav />
                  <Profile
                    E={El}
                    tu={(stud, img) => sow(stud, img)}
                    add={(e) => add(e)}
                    play={(tid) => play(tid)}
                  />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/stream"
            element={
              <ProtectedRoute>
                <Stream tid={TID} />
              </ProtectedRoute>
            }
          />


          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </Router>
      {/* <h1 className="owner">Made by Girish</h1> */}
      <div id="alert" className="alert">Added to Watch List</div>
      <div id="alert-r" className="alert" style={{ backgroundColor: '#730000b5' }}>Removed to Watch List</div>
    </>
  );
}

export default App;
