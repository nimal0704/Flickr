import React from 'react'
import { useState, useEffect } from 'react'
import Search from './components/Search.jsx'
import MovieSection from './components/MovieSection.jsx'
import MovieCard from './components/MovieCard.jsx'
import useDebounce from "./hooks/useDebounce.js"
import { getTrending, getNowPlaying, getTopRated, getUpcoming, searchMovies } from "./api/tmdb";


const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [trending, setTrending] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
      getTrending()
        .then(data => setTrending(data.results))
        .catch(err => console.error(err));
  
      getNowPlaying()
        .then(data => setNowPlaying(data.results))
        .catch(err => console.error(err));

      getTopRated()
        .then(data => setTopRated(data.results))
        .catch(err => console.error(err));
      
      getUpcoming()
        .then(data => setUpcoming(data.results))
        .catch(err => console.error(err));
    },
         []);

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
                onClick={(m) => console.log(m.title)}
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
         <MovieSection title="🔥 Trending"     movies={trending}   onMovieClick={(m) => console.log(m.title)} />
          <MovieSection title="🍿 Now Playing"  movies={nowPlaying} onMovieClick={(m) => console.log(m.title)} />
          <MovieSection title="🔝 Top Rated"    movies={topRated}   onMovieClick={(m) => console.log(m.title)} />
          <MovieSection title="🗓️ Coming Soon"  movies={upcoming}   onMovieClick={(m) => console.log(m.title)} />
        </>
      )}
    </div> 
  )
}

export default App