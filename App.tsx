import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { VideoInput } from './components/VideoInput';
import { AnalysisResultDisplay } from './components/AnalysisResultDisplay';
import { Loader } from './components/Loader';
import { FilmReelIcon, SparklesIcon, RetryIcon } from './components/Icons';
import { RubricModal } from './components/RubricModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { analyzeVideo } from './services/geminiService';
import type { AnalysisResult } from './types';

const App: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [studentName, setStudentName] = useState<string>('');
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [studentEmail, setStudentEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRubricOpen, setIsRubricOpen] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini-api-key');
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      setIsApiModalOpen(true);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini-api-key', key);
    setIsApiModalOpen(false);
    setApiKeyError(null);
  };

  const handleClearApiKey = () => {
    setApiKey(null);
    localStorage.removeItem('gemini-api-key');
    setIsApiModalOpen(true);
  };

  const handleAnalysis = useCallback(async () => {
    if (!apiKey) {
      setError("Por favor, configura tu clave de API de Gemini primero.");
      setIsApiModalOpen(true);
      return;
    }
    if (!videoFile) {
      setError("Por favor, selecciona un archivo de video primero.");
      return;
    }
    if (!studentName || !videoTitle || !studentEmail) {
      setError("Por favor, completa todos los datos del estudiante y del video.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeVideo(videoFile, apiKey);
      setAnalysisResult(result);
    } catch (err: any) {
      if (err.message.includes('La clave de API no es válida')) {
        setApiKeyError(err.message);
        handleClearApiKey();
      } else {
        setError(err.message || "Ocurrió un error inesperado al analizar el video.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [videoFile, studentName, videoTitle, studentEmail, apiKey]);

  const isRetryableError = error?.includes('sobrecargado');

  return (
    <div className="min-h-screen text-gray-200 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Header 
            onShowRubric={() => setIsRubricOpen(true)}
            onClearApiKey={handleClearApiKey}
        />
        
        <main className="mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-2xl shadow-green-500/10">
            <div className="flex items-center gap-3 text-2xl font-bold text-green-400">
              <FilmReelIcon className="w-8 h-8"/>
              <h2>Paso 1: Completa los Datos y Sube tu Video</h2>
            </div>
            <p className="mt-2 text-gray-400">
              Ingresa tus datos, selecciona el video y luego haz clic en "Iniciar Análisis". El proceso puede tomar varios minutos.
            </p>
            <VideoInput 
              onFileChange={setVideoFile} 
              disabled={isLoading}
              studentName={studentName}
              setStudentName={setStudentName}
              videoTitle={videoTitle}
              setVideoTitle={setVideoTitle}
              studentEmail={studentEmail}
              setStudentEmail={setStudentEmail}
            />
            <div className="mt-6 text-center">
              <button
                onClick={handleAnalysis}
                disabled={!videoFile || !studentName || !videoTitle || !studentEmail || isLoading || !apiKey}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 font-semibold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transform hover:scale-105"
              >
                <SparklesIcon className="w-5 h-5"/>
                {isLoading ? "Analizando Video..." : "Iniciar Análisis"}
              </button>
            </div>
          </div>
          
          {isLoading && <Loader />}

          {error && (
            <div className="mt-8 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4" role="alert">
              <div>
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
              {isRetryableError && (
                <button
                  onClick={handleAnalysis}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors flex-shrink-0"
                >
                  <RetryIcon className="w-5 h-5" />
                  Reintentar
                </button>
              )}
            </div>
          )}

          {analysisResult && (
             <div className="mt-12">
                <AnalysisResultDisplay 
                  result={analysisResult} 
                  studentName={studentName}
                  videoTitle={videoTitle}
                  studentEmail={studentEmail}
                  apiKey={apiKey}
                />
             </div>
          )}
        </main>
      </div>
      {isRubricOpen && <RubricModal onClose={() => setIsRubricOpen(false)} />}
      {isApiModalOpen && (
        <ApiKeyModal 
            onSave={handleSaveApiKey}
            initialKey={apiKey || ''}
            error={apiKeyError}
            onClearKey={handleClearApiKey}
        />
      )}
    </div>
  );
};

export default App;