import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './components/home/home';
import { Movies } from './components/movies/movies';
import { PageNotFound } from './components/routes/404';
import { SelectedMovie } from './components/routes/selectedMovie';

export const AppRoutes = ({ movies, loading, isSearching, onSectionChange }) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home movies={movies} loading={loading} onSectionChange={onSectionChange} />} />
        <Route path="/movies" element={<Navigate to="/peliculas/1" />} />

        {/* Route for sections with subsections (e.g., /tendencias/dia/1) */}
        <Route path="/:section/:subsection/:page" element={<Movies />} />
        
        {/* Generic route for top-level sections */}
        <Route path="/:section/:page" element={<Movies />} />
        
        <Route path="/movie" element={<SelectedMovie />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};
