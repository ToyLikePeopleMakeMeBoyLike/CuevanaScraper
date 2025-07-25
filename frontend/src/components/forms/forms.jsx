import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from '../icons/icons';
import propTypes from 'prop-types';

export const SearchForm = ({ placeholder, onSearch }) => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const handleSubmitFunction = (data) => {
    if (onSearch) {
      onSearch(data.searchBar);
    }
    navigate(`/movies`);
  };

  return (
    <div className={'relative xl:block hidden'}>
      <form onSubmit={handleSubmit(handleSubmitFunction)} className="flex items-center">
        <input
          type="text"
          className="py-2 px-4 pr-10 rounded-full w-[200px] text-sm bg-[#0E152D]/60 text-gray-300 border border-blue-500/20 placeholder:select-none transition-all focus:w-[220px]"
          name="searchBar"
          placeholder={placeholder}
          {...register('searchBar', {
            required: true,
          })}
        />

        <button type="submit" className="flex items-center">
          <SearchIcon className={'absolute right-4 text-blue-600 hover:scale-125 cursor-pointer'} />
        </button>
      </form>
    </div>
  );
};

SearchForm.propTypes = {
  placeholder: propTypes.string,
  onSearch: propTypes.func.isRequired,
};
