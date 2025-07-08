import { Carousel } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from '../icons/icons';
import './carousel.css';
import propTypes from 'prop-types';

export default function SliderComponent({ movies = [] }) {
  // Take only the first 5 movies for the slider
  const sliderMovies = movies.slice(0, 5);

  return (
    <Carousel
      indicators={false}
      className="carousel-control"
      leftControl={<ArrowLeft className={'opacity-10 hover:opacity-100'} />}
      rightControl={<ArrowRight className={'opacity-10 hover:opacity-100'} />}
      slideInterval={8000}
    >
      {sliderMovies.map((movie) => (
        <div className="h-full w-full" key={movie.url}>
          <div
            className="w-full h-full px-20 lg:px-sitex relative"
            style={{
              boxShadow:
                '0px -10px 10px 0px #080F28 inset, 0px -220px 500px 10px #080F28 inset, 0px 30px 80px 0px #080F28 inset',
            }}
          >
            <img
              className="w-full h-full absolute top-0 left-0 object-cover select-none pointer-events-none -z-10"
              src={movie.poster}
              alt={movie.title}
            />

            <div className="lg:pt-32 pt-36">
              {/* Simplified content for the slider */}
              <h1 className="text-4xl lg:text-5xl font-bold text-white max-w-lg">{movie.title}</h1>
            </div>

            <div className="mt-8">
              <Link
                to={`/movie?url=${encodeURIComponent(movie.url)}`}
                className="bg-skyblue hover:brightness-90 py-3 px-8 rounded-full text-white font-semibold"
              >
                Ver Película
              </Link>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
}

SliderComponent.propTypes = {
  movies: propTypes.array,
};
