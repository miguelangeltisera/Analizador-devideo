import React, { useState } from 'react';
import { SparklesIcon } from './Icons';

interface ApiKeyModalProps {
  onSave: (key: string) => void;
  initialKey?: string;
  onClearKey?: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave, initialKey, onClearKey }) => {
  const [apiKey, setApiKey] = useState(initialKey || '');

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl shadow-green-500/10 p-6 sm:p-8">
        <div className="text-center">
            <SparklesIcon className="w-12 h-12 mx-auto text-green-400" />
            <h2 className="mt-4 text-2xl font-bold text-white">
                Configura tu Clave de API de Gemini
            </h2>
            <p className="mt-2 text-sm text-gray-400">
                Para usar esta aplicación, necesitas una clave de API de Google Gemini. 
                Tu clave se guardará de forma segura en tu navegador.
            </p>
        </div>
        
        <div className="mt-6">
          <label htmlFor="api-key" className="block text-sm font-medium text-gray-300 mb-1">
            Tu Clave de API
          </label>
          <input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Pega tu clave aquí (empieza con AIza...)"
            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="mt-6 flex flex-col gap-4">
            <button
                onClick={handleSave}
                disabled={!apiKey.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 font-semibold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
                Guardar y Continuar
            </button>
            {initialKey && onClearKey && (
                 <button
                    onClick={onClearKey}
                    className="w-full text-sm font-medium text-gray-400 hover:text-red-400 transition-colors"
                >
                    Borrar clave y salir
                </button>
            )}
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
            <p>
                ¿No tienes una clave? Consíguela gratis en{' '}
                <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-semibold text-green-400 hover:underline"
                >
                    Google AI Studio
                </a>.
            </p>
        </div>
      </div>
    </div>
  );
};