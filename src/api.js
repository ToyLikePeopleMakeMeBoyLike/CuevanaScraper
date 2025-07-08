const express = require('express');
const cors = require('cors');
const { search, getMovieDetails, getMoviesBySection, getDirectVideoInfo } = require('./scraper');
const cloudscraper = require('cloudscraper'); // Added for proxy endpoint
const { URL } = require('url');

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory store for active SSE clients
const clients = {};

// Function to send log messages to a specific client
const sendLog = (requestId, message) => {
    if (clients[requestId]) {
        clients[requestId].res.write(`data: ${JSON.stringify({ message })}\\n\\n`);
    }
};

app.use(cors());
app.use(express.json());

function withTimeout(promise, ms) {
    const timeout = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(`Timeout after ${ms}ms`));
        }, ms);
    });
    return Promise.race([promise, timeout]);
}

// Logs route for Server-Sent Events
app.get('/logs/:requestId', (req, res) => {
    const { requestId } = req.params;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    clients[requestId] = { res };
    
    sendLog(requestId, 'Log stream started. Waiting for scraper...');

    req.on('close', () => {
        delete clients[requestId];
    });
});


// New route for all browsable sections
app.get('/section/:section/:subsection?', async (req, res) => {
    const { section, subsection } = req.params;
    const page = req.query.page || 1;

    let scrapePath = subsection ? `${section}/${subsection}` : section;

    // Prepend 'peliculas' for a 'tendencias' section, as per the site structure
    if (section === 'tendencias') {
        scrapePath = `peliculas/${scrapePath}`;
    }

    // The allowed sections check remains on the original path from the client
    const clientPath = subsection ? `${section}/${subsection}` : section;
    const allowedSections = ['peliculas', 'estrenos', 'tendencias/dia', 'tendencias/semana'];
    if (!allowedSections.includes(clientPath)) {
        return res.status(404).json({ error: 'Section not found.' });
    }

    try {
        const results = await getMoviesBySection(scrapePath, page);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get movies for the requested section.' });
    }
});

// Search route
app.get('/search', async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ error: 'Search query "q" is required.' });
    }

    try {
        const results = await search(q);
        res.json(results);
    } catch (error) {
        console.error('Search failed:', error);
        res.status(500).json({ error: 'Failed to perform search.' });
    }
});

// Movie details and video source route
app.get('/movie', async (req, res) => {
    const { url, requestId } = req.query;
    if (!url) {
        return res.status(400).json({ error: 'Movie URL "url" is required.' });
    }
    if (!requestId) {
        return res.status(400).json({ error: 'Request ID "requestId" is required.' });
    }

    const logger = (message) => sendLog(requestId, message);

    try {
        const details = await getMovieDetails(url);
        if (!details) {
            return res.status(404).json({ error: 'Movie details not found.' });
        }

        const latinoOptions = details.languageOptions?.latino || [];
        
        // Use ONLY streamwish options, as requested.
        const streamwishOptions = latinoOptions.filter(opt => opt.server === 'streamwish');

        if (streamwishOptions.length > 0) {
            for (const option of streamwishOptions) {
                try {
                    const fetchVideoPromise = () => getDirectVideoInfo(option.url, logger);

                    const result = await withTimeout(fetchVideoPromise(), 45000); // 45-second timeout for the whole process

                    if (result && result.directVideoUrl) {
                        logger('Video found! Sending details to player.');
                        details.directVideoUrl = result.directVideoUrl;
                        details.referer = result.referer;
                        res.json(details);
                        if(clients[requestId]) clients[requestId].res.end(); // Close SSE connection
                        return;
                    }
                } catch (error) {
                    // The scraper now sends its own, more user-friendly error messages.
                    // No need to log a generic one here.
                }
            }
        }

        // If no direct link is found after trying all options
        logger('Could not find a working video source.');
        res.status(404).json({ error: 'Could not find a direct video source for this movie.', details });

    } catch (error) {
        logger(`A critical error occurred: ${error.message}`);
        res.status(500).json({ error: 'Failed to get movie details.' });
    } finally {
         if(clients[requestId]) clients[requestId].res.end(); // Ensure connection is closed
    }
});

app.get('/proxy', async (req, res) => {
  const { url, referer } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const requestOptions = {
      uri: url,
      resolveWithFullResponse: true,
      encoding: null,
      headers: {
        'Referer': referer || '',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };
    
    const response = await cloudscraper.get(requestOptions);
    const contentType = response.headers['content-type'] || '';

    if (contentType.includes('mpegurl')) { // It's an M3U8 playlist
      const playlist = response.body.toString('utf8');
      const baseUrl = url;
      const proxyReferer = encodeURIComponent(referer || '');

      const rewrittenPlaylist = playlist.split('\n').map(line => {
        line = line.trim();
        if (line && !line.startsWith('#')) {
          const absoluteUrl = new URL(line, baseUrl).href;
          return `http://localhost:3001/proxy?url=${encodeURIComponent(absoluteUrl)}&referer=${proxyReferer}`;
        }
        return line;
      }).join('\n');

      res.setHeader('Content-Type', contentType);
      res.send(rewrittenPlaylist);

    } else { // Not a playlist, just proxy directly
      res.setHeader('Content-Type', contentType);
      res.send(response.body);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to proxy request.' });
  }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});