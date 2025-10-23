import React, { useState, useRef } from 'react';
import { UploadIcon, CheckBadgeIcon } from './Icons';
import { findCachedFile, cacheFile } from '../services/cacheService';

interface VideoInputProps {
  onFileChange: (file: File | null) => void;
  disabled: boolean;
  studentName: string;
  setStudentName: (name: string) => void;
  videoTitle: string;
  setVideoTitle: (title: string) => void;
  studentEmail: string;
  setStudentEmail: (email: string) => void;
}

export const VideoInput: React.FC<VideoInputProps> = ({ 
    onFileChange, 
    disabled,
    studentName,
    setStudentName,
    videoTitle,
    setVideoTitle,
    studentEmail,
    setStudentEmail
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isCached, setIsCached] = useState(false);

  const processFile = (file: File | null, fromCache: boolean) => {
    if (file) {
      setFileName(file.name);
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      onFileChange(file);
      setIsCached(fromCache);
      if (!fromCache) {
        cacheFile(file).catch(err => console.error("Error al guardar en caché:", err));
      }
    } else {
      setFileName(null);
      setVideoSrc(null);
      onFileChange(null);
      setIsCached(false);
    }
    setPendingFile(null);
  };

  const handleFileSelected = async (file: File | undefined) => {
    if (!file || !file.type.startsWith('video/')) {
        return;
    }
    const cachedVersion = await findCachedFile(file);
    if (cachedVersion) {
        setPendingFile(file); 
    } else {
        processFile(file, false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleFileSelected(file);
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };
  
  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
       if (fileInputRef.current) {
          fileInputRef.current.files = event.dataTransfer.files;
       }
       handleFileSelected(file);
    }
  };
  
  const handleUseCached = async () => {
      if (!pendingFile) return;
      const cachedFile = await findCachedFile(pendingFile);
      processFile(cachedFile ?? pendingFile, !!cachedFile);
  };

  const handleUploadNew = () => {
      if (!pendingFile) return;
      processFile(pendingFile, false);
  };

  const inputStyles = "mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="student-name" className="block text-sm font-medium text-gray-300">
                  Nombre del Alumno
                </label>
                <input
                  type="text"
                  id="student-name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className={inputStyles}
                  disabled={disabled}
                  required
                />
            </div>
            <div>
                <label htmlFor="video-title" className="block text-sm font-medium text-gray-300">
                  Título del Video
                </label>
                <input
                  type="text"
                  id="video-title"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Ej: Cortometraje 'El Viaje'"
                  className={inputStyles}
                  disabled={disabled}
                  required
                />
            </div>
            <div className="md:col-span-2">
                <label htmlFor="student-email" className="block text-sm font-medium text-gray-300">
                  Email del Alumno
                </label>
                <input
                  type="email"
                  id="student-email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="ejemplo@email.com"
                  className={inputStyles}
                  disabled={disabled}
                  required
                />
            </div>
        </div>
        
        {pendingFile ? (
            <div className="bg-gray-700/50 border border-green-700 rounded-lg p-4 text-center">
                <h3 className="font-semibold text-green-300">Video Encontrado en Caché</h3>
                <p className="text-sm text-gray-400 mt-1">
                    Ya has subido "{pendingFile.name}" antes. ¿Quieres usar la versión guardada para ahorrar tiempo?
                </p>
                <div className="mt-4 flex justify-center gap-4">
                    <button onClick={handleUseCached} className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                        Usar Versión Guardada
                    </button>
                    <button onClick={handleUploadNew} className="px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors">
                        Subir de Nuevo
                    </button>
                </div>
            </div>
        ) : (
            <label 
                htmlFor="video-upload" 
                className="relative block w-full h-48 sm:h-64 border-2 border-dashed border-gray-600 rounded-lg flex flex-col justify-center items-center text-center cursor-pointer hover:border-green-500 transition-colors bg-gray-800/50"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
              {videoSrc ? (
                <>
                    <video src={videoSrc} controls className="absolute inset-0 w-full h-full object-contain rounded-lg p-1"></video>
                    {isCached && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-600/80 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
                            <CheckBadgeIcon className="w-4 h-4" />
                            <span>Cacheado</span>
                        </div>
                    )}
                </>
              ) : (
                <>
                    <UploadIcon className="w-12 h-12 mx-auto text-gray-500"/>
                    <span className="mt-2 block text-sm font-semibold text-gray-300">
                    {fileName || "Arrastra y suelta un video, o haz clic para seleccionar"}
                    </span>
                    <span className="block text-xs text-gray-500">MP4, MOV, WEBM, etc.</span>
                </>
              )}
              <input
                id="video-upload"
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="sr-only"
                onChange={handleFileChange}
                disabled={disabled}
              />
            </label>
        )}
    </div>
  );
};
