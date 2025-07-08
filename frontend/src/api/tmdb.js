const API_BASE_URL = 'http://localhost:3001';

export async function fetchMoviesBySection (section, page = 1) {
  try {
    const response = await fetch(`${API_BASE_URL}/section/${section}?page=${page}`)
    if (!response.ok) {
      console.error('Failed to fetch movies by section:', response.statusText)
      return []
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching movies by section:', error)
    return []
  }
}

export async function searchMovies (query) {
  try {
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) {
      console.error('Failed to fetch search results:', response.statusText)
      return []
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching search results:', error)
    return []
  }
}

export async function fetchMovieDetails (movieUrl, requestId) {
  try {
    const response = await fetch(`${API_BASE_URL}/movie?url=${encodeURIComponent(movieUrl)}&requestId=${requestId}`)
    if (!response.ok) {
      console.error('Failed to fetch movie details:', response.statusText)
      return null
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching movie details:', error)
    return null
  }
} 