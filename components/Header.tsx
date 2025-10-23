import React from 'react';
import { LogoIcon } from './Icons';

interface HeaderProps {
    onShowRubric: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowRubric }) => {
  return (
    <header className="text-center">
      <div className="flex justify-center items-center gap-4">
        <LogoIcon className="w-12 h-12 text-blue-500"/>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 tracking-tight">
          Analizador de Video con Rúbrica
        </h1>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Aplicación experimental creada por el profesor de Realización Audiovisual Miguelangel Tisera
      </p>
      <div className="mt-4">
        <button 
          onClick={onShowRubric}
          className="px-4 py-2 text-sm font-semibold text-blue-300 bg-blue-900/50 border border-blue-800 rounded-lg hover:bg-blue-800/70 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
        >
          Ver Rúbrica de Evaluación
        </button>
      </div>
    </header>
  );
};