import propTypes from 'prop-types';
import { PlayIcon } from '../icons/icons';
import { Link } from 'react-router-dom';

const MoviesCard = ({ title, poster_path, id, onClick }) => {
  return (
    <Link
      to={`/movie?url=${encodeURIComponent(id)}`}
      onClick={onClick}
      className="relative max-w-[180px] flex flex-col gap-2 items-center text-white cursor-pointer [&>div>div]:hover:scale-100 [&>div>img]:hover:brightness-[0.8]"
    >
      <div className="w-full flex items-center justify-center relative min-h-[225.14px]">
        <img
          className="w-full object-cover rounded brightness-90 "
          src={poster_path}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src =
              'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg';
          }}
        />

        <div className="absolute h-full w-full items-center justify-center flex scale-0 transition duration-75">
          <PlayIcon />
        </div>
      </div>

      <span className="text-sm">{title}</span>
    </Link>
  );
};

export default MoviesCard;

MoviesCard.propTypes = {
  title: propTypes.string,
  poster_path: propTypes.string,
  id: propTypes.string.isRequired,
  onClick: propTypes.func.isRequired,
};
