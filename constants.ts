
export const GEMINI_MODEL = 'gemini-2.5-pro';

export const RUBRIC_TEXT = `
**RÚBRICA DETALLADA DE REALIZACIÓN AUDIOVISUAL**

**PUNTAJE MÁXIMO TOTAL: 100 PUNTOS**

A continuación se presenta la rúbrica detallada que debes usar para evaluar el video proporcionado. Debes ser estricto, objetivo y profesional en tu análisis, actuando como un profesor de Realización Audiovisual.

---

**1. Asimilación Práctica de Conceptos Teóricos (40 puntos en total)**

*   **Criterio: Exámenes escritos/análisis teórico (10 pts)**
    *   Excelente (10 pts): Respuestas completas, con ejemplos audiovisuales y análisis crítico.
    *   Bueno (8-9 pts): Respuestas claras, aunque con algunos vacíos conceptuales.
    *   Satisfactorio (6-7 pts): Respuestas básicas, sin profundidad en el análisis.
    *   Mejorable (4-5 pts): Respuestas incompletas o con errores técnicos.
    *   Insuficiente (0-3 pts): Respuestas ausentes o incorrectas.

*   **Criterio: Defensa oral de proyectos (10 pts)**
    *   Excelente (10 pts): Argumentación sólida, dominio de terminología técnica y justificación creativa.
    *   Bueno (8-9 pts): Explicación coherente, con algunas dificultades para sustentar decisiones.
    *   Satisfactorio (6-7 pts): Exposición básica, sin vincular teoría y práctica.
    *   Mejorable (4-5 pts): Dificultades para comunicar ideas o responder preguntas.
    *   Insuficiente (0-3 pts): Defensa ausente o sin fundamentos.

*   **Criterio: Análisis de obras audiovisuales (10 pts)**
    *   Excelente (10 pts): Interpretación innovadora, integrando contexto sociocultural y recursos técnicos.
    *   Bueno (8-9 pts): Análisis correcto, pero con falta de conexión con teorías vistas en clase.
    *   Satisfactorio (6-7 pts): Descripción superficial de elementos técnicos o narrativos.
    *   Mejorable (4-5 pts): Errores en la identificación de técnicas o conceptos clave.
    *   Insuficiente (0-3 pts): Análisis ausente o irrelevante.

*   **Criterio: Pensamiento crítico (10 pts, derivado de la suma de los anteriores)**
    *   Excelente (3-4 pts sobre el total de esta categoría): Reflexión profunda sobre el impacto social de sus proyectos y autocrítica constructiva.
    *   Bueno (2-3 pts): Análisis básico de sus decisiones creativas y técnicas.
    *   Satisfactorio (1-2 pts): Limitaciones para justificar sus elecciones artísticas.
    *   Insuficiente (0-1 pts): Falta de autoevaluación o crítica irrelevante.

---

**2. Calidad y Dedicación en Trabajos Prácticos (40 puntos en total)**

*   **Criterio: Ejecución técnica (10 pts)**
    *   Excelente (10 pts): Uso avanzado de equipos y software (ej: iluminación, edición, sonido).
    *   Bueno (8-9 pts): Buen manejo técnico, con pequeños errores no determinantes.
    *   Satisfactorio (6-7 pts): Cumplimiento básico de requisitos técnicos.
    *   Mejorable (4-5 pts): Errores técnicos que afectan la calidad del producto final.
    *   Insuficiente (0-3 pts): Incumplimiento grave de estándares técnicos.

*   **Criterio: Proceso creativo (10 pts)**
    *   Excelente (10 pts): Documentación detallada (storyboards, guiones), iteraciones y mejora continua.
    *   Bueno (8-9 pts): Proceso creativo claro, aunque con falta de ajustes durante la producción.
    *   Satisfactorio (6-7 pts): Entrega de documentos básicos sin evolución significativa.
    *   Mejorable (4-5 pts): Falta de planificación o improvisación constante.
    *   Insuficiente (0-3 pts): Ausencia de documentos de preproducción.

*   **Criterio: Resolución de problemas (10 pts)**
    *   Excelente (10 pts): Soluciones innovadoras ante imprevistos (ej: cambios de locación, fallos técnicos).
    *   Bueno (8-9 pts): Adaptación adecuada, aunque con dependencia del docente para resolver.
    *   Satisfactorio (6-7 pts): Respuestas reactivas sin proactividad.
    *   Mejorable (4-5 pts): Dificultades para superar obstáculos, afectando el cronograma.
    *   Insuficiente (0-3 pts): Problemas no resueltos que paralizan el proyecto.

*   **Criterio: Cumplimiento de plazos (10 pts)**
    *   Excelente (10 pts): Entrega puntual y en formato solicitado.
    *   Bueno (8-9 pts): Retraso menor (1-2 días) con justificación válida.
    *   Satisfactorio (6-7 pts): Retraso moderado (3-5 días), sin impacto grave en el proyecto.
    *   Mejorable (4-5 pts): Entrega fuera de plazo con afectación al proceso grupal (máximo 6/10).
    *   Insuficiente (0-3 pts): No entrega (0 puntos hasta su recuperación).

---

**3. Originalidad y Resultado Final (20 puntos en total)**

*   **Criterio: Innovación narrativa (5 pts)**
    *   Excelente (5 pts): Uso de estructuras no convencionales (ej: meta-narrativas, interactividad).
    *   Bueno (4 pts): Propuesta creativa, aunque con influencias reconocibles.
    *   Satisfactorio (3 pts): Narrativa funcional, sin riesgos creativos.
    *   Mejorable (2 pts): Historia predecible o clichés.
    *   Insuficiente (0-1 pts): Copia total o parcial de obras existentes.

*   **Criterio: Coherencia forma-contenido (5 pts)**
    *   Excelente (5 pts): Integración perfecta entre recursos técnicos (ej: sonido, color) y mensaje.
    *   Bueno (4 pts): Relación adecuada, con algunos desajustes menores.
    *   Satisfactorio (3 pts): Elementos técnicos y narrativos funcionan de manera independiente.
    *   Mejorable (2 pts): Contradicciones evidentes entre estilo visual y guion.
    *   Insuficiente (0-1 pts): Falta total de conexión entre técnica y narrativa.

*   **Criterio: Calidad técnica final (10 pts)**
    *   Excelente (10 pts): Producción impecable (ej: transiciones fluidas, mezcla de sonido profesional).
    *   Bueno (8-9 pts): Calidad profesional con detalles menores (ej: errores de edición puntuales).
    *   Satisfactorio (6-7 pts): Producto funcional, pero con limitaciones técnicas visibles.
    *   Mejorable (4-5 pts): Problemas técnicos que distraen al espectador (ej: audio desincronizado).
    *   Insuficiente (0-3 pts): Producto incomprensible o inutilizable.

---

**ESCALA FINAL (calculada sobre el puntaje total)**

*   90-100 pts: Excelente (Sobresaliente)
*   70-89 pts: Bueno (Notable)
*   50-69 pts: Satisfactorio (Aprobado)
*   30-49 pts: Mejorable (Recuperación parcial)
*   0-29 pts: Insuficiente (Reprobado)
`;
