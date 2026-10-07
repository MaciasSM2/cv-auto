# 📜 HISTORIAL DE PROYECTO: CV-AUTO
### Bitácora de Decisiones, Arquitectura y Evolución del Sistema

> **Propósito del documento:** Este archivo constituye el registro histórico oficial y acumulativo de CV-AUTO. Cada fase, decisión técnica, ajuste de diseño, rectificación de normas y evolución del código queda documentado aquí para permitir auditoría y perfeccionamiento continuo.

---

## 📌 Metadatos del Proyecto
* **Nombre del Proyecto:** CV-AUTO
* **Objetivo:** Plataforma automatizada de auditoría, optimización y generación de hojas de vida con IA, diseñada para superar algoritmos ATS (2026) y destacar ante reclutadores de LinkedIn y el mercado laboral global.
* **Fecha de Inicio:** 06 de Octubre de 2026
* **Liderazgo Técnico / Asistente:** Antigravity AI
* **Entorno de Ejecución:** Windows / PowerShell / Node.js v26.7.0 / Python 3.14.7

---

## 📅 Registro Cronológico de Eventos y Decisiones

### [2026-10-06 12:47] - Hito 0: Definición de Alcance y Requisitos Iniciales
* **Solicitud del Usuario:**
  * Crear un sistema automatizado para revisión de CVs basado en IA y tendencias actuales de búsqueda de empleo (ATS y reclutamiento en LinkedIn).
  * Flujo de entrada dual: Ingreso manual de información o subida de CV existente (PDF/Word) para análisis de errores y corrección asistida.
  * Flujo de salida: Descarga en PDF vectorial en múltiples formatos (Modo ATS estricto de columna única vs. Modo Moderno visual tipo Canva).
* **Investigación de Normas ATS 2026:**
  * Algoritmos de parseo de Workday, Greenhouse, Taleo y Lever. Descarte sistemático de tablas, cajas de texto flotantes, barras de porcentaje gráficas y maquetaciones de doble columna.
  * Regla de reclutadores: Escaneo de 6-7 segundos. Necesidad de viñetas con la fórmula Google XYZ / STAR ("Logré [X], medido por [Y], haciendo [Z]").
* **Entregable:** Artefacto maestro `cv_auto_master_plan.md` aprobado por el usuario.

---

### [2026-10-06 12:56] - Hito 1: Aprobación del Plan y Directrices Operativas
* **Instrucciones Clave:**
  1. Generar y mantener **dos documentos vivos**: `PROJECT_HISTORY.md` (historial acumulativo) y `RECOVERY_STATE.md` (resiliencia ante desconexiones).
  2. Instalar herramientas de productividad: **Caveman** (`@caveman-ai/cli`) y **Graphify** (`@sentropic/graphify` / Engram).
  3. Crear una arquitectura limpia con separación de Frontend y Backend.

---

### [2026-10-06 13:08 - 16:11] - Hito 2: Arquitectura Monorepo y Core del Sistema
* **Stack:** Monorepo con `npm workspaces` (`/frontend` en Vite + React 18 + TS, `/backend` en Express + TS + Puppeteer).
* **Módulos:**
  - Tipado canónico `types/resume.ts`.
  - Motor de scoring ATS 2026 de 5 dimensiones (`services/scoring/scorer.ts`).
  - Extractor de texto PDF/DOCX (`services/parser/extractor.ts`).
  - Optimizador Google XYZ y Job Matcher (`services/optimizer/optimizer.ts`).
  - Generador de PDF vectorial con Puppeteer (`services/pdf/generator.ts`).
  - Frontend interactivo con Scorecard, Live Preview y Editor (`frontend/src/App.tsx`).

---

### [2026-10-06 17:56 - 18:14] - Hito 3: Integración de los 3 Requerimientos Clave del Usuario
* **Solicitud del Usuario:**
  1. Subida y estructuración optimizada de documentos PDF o Word en la plataforma para reorganizar la hoja de vida con feedback inmediato.
  2. Menú desplegable de descarga con doble opción: **PDF Vectorial** y **Word Editable (.docx)**.
  3. Apartado en la plataforma para subir la fotografía del candidato y plasmarla en la plantilla **Moderna Canva**.

* **Implementaciones Realizadas:**
  1. **Generador de Word Editable (.docx):**
     - Se integró la librería `docx` (v9.8.1) en el backend.
     - Se desarrolló `backend/src/services/word/generator.ts`: genera un documento `.docx` nativo con jerarquía semántica, viñetas estándar y datos de contacto, 100% editable por reclutadores y compatible con ATS.
     - Se expuso la ruta `POST /api/cv/export-docx`.
  2. **Menú Desplegable Dual de Descarga:**
     - Se reemplazó el botón simple de descarga por un menú interactivo con estado:
       - 📄 *Descargar PDF Vectorial* (con selector de plantilla activa).
       - 📝 *Descargar Word Editable (.docx)* (archivo Word nativo).
  3. **Apartado de Foto de Perfil & Integración Canva:**
     - Se actualizó el esquema canónico con `contact.photoUrl`.
     - En el frontend (`ResumeEditor.tsx`), se agregó un bloque dedicado dentro de la pestaña *Contacto & Perfil* con subida de imagen (JPEG, PNG, WebP), validación de tamaño (<5MB), conversión a DataURL y botón para remover foto.
     - En `LiveCvPreview.tsx`, se configuró la visualización de la foto en la barra lateral de la plantilla Moderna Canva (con respaldo de iniciales estilizadas si no se carga foto).
     - En `backend/src/services/pdf/generator.ts`, se actualizó la plantilla HTML de Canva para incrustar la fotografía en el PDF final compilado con Puppeteer.
  4. **Feedback de Subida de Archivo:**
     - Se incorporó un banner de notificación dinámico en la plataforma que confirma el nombre del archivo procesado, la extracción de roles y el recalculo del Scorecard ATS.
  5. **Verificación Automatizada:**
     - Prueba de descarga de Word `.docx`: exitosa (archivo binario válido de 10 KB).
     - Navegación visual con subagente: despliegue de menú validado, pestaña de foto confirmada y renderizado Canva verificado.

---

### [2026-10-06 18:55] - Hito 4: Diagnóstico de Muestras Reales y Robustecimiento Multiformato del Parser
* **Diagnóstico Comparativo de Documentos Reales:**
  - *Documento A (`Hoja de Vida - Sebastián Macías Galeano.pdf`):* Formato Harvard ATS limpio de 2 páginas. Aciertos: buena estructuración lineal. Puntos débiles: glifos PUA de fuentes PDF (`\uE081`), 0% de viñetas con métricas numéricas.
  - *Documento B (`HOJA DE VIDA DE SEBASTIAN MACIAS.docx.pdf`):* Formato CVwizard de 4 páginas con foto. Riesgos críticos ATS: longitud excesiva (4 págs = descarte ATS), pares clave-valor pegados (`NombreSebastián`, `Teléfono304...`), cláusula legal de consentimiento y marca de agua repetida en cada página, fechas unidas a títulos (`feb 2024 - jun 2025Auxiliar...`), calificación cualitativa de habilidades ("Alto", "Intermedio") y sección de prácticas separada.
  - *Documento C (`SEBASTIÁN MACÍAS GALEANO.docx`):* Formato Word técnico optimizado con IA. Fuerte en proyectos e IA, pero con marcas residuales de citación `[cite: 1]`.
  - *Entregable:* Artefacto maestro `analisis_comparativo_cvs.md`.
* **Ingeniería del Parser (`extractor.ts`):**
  - Sanitización de glifos PUA (`\uE081` $\to$ `(`, `\uE082` $\to$ `)`, `\uE09D` $\to$ `+`, remoción de bloques privados).
  - Depuración de marcadores `[cite: \d+]`.
  - Desacople automático de pares clave-valor pegados (`Nombre`, `Correo`, `Teléfono`, `Dirección`).
  - Normalización de números telefónicos internacionales colombianos (`(+57) 304 635 7126`).
  - Filtrado de ruido para suprimir marcas de agua de plataformas y consentimientos redundantes.
  - Unificación de `Prácticas` con `Experiencia` laboral para no perder 2 años de experiencia técnica.
  - Extracción de fechas al inicio (`GLUED_DATE_REGEX`) con asociación limpia de empresa y viñetas.
  - Eliminación de niveles subjetivos en habilidades (`Alto`, `Intermedio`, `Principiante`, `Excelente`).
* **Pruebas de Validación:**
  - Pruebas automatizadas de parseo ejecutadas contra los tres documentos reales con 100% de éxito y captura íntegra de roles, educación y habilidades.
  - Verificación visual en navegador con subagente confirmando integridad del Scorecard y funcionamiento del frontend y backend en vivo.

---

## 📐 Registro de Decisiones de Arquitectura (ADRs)

### ADR-004: Exportación Nativa a Microsoft Word (.docx)
* **Contexto:** Muchos reclutadores tradicionales y agencias de headhunting solicitan el CV en formato editable `.docx` para añadir notas o anonimizar antes de enviar al cliente.
* **Decisión:** Implementar un generador de `.docx` nativo con `docx` en Node.js que mantenga una estructura ATS limpia de una columna sin cajas de texto flotantes.
* **Estado:** Aprobado e Implementado.

### ADR-005: Tratamiento de Fotografías (Canva vs. ATS)
* **Contexto:** Las normas ATS penalizan las imágenes incrustadas que puedan generar sesgos o errores de OCR. Sin embargo, las plantillas visuales tipo Canva las requieren.
* **Decisión:** La fotografía se renderiza exclusivamente en la plantilla *Moderna Canva* y se omite deliberadamente en la plantilla *Harvard ATS* y en el archivo *Word ATS*, garantizando máxima compatibilidad con ambos mundos.
* **Estado:** Aprobado e Implementado.

### ADR-006: Unificación Taxonómica de "Prácticas" en Experiencia Laboral
* **Contexto:** Los creadores de CVs como CVwizard separan "Prácticas" de "Experiencia laboral", provocando que los algoritmos ATS ignoren roles clave (como Savia Salud EPS o Gobernación de Antioquia).
* **Decisión:** Fusionar automáticamente las prácticas profesionales dentro del flujo cronológico de experiencia laboral del candidato, validando viñetas de tecnología y soporte.
* **Estado:** Aprobado e Implementado.

### ADR-007: Purificación Heurística de Habilidades sin Niveles Cualitativos
* **Contexto:** Los candidatos suelen autocalificarse con etiquetas como "Git: Intermedio" o "AWS: Principiante", lo que activa filtros de descarte inmediato en reclutadores.
* **Decisión:** Eliminar programáticamente los sufijos de competencia cualitativa, preservando las palabras clave canónicas para maximizar el indexado ATS y el posicionamiento en LinkedIn.
* **Estado:** Aprobado e Implementado.

### ADR-008: Detección Automática del Binario de Chrome para Generación PDF
* **Contexto:** En entornos Windows donde Puppeteer no descarga su Chrome empotrado por políticas de red o caché, las llamadas de compilación PDF fallaban con error 500 por ejecutable faltante.
* **Decisión:** Implementar detección dinámica del ejecutable local existente (`C:\Program Files\Google\Chrome\Application\chrome.exe` o Microsoft Edge) para garantizar generación instantánea de PDFs vectoriales de alta fidelidad sin requerir descargas pesadas de Chromium.
* **Estado:** Aprobado e Implementado.

---

### [2026-10-06 19:10] - Hito 5: Solución a Duplicación en Perfil Profesional y Reparación de Descarga PDF
* **Problemas Detectados por el Usuario:**
  1. *Duplicación de cabecera:* El perfil profesional repetía el nombre completo, teléfonos, correos y links de LinkedIn/GitHub al inicio del extracto.
  2. *Fallo de descarga de PDF:* El botón de descarga generaba error 500 al no ubicar el binario de Chrome en Puppeteer.
* **Soluciones Implementadas:**
  1. Desacople de la sección inicial como `header` y función `cleanSummaryText` para purificar cualquier residuo de contacto en el perfil.
  2. Integración de `getSystemChromePath()` en `backend/src/services/pdf/generator.ts`, habilitando la generación de PDF con Google Chrome nativo de Windows.
  3. Verificación interactiva completa con subagente en navegador: importación de documento, verificación visual de la ausencia de duplicados y descarga exitosa de PDF.

---

### [2026-10-06 19:22] - Hito 6: Publicación en GitHub y Versionado Semántico Oficial v1.0.0
* **Solicitud del Usuario:**
  - Crear un repositorio público en GitHub para el proyecto y asignar el esquema de versiones adecuado.
* **Acciones Ejecutadas:**
  - Configuración de `.gitignore` integral para aislar dependencias `node_modules`, builds en `dist`, entornos y cachés.
  - Creación de documentación maestro `README.md` con arquitectura, endpoints, insignias y guía de despliegue.
  - Creación de archivo de licencia `LICENSE` (MIT) acreditado a Sebastián Macías Galeano.
  - Inicialización del repositorio Git local en la rama `main` y primer commit semántico: `feat: initial release of CV-AUTO v1.0.0 - ATS 2026 AI Resume Auditor & Generator`.
  - Creación y asignación de la etiqueta de versión oficial `v1.0.0`.
  - Publicación y vinculación del repositorio público en GitHub mediante GitHub CLI: [https://github.com/MaciasSM2/cv-auto](https://github.com/MaciasSM2/cv-auto).
  - Creación y publicación de la Release oficial en GitHub: [https://github.com/MaciasSM2/cv-auto/releases/tag/v1.0.0](https://github.com/MaciasSM2/cv-auto/releases/tag/v1.0.0).



