const API_BASE_URL = 'http://localhost:3001';

export const API_URLs = {
  homepage: () => `${API_BASE_URL}/homepage`,
  search: (query) => `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`,
  sections: {
    movies: {
      latest: (page = 1) => `${API_BASE_URL}/section/peliculas?page=${page}`,
      premieres: (page = 1) => `${API_BASE_URL}/section/estrenos?page=${page}`,
      mostViewed: (page = 1) => `${API_BASE_URL}/section/peliculas-mas-vistas?page=${page}`,
      topRated: (page = 1) => `${API_BASE_URL}/section/peliculas-mas-valoradas?page=${page}`,
      latino: (page = 1) => `${API_BASE_URL}/section/peliculas-latino?page=${page}`,
    },
    series: {
      latest: (page = 1) => `${API_BASE_URL}/section/series?page=${page}`,
      premieres: (page = 1) => `${API_BASE_URL}/section/series/estrenos?page=${page}`,
      episodes: (page = 1) => `${API_BASE_URL}/section/series/episodios?page=${page}`,
    }
  },
  details: {
    movie: (url) => `${API_BASE_URL}/movie?url=${encodeURIComponent(url)}`,
    series: (url) => `${API_BASE_URL}/series?url=${encodeURIComponent(url)}`,
  }
};
