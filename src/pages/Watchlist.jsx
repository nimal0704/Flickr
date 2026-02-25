import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { IMG_BASE } from "../api/tmdb";

const Watchlist = () => {
  const { user, signInWithGoogle } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ── FETCH WATCHLIST FROM FIRESTORE ──
  useEffect(() => {
    // not logged in → stop loading, show sign in
    if (!user) {
      setLoading(false);
      return;
    }

    // reference to user's movies subcollection
    const ref = collection(db, "watchlists", user.uid, "movies");

    getDocs(ref)
      .then(snap => {
        // snap.docs = array of document snapshots
        // .map(d => d.data()) = get actual data from each
        const list = snap.docs.map(d => d.data());
        setMovies(list);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

  }, [user]); // re-runs when user changes (login/logout)

  // ── REMOVE MOVIE ──
  const handleRemove = async (movieId) => {
    try {
      const ref = doc(db, "watchlists", user.uid, "movies", String(movieId));
      await deleteDoc(ref);
      // update UI instantly without re-fetching
      setMovies(prev => prev.filter(m => m.id !== movieId));
    } catch (err) {
      console.error(err);
    }
  };

  // ── NOT LOGGED IN ──
  if (!user) return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center gap-6">
      <div className="text-6xl">🎬</div>
      <h2 className="text-white text-2xl font-bold">Sign in to see your Watchlist</h2>
      <p className="text-gray-400 text-sm">Save movies and watch them later</p>
      <button
        onClick={signInWithGoogle}
        className="flex items-center gap-2
                   bg-white text-black
                   px-6 py-3 rounded-full
                   font-semibold cursor-pointer
                   hover:bg-gray-100 transition"
      >
        <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" />
        Sign in with Google
      </button>
    </div>
  );

  // ── LOADING ──
  if (loading) return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-white/10 border-t-[#fb0505] rounded-full animate-spin" />
    </div>
  );

  // ── EMPTY WATCHLIST ──
  if (movies.length === 0) return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center gap-6">
      <div className="text-6xl">🍿</div>
      <h2 className="text-white text-2xl font-bold">Your watchlist is empty</h2>
      <p className="text-gray-400 text-sm">Start adding movies you want to watch</p>
      <button
        onClick={() => navigate("/")}
        className="bg-[#fb0505] text-white
                   px-6 py-3 rounded-xl
                   font-bold cursor-pointer
                   hover:bg-red-600 transition"
      >Browse Movies</button>
    </div>
  );

  // ── WATCHLIST ──
  return (
    <div className="min-h-screen bg-primary pt-24 px-4 sm:px-6 pb-20">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              My Watchlist
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {user.displayName} • {movies.length} {movies.length === 1 ? "movie" : "movies"}
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="text-sm bg-white/10 hover:bg-white/20
                       text-white px-4 py-2 rounded-full
                       transition cursor-pointer"
          >+ Add More</button>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {movies.map(movie => (
            <div key={movie.id} className="relative group">

              {/* Card */}
              <div
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={movie.poster_path
                      ? `${IMG_BASE}${movie.poster_path}`
                      : "https://via.placeholder.com/200x300?text=?"
                    }
                    alt={movie.title}
                    className="w-full object-cover
                               group-hover:scale-105
                               transition duration-300"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40
                                  opacity-0 group-hover:opacity-100
                                  transition duration-300
                                  flex items-center justify-center">
                    <span className="text-white text-sm font-bold">View Details</span>
                  </div>
                </div>

                <p className="text-white text-xs sm:text-sm
                               font-semibold mt-2 line-clamp-1">
                  {movie.title}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-gray-400 text-xs">
                    ⭐ {movie.vote_average?.toFixed(1)}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {movie.release_date?.split("-")[0]}
                  </p>
                </div>
              </div>

              {/* Remove button - appears on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // don't navigate to movie
                  handleRemove(movie.id);
                }}
                className="absolute top-2 right-2
                           bg-red-500 hover:bg-red-600
                           text-white w-7 h-7
                           rounded-full text-xs font-bold
                           opacity-0 group-hover:opacity-100
                           transition cursor-pointer
                           flex items-center justify-center
                           z-10"
              >✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Watchlist;