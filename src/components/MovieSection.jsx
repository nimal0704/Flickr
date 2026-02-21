import MovieCard from "./MovieCard";

function MovieSection({ title, movies, onMovieClick }) {
  // don't render anything if no movies yet
  if (movies.length === 0) return null;

  return (
    <>
      <h2 className="mt-8 mb-4">{title}</h2>
      <div className="grid">
        {movies.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={onMovieClick}
          />
        ))}
      </div>
    </>
  );
}

export default MovieSection;