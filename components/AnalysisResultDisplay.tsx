import React from 'react';
import { jsPDF } from 'jspdf';
import type { AnalysisResult, CriterionEvaluation } from '../types';
import { ChartBarIcon, CheckCircleIcon, DocumentTextIcon, SparklesIcon, DownloadIcon } from './Icons';

interface AnalysisResultDisplayProps {
  result: AnalysisResult;
  studentName: string;
  videoTitle: string;
  studentEmail: string;
}

const getScoreColor = (score: number, maxScore: number) => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 90) return 'text-green-400';
  if (percentage >= 70) return 'text-yellow-400';
  if (percentage >= 50) return 'text-orange-400';
  return 'text-red-400';
};

const getLevelBadgeClass = (level: CriterionEvaluation['level']) => {
    switch(level) {
        case 'Excelente': return 'bg-green-500/20 text-green-300 border-green-500/30';
        case 'Bueno': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
        case 'Satisfactorio': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
        case 'Mejorable': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
        case 'Insuficiente': return 'bg-red-500/20 text-red-300 border-red-500/30';
        default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
}

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
    const percentage = score;
    const color = percentage >= 90 ? '#4ade80' : percentage >= 70 ? '#facc15' : percentage >= 50 ? '#fb923c' : '#f87171';
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50"/>
                <circle
                    className="transition-all duration-1000 ease-out"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="url(#scoreGradient)"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                />
                <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4ade80" />
                        <stop offset="100%" stopColor={color} />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl font-bold" style={{color}}>{score}</span>
                <span className="text-xs text-gray-400">/ 100</span>
            </div>
        </div>
    )
}

export const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ result, studentName, videoTitle, studentEmail }) => {
    const categories = [...new Set(result.evaluations.map(e => e.category))];

    const generateReportText = () => {
      let text = `ANÁLISIS DE VIDEO - RESULTADOS\n`;
      text += `=================================\n\n`;
      text += `Alumno: ${studentName}\n`;
      text += `Email: ${studentEmail}\n`;
      text += `Video: ${videoTitle}\n\n`;
      text += `---------------------------------\n`;
      text += `RESULTADO GENERAL\n`;
      text += `---------------------------------\n`;
      text += `Puntaje Final: ${result.finalScore} / 100\n`;
      text += `Calificación: ${result.finalGrade}\n`;
      text += `Feedback General: ${result.overallFeedback}\n\n`;
      
      text += `---------------------------------\n`;
      text += `ANÁLISIS DETALLADO\n`;
      text += `---------------------------------\n\n`;

      result.evaluations.forEach(e => {
        text += `Categoría: ${e.category}\n`;
        text += `Criterio: ${e.criterion}\n`;
        text += `Nivel: ${e.level}\n`;
        text += `Puntaje: ${e.score} / ${e.maxScore}\n`;
        text += `Feedback: ${e.feedback}\n\n`;
      });
      
      return text;
    }

    const handleDownloadTxt = () => {
      const text = generateReportText();
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analisis_video_${studentName.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    const handleDownloadPdf = () => {
        const doc = new jsPDF();
        const margin = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        const textWidth = pageWidth - margin * 2;
        let y = 20;

        const checkPageBreak = (neededHeight: number) => {
            if (y + neededHeight > 280) {
                doc.addPage();
                y = 20;
            }
        };

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text('Análisis de Video - Resultados', pageWidth / 2, y, { align: 'center' });
        y += 15;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Alumno: ${studentName}`, margin, y);
        y += 7;
        doc.text(`Email: ${studentEmail}`, margin, y);
        y += 7;
        doc.text(`Video: ${videoTitle}`, margin, y);
        y += 15;

        doc.setLineWidth(0.5);
        doc.line(margin, y - 5, pageWidth - margin, y - 5);

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Resultado General', margin, y);
        y += 8;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`Puntaje Final: ${result.finalScore} / 100`, margin, y);
        y += 7;
        doc.text(`Calificación Final: ${result.finalGrade}`, margin, y);
        y += 7;
        doc.setFont('helvetica', 'bold');
        doc.text('Feedback General:', margin, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        const splitOverallFeedback = doc.splitTextToSize(result.overallFeedback, textWidth);
        doc.text(splitOverallFeedback, margin, y);
        y += (splitOverallFeedback.length * 5) + 10;
        
        doc.line(margin, y - 5, pageWidth - margin, y - 5);
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Análisis Detallado por Criterio', margin, y);
        y += 10;
        
        result.evaluations.forEach(e => {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            const categoryText = `${e.category} - ${e.criterion}`;
            const splitCategory = doc.splitTextToSize(categoryText, textWidth);
            checkPageBreak(10 + (splitCategory.length * 5));
            doc.text(splitCategory, margin, y);
            y += (splitCategory.length * 5);
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Nivel: ${e.level}  |  Puntaje: ${e.score}/${e.maxScore}`, margin, y);
            y += 7;

            const splitFeedback = doc.splitTextToSize(e.feedback, textWidth);
            checkPageBreak(5 + (splitFeedback.length * 4));
            doc.text(splitFeedback, margin, y);
            y += (splitFeedback.length * 4) + 8;
        });

        doc.save(`analisis_video_${studentName.replace(/\s+/g, '_')}.pdf`);
    };

    return (
        <div className="space-y-10">
            <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-2xl shadow-green-500/10">
                <div className="flex items-center gap-3 text-2xl font-bold text-green-400 mb-4">
                    <ChartBarIcon className="w-8 h-8"/>
                    <h2>Resultado General</h2>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <ScoreCircle score={result.finalScore} />
                    <div className="flex-1 text-center sm:text-left">
                        <p className="text-xl font-bold text-gray-200">Calificación Final:</p>
                        <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-300">
                           {result.finalGrade}
                        </p>
                        <div className="mt-4 p-4 bg-gray-900/50 rounded-lg">
                           <p className="text-gray-300 font-semibold mb-1 flex items-center gap-2"><SparklesIcon className="w-5 h-5 text-yellow-400" />Feedback General:</p>
                           <p className="text-gray-400 text-sm">{result.overallFeedback}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="flex items-center gap-3 text-2xl font-bold text-green-400 mb-4">
                    <DownloadIcon className="w-8 h-8"/>
                    <h2>Descargar Reporte</h2>
                </div>
                 <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={handleDownloadTxt} className="inline-flex items-center justify-center gap-2 px-6 py-2 font-semibold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transform hover:scale-105">
                        <DocumentTextIcon className="w-5 h-5"/>
                        Descargar TXT
                    </button>
                    <button onClick={handleDownloadPdf} className="inline-flex items-center justify-center gap-2 px-6 py-2 font-semibold text-white bg-teal-600 rounded-lg shadow-lg hover:bg-teal-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 transform hover:scale-105">
                        <DocumentTextIcon className="w-5 h-5"/>
                        Descargar PDF
                    </button>
                 </div>
            </section>
            
            <section>
                <div className="flex items-center gap-3 text-2xl font-bold text-green-400 mb-4">
                    <DocumentTextIcon className="w-8 h-8"/>
                    <h2>Análisis Detallado por Criterio</h2>
                </div>
                <div className="space-y-6">
                    {categories.map(category => (
                        <div key={category} className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5">
                            <h3 className="text-lg font-bold text-teal-300 border-b border-gray-700 pb-2 mb-4">{category}</h3>
                            <div className="space-y-4">
                            {result.evaluations.filter(e => e.category === category).map((evaluation, index) => (
                                <div key={index} className="bg-gray-900/50 p-4 rounded-lg">
                                    <div className="flex flex-wrap justify-between items-start gap-2">
                                        <h4 className="font-semibold text-gray-200">{evaluation.criterion}</h4>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getLevelBadgeClass(evaluation.level)}`}>{evaluation.level}</span>
                                            <span className={`font-bold text-lg ${getScoreColor(evaluation.score, evaluation.maxScore)}`}>
                                                {evaluation.score}/{evaluation.maxScore}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-400 flex items-start gap-2">
                                        <CheckCircleIcon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0"/>
                                        <span>{evaluation.feedback}</span>
                                    </p>
                                </div>
                            ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <div className="mt-8 text-center p-4 bg-gray-900/50 border border-dashed border-gray-700 rounded-lg">
                <p className="text-gray-300 font-semibold">¡Importante!</p>
                <p className="text-gray-400 text-sm">
                Envíe una captura de pantalla con su clasificación a <a href="mailto:mtisera@unihumboldt.edu.ve" className="text-blue-400 hover:underline">mtisera@unihumboldt.edu.ve</a>
                </p>
            </div>
        </div>
    );
};