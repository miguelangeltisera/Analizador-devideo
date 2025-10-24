import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import type { AnalysisResult, CriterionEvaluation } from '../types';
import { ChartBarIcon, CheckCircleIcon, DocumentTextIcon, SparklesIcon, DownloadIcon } from './Icons';

const getScoreColor = (score: number, maxScore: number) => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 90) return 'text-green-500';
  if (percentage >= 70) return 'text-yellow-500';
  if (percentage >= 50) return 'text-orange-500';
  return 'text-red-500';
};

const getLevelBadgeClass = (level: CriterionEvaluation['level']) => {
    switch(level) {
        case 'Excelente': return 'bg-green-100 text-green-800 border-green-300';
        case 'Bueno': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'Satisfactorio': return 'bg-blue-100 text-blue-800 border-blue-300';
        case 'Mejorable': return 'bg-orange-100 text-orange-800 border-orange-300';
        case 'Insuficiente': return 'bg-red-100 text-red-800 border-red-300';
        default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
}

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
    const [offset, setOffset] = useState(2 * Math.PI * 45);
    const percentage = score;
    const color = percentage >= 90 ? '#22c55e' : percentage >= 70 ? '#f59e0b' : percentage >= 50 ? '#f97316' : '#ef4444';
    const circumference = 2 * Math.PI * 45;

    useEffect(() => {
        const finalOffset = circumference - (percentage / 100) * circumference;
        const timer = setTimeout(() => setOffset(finalOffset), 100);
        return () => clearTimeout(timer);
    }, [score, circumference, percentage]);

    return (
        <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="text-gray-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50"/>
                <circle
                    className="transition-all duration-1000 ease-out"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
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
                <span className="text-xs text-gray-600">/ 100</span>
            </div>
        </div>
    )
}

interface AnalysisResultDisplayProps {
  result: AnalysisResult;
  studentName: string;
  videoTitle: string;
  studentEmail: string;
}

export const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ result, studentName, videoTitle, studentEmail }) => {
    const categories: string[] = [...new Set<string>(result.evaluations.map(e => e.category))];
    const [openCategory, setOpenCategory] = useState<string | null>(categories[0] || null);
    
    const handleToggleCategory = (category: string) => {
        setOpenCategory(prev => (prev === category ? null : category));
    };

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

    const handleDownloadPdf = async () => {
        const doc = new jsPDF();
        const PAGE_WIDTH = doc.internal.pageSize.getWidth();
        const PAGE_HEIGHT = doc.internal.pageSize.getHeight();
        const MARGIN = 15;
        const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
        const HEADER_FOOTER_HEIGHT = 20;
    
        // --- Colors and Fonts ---
        const COLOR_PRIMARY = '#059669'; // Green-600
        const COLOR_TEXT_DARK = '#1f2937'; // Gray-800
        const COLOR_TEXT_LIGHT = '#6b7280'; // Gray-500
        const COLOR_CARD_BG = '#f3f4f6'; // Gray-100
    
        // --- Helper Functions ---
        const getScoreHexColor = (score: number) => {
            if (score >= 90) return '#4ade80';
            if (score >= 70) return '#facc15';
            if (score >= 50) return '#fb923c';
            return '#f87171';
        };
        
        const getLevelHexColor = (level: CriterionEvaluation['level']) => {
            switch(level) {
                case 'Excelente': return '#10b981'; // green-500
                case 'Bueno': return '#f59e0b'; // yellow-500
                case 'Satisfactorio': return '#3b82f6'; // blue-500
                case 'Mejorable': return '#f97316'; // orange-500
                case 'Insuficiente': return '#ef4444'; // red-500
                default: return COLOR_TEXT_LIGHT;
            }
        };

        const getScoreCircleSVG = (score: number, color: string) => {
            const circumference = 2 * Math.PI * 45;
            const offset = circumference - (score / 100) * circumference;
            // Using a simple color instead of a gradient for better PDF compatibility
            return `
              <svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
                <circle stroke-width="10" stroke="#e5e7eb" fill="transparent" r="45" cx="60" cy="60"/>
                <circle
                  stroke-width="10"
                  stroke-dasharray="${circumference}"
                  stroke-dashoffset="${offset}"
                  stroke-linecap="round"
                  stroke="${color}"
                  fill="transparent"
                  r="45"
                  cx="60"
                  cy="60"
                  transform="rotate(-90 60 60)"
                />
                <text x="60" y="68" font-family="helvetica, sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="${color}">${score}</text>
                <text x="60" y="80" font-family="helvetica, sans-serif" font-size="8" text-anchor="middle" fill="${COLOR_TEXT_LIGHT}">/ 100</text>
              </svg>
            `;
          };

        const addHeader = (doc: jsPDF) => {
            doc.setFillColor(COLOR_PRIMARY);
            doc.rect(0, 0, PAGE_WIDTH, HEADER_FOOTER_HEIGHT, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor('#FFFFFF');
            doc.text('Reporte de Análisis de Video', MARGIN, 13);
        };

        const addFooter = (doc: jsPDF) => {
            // FIX: The type definition for `jsPDF` is incorrect, causing a compile error on `getNumberOfPages`.
            // Using `doc.internal.pages.length` is a reliable alternative to get the page count.
            const pageCount = doc.internal.pages.length;
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.setTextColor(COLOR_TEXT_LIGHT);
                doc.text(`Página ${i} de ${pageCount}`, PAGE_WIDTH / 2, PAGE_HEIGHT - 10, { align: 'center' });
                doc.text(`Generado por Analizador de Video con Rúbrica`, MARGIN, PAGE_HEIGHT - 10);
            }
        };

        let y = HEADER_FOOTER_HEIGHT + 15;

        const checkPageBreak = (neededHeight: number) => {
            if (y + neededHeight > PAGE_HEIGHT - HEADER_FOOTER_HEIGHT) {
                doc.addPage();
                addHeader(doc);
                y = HEADER_FOOTER_HEIGHT + 10;
            }
        };

        // --- PDF Generation Starts ---
        addHeader(doc);

        // Student Info
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(COLOR_TEXT_DARK);
        doc.text('Alumno:', MARGIN, y);
        doc.setFont('helvetica', 'normal');
        doc.text(studentName, MARGIN + 20, y);

        doc.setFont('helvetica', 'bold');
        doc.text('Video:', PAGE_WIDTH / 2, y);
        doc.setFont('helvetica', 'normal');
        doc.text(videoTitle, PAGE_WIDTH / 2 + 15, y);
        y += 7;

        // General Results
        y += 10;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(COLOR_PRIMARY);
        doc.text('Resultado General', MARGIN, y);
        y += 5;
        doc.setDrawColor(COLOR_PRIMARY);
        doc.line(MARGIN, y, MARGIN + 40, y);
        y += 10;

        // Add Score Circle Image
        const scoreColor = getScoreHexColor(result.finalScore);
        const svgString = getScoreCircleSVG(result.finalScore, scoreColor);
        const svgDataUrl = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgString)));
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const img = new Image();
            await new Promise<void>(resolve => {
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    doc.addImage(canvas, 'PNG', MARGIN, y, 40, 40);
                    resolve();
                };
                img.src = svgDataUrl;
            });
        }
        
        // General results text beside circle
        const textX = MARGIN + 40 + 10;
        const textWidth = CONTENT_WIDTH - 40 - 10;
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(COLOR_TEXT_DARK);
        doc.text('Calificación Final:', textX, y + 8);
        
        doc.setFontSize(22);
        doc.setTextColor(scoreColor);
        doc.text(result.finalGrade, textX, y + 18);
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(COLOR_TEXT_DARK);
        doc.text('Feedback General:', textX, y + 28);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(COLOR_TEXT_LIGHT);
        const splitFeedback = doc.splitTextToSize(result.overallFeedback, textWidth);
        doc.text(splitFeedback, textX, y + 34);

        y += 50; // space after general results

        // Detailed Analysis
        y += 10;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(COLOR_PRIMARY);
        doc.text('Análisis Detallado por Criterio', MARGIN, y);
        y += 5;
        doc.setDrawColor(COLOR_PRIMARY);
        doc.line(MARGIN, y, MARGIN + 68, y);
        y += 10;

        result.evaluations.forEach(e => {
            doc.setFont('helvetica', 'bold');
            const criterionText = `${e.category} - ${e.criterion}`;
            const feedbackLines = doc.splitTextToSize(e.feedback, CONTENT_WIDTH - 10);
            const neededHeight = 20 + (feedbackLines.length * 5); // Approximate height
            
            checkPageBreak(neededHeight + 10);

            doc.setFillColor(COLOR_CARD_BG);
            doc.setDrawColor(COLOR_CARD_BG);
            doc.roundedRect(MARGIN, y, CONTENT_WIDTH, neededHeight, 3, 3, 'F');
            
            let cardY = y + 8;
            
            doc.setFontSize(11);
            doc.setTextColor(COLOR_TEXT_DARK);
            const splitCriterion = doc.splitTextToSize(criterionText, CONTENT_WIDTH - 50);
            doc.text(splitCriterion, MARGIN + 5, cardY);
            
            const scoreText = `${e.score}/${e.maxScore}`;
            doc.setFontSize(14);
            doc.setTextColor(getScoreHexColor((e.score / e.maxScore) * 100));
            doc.text(scoreText, PAGE_WIDTH - MARGIN - 5, cardY, { align: 'right' });
            
            cardY += 8;

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(getLevelHexColor(e.level));
            doc.text(e.level.toUpperCase(), MARGIN + 5, cardY);
            
            cardY += 6;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(COLOR_TEXT_LIGHT);
            doc.text(feedbackLines, MARGIN + 5, cardY);

            y += neededHeight + 5; // move to next card position
        });

        addFooter(doc);
        doc.save(`analisis_video_${studentName.replace(/\s+/g, '_')}.pdf`);
    };

    return (
        <div className="space-y-10">
            <section className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-lg animate-fade-in-up">
                <div className="flex items-center gap-3 text-2xl font-bold text-green-700 mb-4">
                    <ChartBarIcon className="w-8 h-8"/>
                    <h2>Resultado General</h2>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <ScoreCircle score={result.finalScore} />
                    <div className="flex-1 text-center sm:text-left">
                        <p className="text-xl font-bold text-gray-800">Calificación Final:</p>
                        <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">
                           {result.finalGrade}
                        </p>
                        <div className="mt-4 p-4 bg-green-50 rounded-lg">
                           <div className="flex justify-between items-center mb-1">
                                <p className="text-gray-700 font-semibold flex items-center gap-2"><SparklesIcon className="w-5 h-5 text-yellow-500" />Feedback General:</p>
                           </div>
                           <p className="text-gray-600 text-sm">{result.overallFeedback}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center gap-3 text-2xl font-bold text-green-700 mb-4">
                    <DownloadIcon className="w-8 h-8"/>
                    <h2>Descargar Reporte</h2>
                </div>
                 <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={handleDownloadTxt} className="inline-flex items-center justify-center gap-2 px-6 py-2 font-semibold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-100 focus:ring-green-500 transform hover:scale-105">
                        <DocumentTextIcon className="w-5 h-5"/>
                        Descargar TXT
                    </button>
                    <button onClick={handleDownloadPdf} className="inline-flex items-center justify-center gap-2 px-6 py-2 font-semibold text-white bg-teal-600 rounded-lg shadow-lg hover:bg-teal-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-100 focus:ring-teal-500 transform hover:scale-105">
                        <DocumentTextIcon className="w-5 h-5"/>
                        Descargar PDF
                    </button>
                 </div>
            </section>
            
            <section className="opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center gap-3 text-2xl font-bold text-green-700 mb-4">
                    <DocumentTextIcon className="w-8 h-8"/>
                    <h2>Análisis Detallado por Criterio</h2>
                </div>
                <div className="space-y-4">
                    {categories.map(category => (
                        <div key={category} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <button 
                                onClick={() => handleToggleCategory(category)}
                                className="w-full flex justify-between items-center text-left p-4 hover:bg-gray-50 transition-colors"
                                aria-expanded={openCategory === category}
                            >
                                <h3 className="text-lg font-bold text-teal-600">{category}</h3>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-gray-500 transition-transform duration-300 ${openCategory === category ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div className={`transition-all duration-500 ease-in-out ${openCategory === category ? 'max-h-screen' : 'max-h-0'}`}>
                                <div className="p-4 border-t border-gray-200 space-y-4">
                                    {result.evaluations.filter(e => e.category === category).map((evaluation, index) => (
                                        <div key={index} className="bg-gray-100 p-4 rounded-lg">
                                            <div className="flex flex-wrap justify-between items-start gap-2">
                                                <h4 className="font-semibold text-gray-800">{evaluation.criterion}</h4>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getLevelBadgeClass(evaluation.level)}`}>{evaluation.level}</span>
                                                    <span className={`font-bold text-lg ${getScoreColor(evaluation.score, evaluation.maxScore)}`}>
                                                        {evaluation.score}/{evaluation.maxScore}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-600 flex items-start gap-2">
                                                <CheckCircleIcon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0"/>
                                                <span>{evaluation.feedback}</span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <div className="mt-8 text-center p-4 bg-green-50 border border-dashed border-green-200 rounded-lg opacity-0 animate-fade-in" style={{ animationDelay: '600ms' }}>
                <p className="text-gray-700 font-semibold">¡Importante!</p>
                <p className="text-gray-600 text-sm">
                Envíe una captura de pantalla con su clasificación a <a href="mailto:mtisera@unihumboldt.edu.ve" className="text-blue-500 hover:underline">mtisera@unihumboldt.edu.ve</a>
                </p>
            </div>
        </div>
    );
};