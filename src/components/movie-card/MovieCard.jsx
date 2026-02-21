import { IMG_BASE } from "../../api/tmdb";

function MovieCard({movie, onClick}){
  const year = movie.release_date?.split("-")[0] || "N/A";
  const poster = movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : null;

  return (
    <div onClick={() => onClick(movie)} style={{cursor: "pointer", width: "160px"}}>
      {poster ? (
        <img src={poster} alt={movie.title} style={{width: "100%", borderRadius: "8px"}}/>
      ) : (
        <div style={{ width: "100%", height: "240px", background: "#111", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>🎬</div>
      )}
      <p style={{ color: "#fff", fontSize: "13px", marginTop: "8px" }}>{movie.title}</p>
      <p style={{ color: "#888", fontSize: "12px" }}>{year} • ⭐ {movie.vote_average?.toFixed(1)}</p>
    </div>
  )
}

export default MovieCard;