import { useEffect, useState } from 'react'
import { AppRoutes } from './Router'
import { fetchMoviesBySection, searchMovies } from './api/tmdb'
import { MenuBarComponent } from './components/menubar/menubar'

function App () {
  const [movies, setMovies] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [trendingPeriod, setTrendingPeriod] = useState('dia');

  useEffect(() => {
    if (!isSearching) {
      setLoading(true);
      const getMovies = async () => {
        const section = `tendencias/${trendingPeriod}`;
        const pagesToFetch = [1, 2, 3];
        const moviesPromises = pagesToFetch.map(page => fetchMoviesBySection(section, page));
        const moviesDataByPage = await Promise.all(moviesPromises);
        const allMovies = moviesDataByPage.flat();
        setMovies(allMovies);
        setLoading(false);
      };
      getMovies();
    }
  }, [isSearching, trendingPeriod]);

  const handleSearch = async (query) => {
    if (query) {
      setIsSearching(true)
      setLoading(true)
      const results = await searchMovies(query)
      setSearchResults(results)
      setLoading(false)
    } else {
      setIsSearching(false)
      setSearchResults([]) // Clear search results
    }
  }

  const handleSectionChange = (period) => {
    setTrendingPeriod(period);
  };

  const moviesToShow = isSearching ? searchResults : movies

  return (
    <>
      <MenuBarComponent onSearch={handleSearch} />
      <AppRoutes movies={moviesToShow} loading={loading} isSearching={isSearching} onSectionChange={handleSectionChange} />
      <footer className='w-full p-16 flex justify-center opacity-60 text-center text-sm text-white'>
        Desarrollado por Andre {'</>'}
      </footer>
    </>
  )
}

export default App
