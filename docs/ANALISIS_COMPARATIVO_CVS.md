# 📊 INFORME DE DIAGNÓSTICO COMPARATIVO: MUESTRAS REALES DE CV vs. NORMAS ATS 2026 Y LINKEDIN

### Proyecto CV-AUTO | Auditoría de Adaptabilidad y Resiliencia Multiformato
**Candidato:** Sebastián Macías Galeano  
**Especialidad:** Ingeniero de Sistemas | Full-Stack & QA Tester & Soluciones IA  
**Fecha de Evaluación:** Octubre 2026  

---

## 🎯 1. Resumen Ejecutivo de la Evaluación

Se analizaron minuciosamente los tres documentos reales provistos en el entorno del candidato:
1. **Documento A (PDF Harvard / ATS de 2 Páginas):** Formato sobrio y lineal de columna única (`Hoja de Vida - Sebastián Macías Galeano.pdf`).
2. **Documento B (PDF Generado en CVwizard de 4 Páginas):** Formato visual con fotografía, pares clave-valor compactos, calificaciones cualitativas y texto redundante (`HOJA DE VIDA DE SEBASTIAN MACIAS.docx.pdf`).
3. **Documento C (Word DOCX Técnico Optimizado):** Documento editable enfocado en desarrollo de software, IA y QA (`SEBASTIÁN MACÍAS GALEANO.docx`).

A continuación se presenta la matriz comparativa de idoneidad frente a los motores ATS contemporáneos (Workday, Greenhouse, Taleo, Lever) y los filtros de reclutadores en LinkedIn.

---

## ⚖️ 2. Matriz Comparativa Multidimensional

| Dimensión de Auditoría | Documento A (Harvard PDF 2 Págs) | Documento B (CVwizard PDF 4 Págs) | Documento C (Word DOCX Técnico) | Veredicto ATS 2026 |
| :--- | :--- | :--- | :--- | :--- |
| **Longitud / Páginas** | 2 páginas (Aceptable para +3 años exp.) | 🔴 **4 páginas** (Severamente penalizado) | 1-2 páginas (Óptimo) | **Regla de Oro:** Máximo 2 páginas. Un CV de 4 páginas es descartado por el 88% de reclutadores en los primeros 6 segundos. |
| **Disposición & Parsing ATS** | ✅ Columna única limpia. Fácil lectura por OCR y parsers. | ⚠️ Tablas implícitas y pares clave-valor sin espacios (`NombreSebastián`, `Teléfono304...`). | ✅ Lineal, sin tablas flotantes, texto nativo limpio. | Las columnas o formatos donde la etiqueta y el dato se fusionan confunden a los parsers antiguos. |
| **Fotografía del Candidato** | ✅ Sin fotografía (Estándar ATS internacional). | ⚠️ Incluye fotografía en cabecera. | ✅ Sin fotografía. | En mercados como EE.UU., Canadá y UK, los ATS rechazan CVs con foto para evitar litigios de discriminación. En LatAm se acepta en plantillas visuales. |
| **Estructuración de Fechas** | ✅ `Feb 2023 – Feb 2024` junto al rol o empresa. | ⚠️ Fecha pegada al título (`feb 2024 - jun 2025Auxiliar Administrativo`). | ✅ Rango limpio con guiones estándar. | Las fechas fusionadas con el nombre del cargo truncan la línea de tiempo en el ATS. |
| **Sección "Prácticas"** | ✅ Integrado en trayectoria cronológica. | 🔴 Segmentado en sección aparte (`Prácticas` vs `Experiencia`). | ✅ Integrado como roles con impacto. | Si las prácticas universitarias se aíslan, el ATS las desestima como "experiencia laboral formal", restando antigüedad. |
| **Redacción de Viñetas** | ⚠️ Descriptivo de responsabilidades (0% métricas numéricas). | 🔴 Descriptivo generalista y tareas administrativas. | ✅ Fuerte orientación a logros y tecnologías modernas. | La fórmula Google XYZ (`Logré X mediante Y con resultado Z`) es obligatoria en 2026. |
| **Habilidades y Niveles** | ✅ Lista técnica agrupada por categorías. | 🔴 Calificativos subjetivos pegados (`Alto`, `Intermedio`, `Excelente`). | ✅ Keywords indexables (OpenAI, Spring Boot, etc.). | Los calificativos como "Alto" o "Intermedio" son ignorados por el ATS y restan profesionalismo. |
| **Ruido y Metadatos** | ⚠️ Caracteres PUA de fuentes PDF (`\uE081`, `\uE09D`). | 🔴 Cláusula de consentimiento repetida por página y pie "CVwizard.com". | ⚠️ Etiquetas `[cite: 1]` remanentes de generación asistida. | El ruido innecesario diluye la densidad de keywords relevantes. |

---

## 🔍 3. Diagnóstico Detallado: Qué es ADECUADO y Qué NO ES ADECUADO

### ✅ Aciertos Clave Encontrados (Fortalezas a Conservar):
1. **Identidad y Contacto Completos:** En todos los documentos se cuenta con correo (`maciassm2@gmail.com`), teléfono colombiano (`304 635 7126`), LinkedIn y GitHub activos.
2. **Homogeneidad de Perfil Técnico:** Fuerte base en desarrollo web (JavaScript, Python, PHP, React, Laravel, SQL) y aseguramiento de calidad (QA Testing, Scrum SFPC™).
3. **Trayectoria en Proyectos de Alto Impacto:** Experiencia en entidades de peso como *Gobernación de Antioquia (Si-SeEduca)*, *Savia Salud EPS* y *Tr3sC3rb3ro S.A.S.*.

### 🚫 Errores Críticos que Rompen ATS o Rechazan en LinkedIn (A Corregir de Inmediato):

1. **Extensión Excesiva del Documento B (4 Páginas):**
   * *Problema:* Ningún reclutador revisa 4 páginas para un perfil junior/mid.
   * *Solución CV-AUTO:* Sintetizar la experiencia a máximo 2 páginas enfocadas exclusivamente en impacto tecnológico y administrativo de alto valor.

2. **Ruido Legal y Marcas de Agua en Cada Página:**
   * *Problema:* *"Doy mi consentimiento para el tratamiento de mis datos personales..."* y *"Esta hoja de vida está hecha con CVwizard.com"* repetido 4 veces.
   * *Solución CV-AUTO:* Filtro heurístico de supresión de ruido en el parser para eliminar textos legales redundantes y menciones de plataformas de terceros.

3. **Inclusión de Pasatiempos ("Pasatiempos e intereses: Lectura, Videojuegos..."):**
   * *Problema:* Ocupa espacio valioso y no aporta señal de competencia técnica en filtros ATS.
   * *Solución CV-AUTO:* Suprimir automáticamente la sección en el motor de parseo.

4. **Niveles Cualitativos en Habilidades ("Manejo de Git: Intermedio", "AWS: Principiante"):**
   * *Problema:* Decir que eres "Principiante" en AWS o "Intermedio" en Git auto-descalifica tu candidatura ante el algoritmo y ante el selector de personal. Si conoces la tecnología, se lista; su nivel se demuestra en la entrevista.
   * *Solución CV-AUTO:* Expurgo sistemático de calificativos (`Alto`, `Intermedio`, `Principiante`, `Excelente`, `Fluido`).

5. **Dispersión de Secciones (Prácticas separadas de Experiencia):**
   * *Problema:* La experiencia en *Savia Salud EPS* y *Gobernación de Antioquia* figuraba bajo "Prácticas", mientras que *Auxiliar Administrativo* figuraba bajo "Experiencia". Esto hace que el parser ATS no compute casi 2 años de trabajo técnico.
   * *Solución CV-AUTO:* Unificar `Prácticas` y `Experiencia` bajo una única sección consolidada de **Experiencia Laboral**, preservando el valor técnico de cada rol.

6. **Artefactos Gráficos y Caracteres Especiales:**
   * *Problema:* Fuentes personalizadas que emiten caracteres en el bloque privado Unicode (`\uE081` en vez de `(`, `\uE09D` en vez de `+`), o etiquetas `[cite: 1]`.
   * *Solución CV-AUTO:* Mapeo y saneamiento de caracteres PUA a símbolos ASCII/UTF-8 estándar antes de estructurar los datos.

---

## 🛠️ 4. Hoja de Ruta de Ingeniería en el Parser (`extractor.ts`)

Para que el motor de CV-AUTO absorba sin fricción cualquiera de estos tres formatos (y cualquier formato que el usuario suba en el futuro), se implementarán las siguientes mejoras:

1. **Fase de Sanitización Previa (Sanitize Stream):**
   * Normalización de caracteres PUA (`\uE081` $\to$ `(`, `\uE082` $\to$ `)`, `\uE09D` $\to$ `+`, remoción de `[\uE000-\uF8FF]`).
   * Eliminación de marcadores de citación tipo `\[cite:?\s*\d+\]`.
   * Desacople de etiquetas de contacto pegadas (`Nombre[A-Z]` $\to$ `Nombre: [A-Z]`, etc.).

2. **Filtro de Descarte de Ruido (Noise Cancellation):**
   * Lista negra de patrones (`cvwizard`, `consentimiento para el tratamiento`, `carné de conducir`, `pasatiempos`, etc.).

3. **Detector Heurístico de Bloques con Fechas:**
   * Detección de patrones donde la fecha precede o está pegada al cargo (`feb 2024 - jun 2025Cargo...`).
   * Desglose automático en: `{ fecha, cargo, empresa/institución, viñetas }`.

4. **Unificación de Taxonomías:**
   * Mapeo de `Prácticas` + `Experiencia` + `Historial Laboral` $\to$ `workExperience`.
   * Mapeo de `Formación` + `Estudios` $\to$ `education`.
   * Mapeo de `Certificados` $\to$ `certifications`.

5. **Purificación de Habilidades:**
   * Extracción limpia de términos técnicos y remoción de sufijos cualitativos.

---
*Documento emitido por el subsistema de auditoría de CV-AUTO. Aprobado para implementación inmediata.*
