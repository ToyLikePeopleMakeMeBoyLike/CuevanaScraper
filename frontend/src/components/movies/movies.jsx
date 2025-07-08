import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMoviesBySection } from '../../api/tmdb';
import { HomeMoviesComponent } from './homemovies';
import { PaginationButton } from '../utils/buttons';

const capitalize = (s) => s && s.charAt(0).toUpperCase() + s.slice(1);

export const Movies = () => {
  const { section, subsection, page } = useParams();
  const currentPage = parseInt(page, 10) || 1;
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const apiSection = subsection ? `${section}/${subsection}` : section;
    setTitle(`${capitalize(section)}${subsection ? ` / ${capitalize(subsection)}` : ''}`);

    const getMovies = async () => {
      setLoading(true);
      const results = await fetchMoviesBySection(apiSection, currentPage);
      setMovies(results);
      setLoading(false);
      window.scrollTo(0, 0);
    };

    if (section) getMovies();
  }, [section, subsection, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0) {
      const path = subsection ? `/${section}/${subsection}/${newPage}` : `/${section}/${newPage}`;
      navigate(path);
    }
  };

  return (
    <>
      <section className="flex gap-8 bg-primary pt-36 lg:px-sitex px-20 text-gray-400 min-h-screen">
        <article className="w-full">
          <h1 className="h2 font-bold text-4xl text-white mb-8">
            {title}
          </h1>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <HomeMoviesComponent movies={movies} />
              <footer className="w-full flex justify-center mt-12">
                <PaginationButton
                  currentPage={currentPage}
                  leftOnClick={() => handlePageChange(currentPage - 1)}
                  rigthOnClick={() => handlePageChange(currentPage + 1)}
                />
              </footer>
            </>
          )}
        </article>
      </section>
    </>
  );
};
