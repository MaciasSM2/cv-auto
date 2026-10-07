# 🚀 CV-AUTO
### Sistema Automatizado de Auditoría, Optimización con IA y Generación de CVs (Normas ATS 2026 & LinkedIn)

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/MaciasSM2/cv-auto/releases)
[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-v18.3-61dafb.svg)](https://react.dev/)
[![ATS](https://img.shields.io/badge/ATS_Compliance-2026_Ready-success.svg)](#-criterios-ats-2026)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **CV-AUTO** es una plataforma de ingeniería diseñada para superar los filtros algorítmicos más rigurosos de los sistemas ATS modernos (**Workday, Greenhouse, Taleo, Lever**) y maximizar el impacto visual ante reclutadores en **LinkedIn** y el mercado laboral tecnológico global.

---

## 🌟 Características Principales

### 1. 📥 Motor de Parseo Multiformato Resiliente
* **Extracción Heurística Avanzada:** Procesa archivos **PDF vectoriales** y documentos **Microsoft Word (.docx)** nativos.
* **Saneamiento Automático de Glifos PUA:** Normaliza caracteres especiales emitidos por generadores gráficos (ej. Canva o fuentes personalizadas) a símbolos legibles estándar.
* **Filtro Inteligente de Ruido:** Detecta y suprime marcas de agua de plataformas de terceros, pies de página redundantes y cláusulas de consentimiento de datos personales.
* **Unificación Taxonómica:** Fusión automática de secciones de *"Prácticas"* con *"Experiencia Laboral"*, evitando que los algoritmos ATS descuenten años de experiencia técnica.
* **Depuración de Habilidades:** Purga de calificaciones cualitativas subjetivas (*"Alto"*, *"Intermedio"*, *"Principiante"*), preservando las palabras clave técnicas canónicas.

### 2. 📊 Scorecard de Auditoría ATS 2026 (5 Dimensiones Ponderadas)
* **Parseabilidad ATS (25%):** Validación de jerarquía de datos (nombre, correo, teléfono internacional con prefijo, ciudad, educación formal y cronología).
* **Impacto Cuantitativo (25%):** Detección de métricas numéricas, porcentajes, multiplicadores y cifras de negocio (Fórmula Google XYZ / STAR).
* **Relevancia de Palabras Clave (20%):** Densidad e indexación de tecnologías, lenguajes, frameworks y bases de datos.
* **Verbos de Acción y Tono (15%):** Eliminación de redactados pasivos genéricos en favor de verbos de impacto activo (*Lideró, Arquitectó, Optimizó*).
* **Estructura y Completitud (15%):** Longitud adecuada del perfil profesional (3-4 líneas concisas) y presencia de enlaces de verificación inmediata (LinkedIn, GitHub).

### 3. 📄 Motor de Exportación Dual de Alta Fidelidad
* **PDF Vectorial con Puppeteer:**
  * **Plantilla Harvard ATS:** Estructura lineal estricta de una sola columna sin tablas flotantes ni elementos gráficos que rompan el OCR de Workday.
  * **Plantilla Moderna Canva:** Disposición visual de dos columnas con paleta oscura, píldoras estilizadas para habilidades y soporte dedicado para **fotografía del candidato**.
* **Microsoft Word Editable (.docx):** Documento nativo generado mediante `docx` con estilos semánticos, ideal para headhunters y agencias de selección.

### 4. ⚡ Interfaz Web Interactiva en Tiempo Real
* **Live CV Preview:** Renderizado en tiempo real sincronizado con el editor de datos.
* **Gestor de Fotografía de Perfil:** Carga interactiva con previsualización circular, validación de tamaño y persistencia como DataURL.
* **Banners de Feedback Instantáneo:** Notificaciones dinámicas de carga y diagnóstico de métricas.

---

## 🏗️ Arquitectura del Sistema

El proyecto está organizado como un **Monorepo** con `npm workspaces`:

```text
CV-AUTO/
├── backend/                  # Servidor API Express + TypeScript
│   ├── src/
│   │   ├── index.ts          # Rutas RESTful (/api/cv/*)
│   │   ├── services/
│   │   │   ├── parser/       # Extractor de texto (pdf-parse + mammoth)
│   │   │   ├── scoring/      # Motor de evaluación ATS 2026
│   │   │   ├── optimizer/    # Optimizador Google XYZ y Job Matcher
│   │   │   ├── pdf/          # Compilador de PDF vectorial con Puppeteer
│   │   │   └── word/         # Generador nativo .docx
│   │   └── types/            # Esquema de datos canónico (ResumeData)
│   ├── package.json
│   └── tsconfig.json
├── frontend/                 # Aplicación Cliente React 18 + Vite + TS
│   ├── src/
│   │   ├── components/       # ResumeEditor, Scorecard, LiveCvPreview
│   │   ├── App.tsx           # Dashboard principal con gestión de estado
│   │   └── index.css         # Sistema de diseño con variables CSS y tema oscuro
│   ├── package.json
│   └── vite.config.ts
├── PROJECT_HISTORY.md        # Bitácora acumulativa de decisiones y ADRs
├── RECOVERY_STATE.md         # Checkpoint de resiliencia operativa
├── package.json              # Configuración raíz del Monorepo
└── README.md
```

---

## 🚀 Inicio Rápido (Despliegue Local)

### Prerrequisitos
* **Node.js:** v20.0.0 o superior (verificado en v26.7.0).
* **npm:** v10.0.0 o superior.
* **Google Chrome** o **Microsoft Edge** instalado en el sistema (requerido para la generación de PDFs con Puppeteer en Windows/Linux/macOS).

### 1. Clonar el Repositorio
```bash
git clone https://github.com/MaciasSM2/cv-auto.git
cd cv-auto
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Ejecutar en Modo Desarrollo
Inicia concurrentemente el servidor backend en el puerto `5000` y el cliente frontend en el puerto `3000`:
```bash
npm run dev
```

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend API:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📌 Endpoints de la API

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Estado de salud y versión de la API |
| `POST` | `/api/cv/parse` | Sube un archivo PDF/DOCX y extrae la información estructurada |
| `POST` | `/api/cv/score` | Audita un CV según las 5 dimensiones ATS 2026 |
| `POST` | `/api/cv/optimize-bullet` | Reescribe una viñeta pasiva con la fórmula Google XYZ |
| `POST` | `/api/cv/job-match` | Compara el CV contra una oferta de empleo y sugiere palabras clave |
| `POST` | `/api/cv/export-pdf` | Compila y descarga el PDF vectorial (`ats-harvard` o `modern-canva`) |
| `POST` | `/api/cv/export-docx` | Genera y descarga el archivo Microsoft Word editable (.docx) |

---

## 🏷️ Control de Versiones (SemVer)

Este proyecto adopta **Versionado Semántico (SemVer)**:

* **v1.0.0 (Versión Actual):**
  * Monorepo inicial con workspaces.
  * Parser multiformato resiliente para PDFs de CVwizard, Harvard y Word DOCX.
  * Scorecard ATS 2026 de 5 dimensiones.
  * Generación y descarga validada de PDF vectorial y Word DOCX nativo.
  * Pestaña de foto de perfil para plantilla Canva.
* **v1.1.0 (Próximamente):**
  * Optimización de logros en masa con IA generativa.
  * Módulo interactivo de vacantes de LinkedIn con radar de keywords faltantes.

---

## 👨‍💻 Autor y Créditos

* **Desarrollador:** [Sebastián Macías Galeano](https://github.com/MaciasSM2)
* **LinkedIn:** [linkedin.com/in/sebastian-macias-44b6a7216](https://www.linkedin.com/in/sebastian-macias-44b6a7216)
* **Licencia:** Distribuido bajo la Licencia MIT. Consulta `LICENSE` para más información.
