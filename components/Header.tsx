import React from 'react';
import { LogoIcon } from './Icons';

interface HeaderProps {
    onShowRubric: () => void;
    onClearApiKey: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowRubric, onClearApiKey }) => {
  return (
    <header className="text-center">
      <div className="flex justify-center items-center gap-4">
        <LogoIcon className="w-12 h-12 text-green-500"/>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-300 tracking-tight">
          Analizador de Video con Rúbrica
        </h1>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Aplicación experimental creada por el profesor de Realización Audiovisual Miguelangel Tisera
      </p>
      <div className="mt-4 flex justify-center items-center gap-4">
        <button 
          onClick={onShowRubric}
          className="px-4 py-2 text-sm font-semibold text-green-300 bg-green-900/50 border border-green-800 rounded-lg hover:bg-green-800/70 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500"
        >
          Ver Rúbrica
        </button>
        <button 
          onClick={onClearApiKey}
          className="px-4 py-2 text-sm font-semibold text-yellow-300 bg-yellow-900/50 border border-yellow-800 rounded-lg hover:bg-yellow-800/70 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-500"
        >
          Cambiar API Key
        </button>
      </div>
    </header>
  );
};