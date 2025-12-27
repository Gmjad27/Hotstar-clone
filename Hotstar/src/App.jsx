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
import Login from "./pages/Auth/Login";
// import Card2 from "./components/Card/Card2";
import Studio from "./pages/Studio/Studio";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import "./App.css";
import Signup from "./pages/Auth/Signup";
import Profile from "./pages/Profile/Profile";

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

  const [Img, setImg] = useState('')
  const [studio, setStudio] = useState('')
  const sow = (stud, img) => {
    // alert(img);
    setStudio(stud)
    setImg(img)
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
              }} />
            </>
          } e={El} />
          <Route path="/movies" element={
            <>
              <Nav />
              <Movie />
            </>
          } />
          <Route path="/tv" element={
            <>
              <Nav />
              <Tv />
              {/* <Login /> */}
            </>
          } />

          <Route path="/search" element={
            <>
              <Nav />
              <Search />
              {/* <Signup /> */}
            </>
          } />
          <Route path="/studio" element={
            <>
              <Nav />
              <Studio studio={studio} img={Img} />
            </>
          } />
          <Route path="/profile" element={
            <>
              <Nav />
              <Profile E={El} />
            </>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

      </Router>
      <h1 className="owner">Made by Girish</h1>
    </>
  );
}

export default App;
