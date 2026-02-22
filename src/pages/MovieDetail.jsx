import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMovieDetails,
  getMovieVideos,
  getMovieCredits,
  getWatchProviders,
  getSimilarMovies,
  IMG_BASE,
  IMG_ORIGINAL
} from "../api/tmdb";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [cast, setCast] = useState([]);
  const [providers, setProviders] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    Promise.all([
      getMovieDetails(id),
      getMovieVideos(id),
      getMovieCredits(id),
      getWatchProviders(id),
      getSimilarMovies(id),
    ]).then(([details, videos, credits, watchProviders, similarMovies]) => {
      setMovie(details);

      const officialTrailer = videos.results?.find(
        v => v.type === "Trailer" && v.site === "YouTube"
      );
      setTrailer(officialTrailer);
      setCast(credits.cast?.slice(0, 10));
      setProviders(watchProviders.results?.IN);
      setSimilar(similarMovies.results?.slice(0, 12));
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });

    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setInWatchlist(watchlist.some(m => m.id === Number(id)));
  }, [id]);

  const handleWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    if (inWatchlist) {
      const updated = watchlist.filter(m => m.id !== movie.id);
      localStorage.setItem("watchlist", JSON.stringify(updated));
      setInWatchlist(false);
    } else {
      watchlist.push({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date
      });
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
      setInWatchlist(true);
    }
  };

  // ── LOADING ──
  if (loading) return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-white/10 border-t-[#7405fb] rounded-full animate-spin" />
    </div>
  );

  // ── NOT FOUND ──
  if (!movie) return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <p className="text-white text-xl">Movie not found</p>
    </div>
  );

  const backdrop = movie.backdrop_path ? `${IMG_ORIGINAL}${movie.backdrop_path}` : null;
  const poster = movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : null;
  const year = movie.release_date?.split("-")[0];
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  return (
    <div className="min-h-screen bg-primary text-white">

      {/* ── HERO ── */}
      <div className="relative min-h-[60vh] sm:min-h-[70vh]">

        {/* Backdrop */}
        {backdrop && (
          <div
            className="absolute inset-0 bg-cover bg-center brightness-30"
            style={{ backgroundImage: `url(${backdrop})` }}
          />
        )}

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10
                     bg-white/10 border border-white/20 text-white
                     px-3 py-1.5 sm:px-4 sm:py-2
                     rounded-full text-xs sm:text-sm
                     cursor-pointer backdrop-blur-sm
                     hover:bg-white/20 transition"
        >← Back</button>

        {/* Hero content */}
        <div className="relative z-10 max-w-6xl mx-auto
                        px-4 sm:px-6
                        pt-20 sm:pt-28 lg:pt-32
                        pb-8 sm:pb-12
                        flex flex-col sm:flex-row
                        gap-6 sm:gap-10
                        items-center sm:items-end">

          {/* Poster */}
          {poster && (
            <img
              src={poster}
              alt={movie.title}
              className="w-36 sm:w-44 lg:w-52
                         shrink-0 rounded-2xl shadow-2xl
                         border-2 border-white/10"
            />
          )}

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black mb-2 leading-tight">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-[#d5004e] italic text-sm sm:text-base mb-3 sm:mb-4">
                "{movie.tagline}"
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap justify-center sm:justify-start
                            gap-2 sm:gap-3 text-xs sm:text-sm
                            text-gray-400 mb-3 sm:mb-4">
              {year && <span>📅 {year}</span>}
              {runtime && <span>⏱ {runtime}</span>}
              <span>⭐ {movie.vote_average?.toFixed(1)} ({movie.vote_count?.toLocaleString()} votes)</span>
              {movie.original_language && (
                <span>🌐 {movie.original_language.toUpperCase()}</span>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4 sm:mb-5">
              {movie.genres?.map(g => (
                <span
                  key={g.id}
                  className="bg-purple-500/15 border border-purple-500/40
                             text-[#8005fb] px-3 py-1
                             rounded-full text-xs font-semibold"
                >{g.name}</span>
              ))}
            </div>

            {/* Overview */}
            <p className="text-gray-300 leading-relaxed
                          text-sm sm:text-base
                          mb-5 sm:mb-6
                          max-w-xl mx-auto sm:mx-0
                          line-clamp-4 sm:line-clamp-none">
              {movie.overview}
            </p>

            {/* Buttons */}
            <div className="flex flex-col xs:flex-row justify-center sm:justify-start gap-3">
              {trailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="bg-purple-700 text-white
                             px-6 py-3 rounded-xl
                             font-bold text-sm
                             cursor-pointer
                             hover:bg-purple-600
                             transition w-full xs:w-auto"
                >▶ Watch Trailer</button>
              )}

              <button
                onClick={handleWatchlist}
                className={`px-6 py-3 rounded-xl font-bold text-sm
                            cursor-pointer border-2 transition
                            w-full xs:w-auto
                            ${inWatchlist
                              ? "bg-purple-500/20 border-[#8517ec] text-[#7c05fb]"
                              : "bg-transparent border-white/30 text-white hover:border-white"
                            }`}
              >{inWatchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 space-y-12">

        {/* WHERE TO WATCH */}
        {providers && (
          <Section title="🎬 Where to Watch">
            <div className="flex flex-wrap gap-4 items-center">
              {providers.flatrate?.map(p => (
                <div key={p.provider_id} className="text-center">
                  <img
                    src={`${IMG_BASE}${p.logo_path}`}
                    alt={p.provider_name}
                    title={p.provider_name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl"
                  />
                  <p className="text-xs text-gray-400 mt-1">{p.provider_name}</p>
                </div>
              ))}
              {!providers.flatrate && (
                <p className="text-gray-400 text-sm">Not available on OTT in India yet</p>
              )}
            </div>
          </Section>
        )}

        {/* CAST */}
        {cast.length > 0 && (
          <Section title="🎭 Cast">
            <div className="flex gap-4 overflow-x-auto pb-3 hide-scrollbar">
              {cast.map(person => (
                <div key={person.id} className="text-center min-w-[80px] sm:min-w-[90px]">
                  <img
                    src={person.profile_path
                      ? `${IMG_BASE}${person.profile_path}`
                      : "https://via.placeholder.com/90x120?text=?"
                    }
                    alt={person.name}
                    className="w-16 h-16 sm:w-20 sm:h-20
                               rounded-full object-cover mx-auto
                               border-2 border-white/10"
                  />
                  <p className="text-xs text-white mt-2 font-semibold leading-tight">
                    {person.name}
                  </p>
                  <p className="text-xs text-gray-500 leading-tight">
                    {person.character}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* DETAILS */}
        <Section title="📋 Details">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {[
              { label: "Status",       value: movie.status },
              { label: "Release Date", value: movie.release_date },
              { label: "Runtime",      value: runtime },
              { label: "Language",     value: movie.original_language?.toUpperCase() },
              { label: "Budget",       value: movie.budget > 0 ? `$${(movie.budget / 1e6).toFixed(0)}M` : "N/A" },
              { label: "Revenue",      value: movie.revenue > 0 ? `$${(movie.revenue / 1e6).toFixed(0)}M` : "N/A" },
            ].map(item => (
              <div key={item.label} className="bg-white/5 rounded-xl p-3 sm:p-4">
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">
                  {item.label}
                </p>
                <p className="text-white font-semibold text-sm sm:text-base">
                  {item.value || "N/A"}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* SIMILAR MOVIES */}
        {similar.length > 0 && (
          <Section title="🎥 Similar Movies">
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 hide-scrollbar">
              {similar.map(m => (
                <div
                  key={m.id}
                  onClick={() => navigate(`/movie/${m.id}`)}
                  className="min-w-[110px] sm:min-w-[130px] cursor-pointer
                             hover:scale-105 transition"
                >
                  <img
                    src={m.poster_path
                      ? `${IMG_BASE}${m.poster_path}`
                      : "https://via.placeholder.com/130x195?text=?"
                    }
                    alt={m.title}
                    className="w-[110px] h-[165px] sm:w-[130px] sm:h-[195px]
                               object-cover rounded-xl"
                  />
                  <p className="text-xs text-white mt-2 line-clamp-1">{m.title}</p>
                  <p className="text-xs text-gray-500">⭐ {m.vote_average?.toFixed(1)}</p>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>

      {/* ── TRAILER MODAL ── */}
      {showTrailer && trailer && (
        <div
          onClick={() => setShowTrailer(false)}
          className="fixed inset-0 z-50 bg-black/90
                     flex items-center justify-center
                     p-4 sm:p-8"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full max-w-4xl aspect-video relative"
          >
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="Trailer"
              allow="autoplay; fullscreen"
              className="w-full h-full border-none rounded-xl"
            />
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-8 sm:-top-10 right-0
                         text-white text-lg sm:text-2xl
                         bg-transparent border-none cursor-pointer
                         hover:text-gray-300 transition"
            >✕ Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Section wrapper
const Section = ({ title, children }) => (
  <div className="mt-10 sm:mt-12">
    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">{title}</h2>
    {children}
  </div>
);

export default MovieDetail;