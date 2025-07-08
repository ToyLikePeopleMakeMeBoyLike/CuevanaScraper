import propTypes from 'prop-types';
import SliderComponent from './sliderComponent';

export const HomePageImage = ({ movies }) => {
  return (
    <>
      <section className="w-full box-border lg:h-[75vh] h-[80vh] object-cover relative ">
        <SliderComponent movies={movies} />
      </section>
    </>
  );
};

HomePageImage.propTypes = {
  movies: propTypes.array,
};
