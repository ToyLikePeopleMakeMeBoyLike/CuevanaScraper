import propTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchForm } from '../forms/forms';
import { ListItems } from './listItems';

export const MenuBarComponent = ({ className, onSearch }) => {
  const location = useLocation();
  let MenuBarClass;
  const [genres, setGenres] = useState([]);

  if (location.pathname !== '/') {
    MenuBarClass = 'bg-[#141A32]';
  }
  if (location.pathname.includes('/movie')) {
    MenuBarClass = 'bg-transparent';
  }

  useEffect(() => {
    const fetchData = async () => {
      // This is fetching from TMDB, which we are not using anymore for genres.
      // This can be removed or replaced with a backend endpoint if genre filtering is needed.
      // For now, I'll leave it but it will likely fail or do nothing.
      // const response = await MoviesListGenre();
      // setGenres(response.genres);
    };
    fetchData();
  }, []);

  return (
    <>
      <menu
        className={`flex text-white w-full py-[1.2rem] justify-between items-center absolute z-40 px-20 lg:px-sitex ${className} ${MenuBarClass}`}
      >
        <div className="gap-12 flex">
          <img
            src="	https://cuevana8.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcuevana8.24457267.png&w=256&q=75"
            alt="Home image"
            className="w-52 object-cover"
          />

          <div className="relative xl:block hidden">
            <ul className="flex h-full items-center gap-8 text-sm">
              <ListItems text={'Inicio'} route="/" showIcon={false} />
              <ListItems text={'Últimas'} route="/peliculas/1" />
              <ListItems text={'Estrenos'} route="/estrenos/1" />
              <ListItems 
                text={'Tendencias'} 
                route="#" 
                submenuOptions={[
                  { text: 'Día', route: '/tendencias/dia/1' },
                  { text: 'Semana', route: '/tendencias/semana/1' },
                ]}
              />
              <ListItems text={'Series'} route="#" />
            </ul>
          </div>
        </div>

        <SearchForm placeholder={'Buscador...'} onSearch={onSearch} />
      </menu>
    </>
  );
};

MenuBarComponent.propTypes = {
  className: propTypes.string,
  onSearch: propTypes.func.isRequired,
};
