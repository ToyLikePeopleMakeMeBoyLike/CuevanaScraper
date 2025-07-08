import { Link } from "react-router-dom";

/* eslint-disable react/prop-types */
export function MovieContentHomePage({
  title,
  type,
  rating,
  release_date,
  overview,
  url
}) {
  return (
    <>
      <header className="h-20 flex items-center">
        <Link to={`/watch?url=${encodeURIComponent(url)}`} className="hover:scale-x-105">
          <div className="font-bold text-white text-5xl lg:pb-0 pb-8">
            {title}
            <span className="align-middle text-[10px] text-black ml-4 bg-yellow-400 rounded-full px-2">
              {type}
            </span>
          </div>
        </Link>
      </header>

      {/* rating */}
      <div>
        <span className="text-yellow-400">{rating}/10</span>
        <span className="text-gray-400 text-sm ml-2">
          {release_date}
        </span>
      </div>

      {/* overview */}
      <div className="text-gray-400 text-xl mt-4 leading-8 font-[350]">
        <p className="max-h-[100px] overflow-auto">{overview}</p>
      </div>
    </>
  );
}
