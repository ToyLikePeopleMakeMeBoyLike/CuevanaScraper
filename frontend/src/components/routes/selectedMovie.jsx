import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Hls from 'hls.js';
import { fetchMovieDetails } from '../../api/tmdb';

export const SelectedMovie = () => {
  const location = useLocation();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const videoRef = useRef(null);

  const loadingMessages = [
    "Preparing your video...",
    "Taking down ads...",
    "Getting carefully the link without ads...",
    "Working harder to fight ads..."
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
    }, 5000);

    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    const requestId = crypto.randomUUID();
    const eventSource = new EventSource(`http://localhost:3001/logs/${requestId}`);
    
    eventSource.onmessage = (event) => {
        const newLog = JSON.parse(event.data);
        setLogs(prevLogs => [...prevLogs, newLog.message]);
    };

    eventSource.onerror = () => {
        eventSource.close();
    };

    const getDetails = async () => {
      const params = new URLSearchParams(location.search);
      const movieUrl = params.get('url');
      if (movieUrl) {
        setLoading(true);
        setLogs([]); // Clear logs for new movie
        const details = await fetchMovieDetails(movieUrl, requestId);
        setMovie(details);
        setLoading(false);
        eventSource.close();
      }
    };

    getDetails();

    return () => {
        eventSource.close();
    };
  }, [location.search]);

  useEffect(() => {
    if (movie?.directVideoUrl && videoRef.current) {
      const video = videoRef.current;
      const hls = new Hls();
      const proxiedUrl = `http://localhost:3001/proxy?url=${encodeURIComponent(movie.directVideoUrl)}&referer=${encodeURIComponent(movie.referer)}`;
      
      if (Hls.isSupported()) {
        hls.loadSource(proxiedUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = proxiedUrl;
        video.addEventListener('loadedmetadata', () => {
          video.play();
        });
      }

      return () => {
        hls.destroy();
      };
    }
  }, [movie]);


  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
            <h2 className="text-2xl mt-8 mb-4">{loadingMessages[currentMessageIndex]}</h2>
            <div className="bg-black bg-opacity-50 text-left p-4 rounded-lg w-full max-w-2xl h-64 overflow-y-auto font-mono text-sm mt-4">
                {logs.map((log, index) => (
                    <p key={index} className="whitespace-pre-wrap opacity-75">{`> ${log}`}</p>
                ))}
            </div>
        </div>
    );
  }

  if (!movie) {
    return <div className="text-white text-center p-10">Movie details not found.</div>;
  }

  return (
    <>
      <article className="relative flex gap-8 pt-32 px-20 lg:px-sitex min-h-screen h-full text-white z-10">
        <div className="w-full relative">
          <header className="flex gap-8">
            <section className="flex flex-col gap-6 w-full">
              <header className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold">{movie.title}</h1>
              </header>

              <p className="text-gray-300 max-h-[120px] overflow-auto">{movie.synopsis}</p>

              <div className="flex flex-col gap-2 text-sm text-gray-400">
                <div className="flex gap-2">
                  <span>Género:</span>
                  <span className="text-white">
                    {movie.genres?.join(', ')}
                  </span>
                </div>
              </div>
            </section>
          </header>

          <section className="w-full h-[70vh] bg-[#222e5b] mt-12 flex flex-col">
            <div className="w-full h-full bg-black flex items-center justify-center">
              {movie.directVideoUrl ? (
                <video ref={videoRef} controls className="w-full h-full" />
              ) : (
                <p>No video source found for this movie.</p>
              )}
            </div>
          </section>
        </div>
      </article>
    </>
  );
};
