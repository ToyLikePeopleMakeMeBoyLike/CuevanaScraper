import ButtonToggle from '../home/buttonToggle';
import { useState } from 'react';

const OPTIONS = [
  { name: 'Día', id: 'dia' },
  { name: 'Semana', id: 'semana' },
];

export const HeaderMoviesOptions = ({ onSectionChange }) => {
  const [selectedSection, setSelectedSection] = useState('Día');

  const handleSelection = (option) => {
    setSelectedSection(option.name);
    onSectionChange(option.id);
  };

  return (
    <>
      <header className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white">Películas online</h1>

        <div className="flex [&>button]:p-4 [&>button]:border-b-2 [&>button]:uppercase">
          {OPTIONS.map((option) => (
            <ButtonToggle isSelected={selectedSection === option.name} onClick={() => handleSelection(option)} key={option.id}>
              {option.name}
            </ButtonToggle>
          ))}
        </div>
      </header>
    </>
  );
};
