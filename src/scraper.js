const cloudscraper = require('cloudscraper');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

// Note: The search URL is a placeholder and might need to be adjusted.
const CUEVANA_SEARCH_URL = 'https://www.cuevana.is/search?q=';

/**
 * Scrapes Cuevana for a given search query.
 * @param {string} query The search query.
 * @returns {Promise<Array<{title: string, url: string}>>} A promise that resolves to an array of search results.
 */
async function search(query) {
  try {
    const searchUrl = `${CUEVANA_SEARCH_URL}${query}`;
    console.log(`Searching for: ${query} at ${searchUrl}`);

    // Use cloudscraper to bypass Cloudflare
    const html = await cloudscraper.get(searchUrl);

    // Load the HTML into Cheerio
    const $ = cheerio.load(html);

    // Find the movie list items
    const items = $('ul.MovieList li.TPostMv');
    const results = [];

    items.each((i, item) => {
      const $$ = $(item);
      const posterSrc = $$.find('div.Image img').attr('src');
      let poster = posterSrc;
      if (posterSrc && posterSrc.includes('url=')) {
          poster = decodeURIComponent(posterSrc.split('url=')[1].split('&')[0]);
      }
      
      results.push({
        title: $$.find('a span.Title').text(),
        url: $$.find('a').attr('href'),
        poster
      });
    });

    return results;
  } catch (error) {
    console.error('Error during scraping:', error);
    return [];
  }
}

/**
 * Scrapes movie details from a Cuevana movie page.
 * @param {string} url The URL of the movie page.
 * @returns {Promise<object|null>} A promise that resolves to an object with movie details, or null on error.
 */
async function getMovieDetails(url) {
  try {
    console.log(`Scraping movie details from: ${url}`);
    const html = await cloudscraper.get(url);
    const $ = cheerio.load(html);

    // The movie data is in a script tag as JSON
    const nextData = JSON.parse($('script#__NEXT_DATA__').html());
    const movie = nextData.props.pageProps.thisMovie;

    const languageOptions = {};
    if (movie.videos) {
      for (const lang in movie.videos) {
        if (movie.videos[lang].length > 0) {
          languageOptions[lang] = movie.videos[lang].map(video => ({
            server: video.cyberlocker,
            quality: video.quality,
            url: video.result,
          }));
        }
      }
    }

    const downloadLinks = [];
    if (movie.downloads) {
      movie.downloads.forEach(download => {
        downloadLinks.push({
          server: download.cyberlocker,
          language: download.language,
          quality: download.quality,
          link: download.result,
        });
      });
    }

    // Find all language options. This is a bit brittle and depends on the site structure.
    $('ul.CapiIndx > li').each((i, el) => {
        const optionEl = $(el);
        const serverName = optionEl.find('a > span.Server').text().trim().toLowerCase();
        const optionUrl = optionEl.find('a').attr('href');
        const languageName = optionEl.find('a > span.Image > img').attr('alt').trim().toLowerCase();

        if (optionUrl) {
            const option = {
                url: optionUrl,
                server: serverName
            };

            if (languageName.includes('latino')) {
                languageOptions.latino.push(option);
            } else if (languageName.includes('castellano')) {
                languageOptions.castellano.push(option);
            } else if (languageName.includes('subtitulado')) {
                languageOptions.subtitulado.push(option);
            }
        }
    });

    const details = {
      title: movie.titles.name,
      synopsis: movie.overview,
      genres: movie.genres.map(g => g.name),
      actors: movie.cast.acting.map(c => c.name),
      languageOptions,
      downloadLinks,
    };

    return details;
  } catch (error) {
    console.error('Error getting movie details:', error);
    return null;
  }
}

/**
 * Scrapes a specific section of Cuevana for a given page.
 * @param {string} section The section to scrape (e.g., 'peliculas', 'estrenos').
 * @param {number} page The page number.
 * @returns {Promise<Array<{title: string, url: string, poster: string}>>} A promise that resolves to an array of movies.
 */
async function getMoviesBySection(section, page = 1) {
  try {
    // The URL for page 1 might not have /page/1, but this structure is common for subsequent pages.
    // This should work for both cases, but might need adjustment if page 1 is different.
    const url = `https://www.cuevana.is/${section}/page/${page}`;
    console.log(`Scraping section "${section}", page ${page} from: ${url}`);
    const html = await cloudscraper.get(url);
    const $ = cheerio.load(html);

    const movies = [];
    // This is the most common selector for movie lists on the site.
    $('ul.MovieList li.TPostMv').each((i, el) => {
        const $$ = $(el);
        const posterSrc = $$.find('div.Image img').attr('src');
        let poster = posterSrc;
        if (posterSrc && posterSrc.includes('url=')) {
            poster = decodeURIComponent(posterSrc.split('url=')[1].split('&')[0]);
        }
        movies.push({
            title: $$.find('a span.Title').text(),
            url: $$.find('a').attr('href'),
            poster: poster
        });
    });
    
    return movies;
  } catch (error) {
    // It's common for a page not to exist (e.g., tendencias), so we don't log the full error.
    console.error(`Could not scrape section "${section}" on page ${page}. It may not exist.`);
    return [];
  }
}

async function getDirectVideoInfo(optionUrl, log = console.log) {
  if (!optionUrl || !optionUrl.startsWith('http')) {
    log('Invalid video source URL provided.');
    return null;
  }
  let browser;
  try {
    log('Searching for the most reliable video source...');
    browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = (await browser.pages())[0];
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');

    let videoInfo = null;
    const findVideoPromise = new Promise((resolve, reject) => {
      page.on('response', async (response) => {
        const req_url = response.url();
        if (req_url.includes('.m3u8')) {
          log('Success! Captured the video stream.');
          if (!videoInfo) {
            videoInfo = { directVideoUrl: req_url, referer: page.url() };
            resolve(videoInfo);
          }
        }
      });
      setTimeout(() => {
        if (!videoInfo) reject(new Error("Timeout: No HLS stream found after 60 seconds."));
      }, 60000);
    });

    await page.goto(optionUrl, { waitUntil: 'networkidle2' });
    log("Player page loaded. Looking for the play button to begin...");
    
    const frames = page.frames();
    const playButtonSelectors = ['[class*="play"]', '[aria-label*="Play"]', '#start', '.jw-video.jw-reset', 'div[role=button]'];
    let clicked = false;

    for (const frame of frames) {
        for (const selector of playButtonSelectors) {
            try {
                await frame.click(selector, { timeout: 1000 });
                log('Play button found! Bypassing ads and popups...');
                clicked = true;
                break;
            } catch (e) { /* Ignore - selector not in this frame */ }
        }
        if (clicked) break;
    }
    if (!clicked) log('No play button found. Waiting for the player to start automatically...');
    
    const foundInfo = await findVideoPromise;
    await browser.close();
    return foundInfo;

  } catch (error) {
    log(`An error occurred with this source. Don't worry, I'll try another if available.`);
    if (browser) await browser.close();
    return null;
  }
}

module.exports = {
    search,
    getMovieDetails,
    getMoviesBySection, // Replaces getHomepageMovies
    getDirectVideoInfo
}; 