import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';
import { GEMINI_MODEL, RUBRIC_TEXT } from '../constants';

// Helper function to convert File to a GoogleGenerativeAI.Part object
const fileToGenerativePart = async (file: File) => {
  const base64EncodedData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
};

// FIX: Remove apiKey parameter and use process.env.API_KEY directly.
export const analyzeVideo = async (videoFile: File): Promise<AnalysisResult> => {
  const videoPart = await fileToGenerativePart(videoFile);

  const prompt = `
    Eres un profesor experto en Realización Audiovisual y Películas de Marca. Tu tarea es evaluar un proyecto de video de un estudiante utilizando la rúbrica detallada que se proporciona.
    
    Analiza el video adjunto y completa la evaluación para cada criterio, asignando un puntaje, seleccionando el nivel de logro y proporcionando un feedback constructivo y detallado.
    
    Al final, calcula el puntaje total sumando todos los puntajes de los criterios y proporciona un feedback general sobre el proyecto.
    
    Tu respuesta DEBE ser un objeto JSON válido que se ajuste al esquema proporcionado. No incluyas \`\`\`json ni ningún otro formato, solo el JSON puro.
    
    ${RUBRIC_TEXT}
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      evaluations: {
        type: Type.ARRAY,
        description: 'Lista de evaluaciones para cada criterio de la rúbrica.',
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: 'La categoría principal del criterio (e.g., "Asimilación Práctica de Conceptos Teóricos").' },
            criterion: { type: Type.STRING, description: 'El criterio específico evaluado (e.g., "Ejecución técnica").' },
            score: { type: Type.NUMBER, description: 'El puntaje asignado al criterio.' },
            maxScore: { type: Type.NUMBER, description: 'El puntaje máximo posible para el criterio.' },
            level: { type: Type.STRING, description: 'El nivel de desempeño (Excelente, Bueno, etc.).' },
            feedback: { type: Type.STRING, description: 'Feedback detallado y constructivo para este criterio.' },
          },
          required: ['category', 'criterion', 'score', 'maxScore', 'level', 'feedback'],
        },
      },
      finalScore: { type: Type.NUMBER, description: 'El puntaje final total (suma de todos los puntajes).' },
      finalGrade: { type: Type.STRING, description: 'La calificación final basada en la escala de puntajes.' },
      overallFeedback: { type: Type.STRING, description: 'Un párrafo con feedback general y constructivo sobre todo el proyecto.' },
    },
    required: ['evaluations', 'finalScore', 'finalGrade', 'overallFeedback'],
  };
  
  try {
    // FIX: Initialize GoogleGenAI with API key from environment variables.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const result = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ parts: [videoPart, { text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.2,
      },
    });
    
    const jsonString = result.text.trim();
    const parsedResult: AnalysisResult = JSON.parse(jsonString);
    return parsedResult;
  } catch (error) {
    console.error("Error analyzing video with Gemini:", error);
    if (error instanceof Error) {
        // Check for specific overload error (503)
        if (error.message.includes('503') && (error.message.includes('overloaded') || error.message.includes('UNAVAILABLE'))) {
            throw new Error("El modelo de IA está sobrecargado en este momento. Por favor, espera unos segundos y vuelve a intentarlo.");
        }
        throw new Error(`Fallo al analizar el video: ${error.message}`);
    }
    throw new Error("Ocurrió un error desconocido durante el análisis del video.");
  }
};