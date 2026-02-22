import React from 'react'
import { useState, useEffect } from 'react'
import Search from '../components/Search.jsx'
import MovieSection from '../components/MovieSection.jsx'
import MovieCard from '../components/MovieCard.jsx'
import useDebounce from "../hooks/useDebounce.js"
import { getTrending, getNowPlaying, getTopRated, getUpcoming, searchMovies } from "../api/tmdb.js";
import { useNavigate } from 'react-router-dom'


const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [trending, setTrending] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  const navigate = useNavigate();
  
  const debouncedSearch = useDebounce(searchTerm, 500);
  // Load Home Page data
   useEffect(() => {
    Promise.all([
      getTrending(),
      getNowPlaying(),
      getTopRated(),
      getUpcoming()
    ]).then(([trendData, nowData, topData, upData]) => {
      setTrending(trendData.results);
      setNowPlaying(nowData.results);
      setTopRated(topData.results);
      setUpcoming(upData.results);
    }).catch(console.error);
  }, []);

  useEffect(() => {
      if(!debouncedSearch.trim()){
        setSearchResults([]);
        return;
      }
      setSearching(true);
      searchMovies(debouncedSearch)
        .then(data => {
          setSearchResults(data.results);
          setSearching(false);
        })
        .catch(err => {
          console.error(err);
          setSearching(false);
        });
  },[debouncedSearch]);

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  return (
      <div className="wrapper">
      <header>
        <h1>Your next <span className="text-gradient">favorite</span> movie, in seconds.</h1>
      </header>

      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {searchTerm ? (
        <>
          <h2 className="mt-8 mb-4">
            🔍 Results for "{searchTerm}"
          </h2>
          {searching && <p className="text-gray-100">Searching...</p>}
          <div className="grid">
            {searchResults.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={handleMovieClick}
              />
            ))}
          </div>
            {!searching && searchResults.length === 0 && (
          <p className="text-gray-100 mt-10 text-center">
            No movies found for "{searchTerm}"
          </p>
          )}
  
        </>
      ) : (
        <>
         <MovieSection title="🔥 Trending"     movies={trending}   onMovieClick={handleMovieClick} />
          <MovieSection title="🍿 Now Playing"  movies={nowPlaying} onMovieClick={handleMovieClick} />
          <MovieSection title="🔝 Top Rated"    movies={topRated}   onMovieClick={handleMovieClick} />
          <MovieSection title="🗓️ Coming Soon"  movies={upcoming}   onMovieClick={handleMovieClick} />
        </>
      )}
    </div> 
  )
}

export default Home