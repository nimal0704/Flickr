import React from 'react'
import { useState } from 'react'
import Search from './components/Search.jsx'
import MovieCard from './components/movie-card/MovieCard.jsx'
import { useEffect } from "react";
import { getTrending, getNowPlaying } from "./api/tmdb";


const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [trending, setTrending] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);

  useEffect(() => {
      getTrending()
        .then(data => setTrending(data.results))
        .catch(err => console.error(err));
  
      getNowPlaying()
        .then(data => setNowPlaying(data.results))
        .catch(err => console.error(err));
    },
         []);

  return (
      <div className="wrapper">
        <header>
          <h1>Your next <span className="text-gradient">favorite</span> movie, in seconds.</h1>
        </header>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        <h2 style={{ color: "#fff", marginBottom: "20px", marginTop:"20px" }}>🔥 Trending</h2>
        <div className="grid">
          {trending.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={(movie) => console.log("clicked:", movie.title)}
            />
          ))}
        </div>
        <h2 style={{ color: "#fff", marginBottom: "20px", marginTop:"20px" }}>🍿 Playing Now</h2>
        <div className="grid">
          {nowPlaying.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={(movie) => console.log("clicked:", movie.title)}
            />
          ))}
        </div>
      </div> 
  )
}

export default App