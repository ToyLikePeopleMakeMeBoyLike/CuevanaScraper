import { useLocation } from 'react-router-dom';
import { HeaderMoviesOptions } from './homemoviesheader';
import MoviesCard from './moviescard'

export const HomeMoviesComponent = ({ movies, onSectionChange }) => {
  const location = useLocation();

  let showHeaderMoviesOptions = true;
  if (location.pathname !== '/') {
    showHeaderMoviesOptions = false;
  }

  return (
    <>
      {/* Peliculas */}
      <div className="mt-10">
        {showHeaderMoviesOptions ? <HeaderMoviesOptions onSectionChange={onSectionChange} /> : null}

        {/* Movies  */}
        <div
          className="grid gap-4 mt-8"
          style={{ gridTemplateColumns: 'repeat( auto-fill, minmax(140px, 1fr) )' }}
        >
          {movies.map((movie, index) => {
            return (
              <MoviesCard
                title={movie.title}
                poster_path={movie.poster}
                id={movie.url}
                key={`${movie.url}-${index}`}
                onClick={() => {
                  window.scroll({ top: 0 });
                }}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};
