import { HomeMoviesComponent } from '../movies/homemovies';
import { HomePageImage } from './homePageImage';

function Home({ movies, loading, onSectionChange }) {
  return (
    <>
      <HomePageImage movies={movies} />

      <main className="lg:px-sitex bg-primary p-4 text-gray-400">
        <h1 className="text-2xl font-bold text-center">
          Todas las películas de cuevana 8 online Gratis
        </h1>

        <section className="mt-10 flex lg:flex-row flex-col gap-8">
          <article className="w-[100%]">
            {loading ? <p>Loading movies...</p> : <HomeMoviesComponent movies={movies} onSectionChange={onSectionChange} />}
          </article>

        </section>
      </main>
    </>
  );
}

export default Home;
