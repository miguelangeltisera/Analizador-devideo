
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="mt-8 flex flex-col justify-center items-center gap-4 text-center">
      <svg className="animate-spin h-10 w-10 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <div className="text-gray-400">
        <p className="font-semibold text-lg text-gray-300">Analizando el video...</p>
        <p className="text-sm">Esto puede tardar unos minutos. Por favor, no cierres esta ventana.</p>
      </div>
    </div>
  );
};