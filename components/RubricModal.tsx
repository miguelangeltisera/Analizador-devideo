import React from 'react';
import { RUBRIC_TEXT } from '../constants';

interface RubricModalProps {
  onClose: () => void;
}

export const RubricModal: React.FC<RubricModalProps> = ({ onClose }) => {
  return (
    <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
            <h2 className="text-xl font-bold text-green-400">Rúbrica de Evaluación Audiovisual</h2>
            <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Cerrar modal"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans">
            {RUBRIC_TEXT}
          </pre>
        </div>
      </div>
    </div>
  );
};