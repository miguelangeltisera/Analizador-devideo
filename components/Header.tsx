import React from 'react';
import { LogoIcon } from './Icons';

interface HeaderProps {
    onShowRubric: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowRubric }) => {
  return (
    <header className="text-center">
      <div className="flex justify-center items-center gap-4">
        <LogoIcon className="w-12 h-12 text-green-600"/>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500 tracking-tight">
          Evaluación de Vídeo con Rúbrica
        </h1>
      </div>
      <p className="mt-2 text-base text-gray-600">
        Aplicación experimental creada por el profesor Miguelángel Tisera
      </p>
      <div className="mt-4 flex justify-center items-center gap-4">
        <button 
          onClick={onShowRubric}
          className="px-4 py-2 text-sm font-semibold text-green-800 bg-white border border-green-300 rounded-lg hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-100 focus:ring-green-500"
        >
          Ver Rúbrica
        </button>
      </div>
    </header>
  );
};