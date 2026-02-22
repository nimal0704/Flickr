const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const IMG_BASE = "https://image.tmdb.org/t/p/w500";
export const IMG_ORIGINAL = "https://image.tmdb.org/t/p/original";

async function tmdb(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);
  Object.entries(params).forEach(([k,v])=> url.searchParams.set(k,v));
  const res = await fetch(url);
  if(!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}
export const getTrending = () => tmdb("/trending/movie/week");
export const getNowPlaying = () => tmdb("/movie/now_playing", { region: "IN" });
export const getTopRated = () => tmdb("/movie/top_rated");
export const getUpcoming = () => tmdb("/movie/upcoming", { region: "IN" });
export const searchMovies = (query) => tmdb("/search/movie", { query });
export const getMovieDetails = (id) => tmdb(`/movie/${id}`);
export const getMovieVideos = (id) => tmdb(`/movie/${id}/videos`);
export const getWatchProviders = (id) => tmdb(`/movie/${id}/watch/providers`);
export const getSimilarMovies = (id) => tmdb(`/movie/${id}/similar`);
export const getMovieCredits = (id) => tmdb(`/movie/${id}/credits`);