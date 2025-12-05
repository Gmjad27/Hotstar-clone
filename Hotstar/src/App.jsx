import { useEffect, useState } from "react";
import Banner from "./components/Banner/Banner";
import { mediaData } from "./content/contect";
import Card from "./components/Card/Card";
import Nav from "./components/Nav/Nav";
import Watch from "./components/Watch/Watch";
import Footer from "./components/Footer/Footer";
import { Data } from './content/movie'
import Home from "./pages/Home/Home";
import Movie from "./pages/Movies/Movie";
import Tv from "./pages/TV/Tv";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import "./App.css";





// watch.style.display = 'block';

// export const sow = (id) => {
//   // alert(id);
//   call(id);

// }

function App() {
  // Extract all image URLs from mediaData


  return (
    <>
      <Router>

        <Routes>
          <Route path='/' element={
            <>
              <Nav />
              <Home />
            </>
          } />
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
            </>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

      </Router>
    </>
  );
}

export default App;
