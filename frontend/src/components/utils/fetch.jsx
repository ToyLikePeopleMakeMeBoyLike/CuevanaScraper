import { API_URLs } from './moviesURLs';

const fetchData = async (URL) => {
  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};

export const fetchHomepage = async () => fetchData(API_URLs.homepage());

export const fetchLatestMovies = async ({ page = 1 }) => 
  fetchData(API_URLs.sections.movies.latest(page));

export const fetchPremiereMovies = async ({ page = 1 }) => 
  fetchData(API_URLs.sections.movies.premieres(page));

export const fetchMostViewedMovies = async ({ page = 1 }) => 
  fetchData(API_URLs.sections.movies.mostViewed(page));

export const fetchTopRatedMovies = async ({ page = 1 }) => 
  fetchData(API_URLs.sections.movies.topRated(page));

export const fetchLatinoMovies = async ({ page = 1 }) => 
  fetchData(API_URLs.sections.movies.latino(page));

export const fetchLatestSeries = async ({ page = 1 }) => 
  fetchData(API_URLs.sections.series.latest(page));

export const fetchPremiereSeries = async ({ page = 1 }) => 
  fetchData(API_URLs.sections.series.premieres(page));

export const fetchLatestEpisodes = async ({ page = 1 }) => 
  fetchData(API_URLs.sections.series.episodes(page));

export const searchContent = async ({ query, page = 1 }) => 
  fetchData(API_URLs.search(query));

export const fetchMovieDetails = async ({ url }) => 
  fetchData(API_URLs.details.movie(url));

export const fetchSeriesDetails = async ({ url }) => 
  fetchData(API_URLs.details.series(url));
