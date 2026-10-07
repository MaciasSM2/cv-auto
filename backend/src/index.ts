import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { ResumeData, TemplateType } from './types/resume';
import { parsePdfBuffer, parseDocxBuffer, structureRawResumeText } from './services/parser/extractor';
import { auditResume } from './services/scoring/scorer';
import { rewriteBulletXYZ, analyzeJobMatch } from './services/optimizer/optimizer';
import { generatePdfBuffer } from './services/pdf/generator';
import { generateDocxBuffer } from './services/word/generator';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Configurar multer en memoria para subida de CVs
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.originalname.endsWith('.pdf') ||
        file.originalname.endsWith('.docx')) {
      cb(null, true);
    } else {
      cb(new Error('Formato no soportado. Sube un archivo PDF o DOCX.'));
    }
  }
});

// 1. Healthcheck
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'CV-AUTO API', version: '1.0.0' });
});

// 2. Parsear CV (Upload de PDF/DOCX)
app.post('/api/cv/parse', upload.single('resumeFile'), async (req: Request, res: Response): Promise<void> => {
  try {
    let rawText = '';

    if (req.file) {
      if (req.file.mimetype === 'application/pdf' || req.file.originalname.endsWith('.pdf')) {
        rawText = await parsePdfBuffer(req.file.buffer);
      } else {
        rawText = await parseDocxBuffer(req.file.buffer);
      }
    } else if (req.body.rawText) {
      rawText = req.body.rawText;
    } else {
      res.status(400).json({ error: 'Debes proporcionar un archivo PDF/DOCX o texto sin procesar.' });
      return;
    }

    if (!rawText || rawText.trim().length === 0) {
      res.status(422).json({ error: 'No se pudo extraer texto seleccionable del archivo. Asegúrate de que no sea un escaneo o imagen.' });
      return;
    }

    const structuredData = structureRawResumeText(rawText);
    const audit = auditResume(structuredData);

    res.json({
      success: true,
      data: structuredData,
      audit,
      rawTextSnippet: rawText.slice(0, 300)
    });
  } catch (error: any) {
    console.error('Error en /api/cv/parse:', error);
    res.status(500).json({ error: error.message || 'Error interno parseando el CV' });
  }
});

// 3. Evaluar y auditar CV (Scorecard ATS 2026)
app.post('/api/cv/score', (req: Request, res: Response) => {
  try {
    const resumeData: ResumeData = req.body;
    if (!resumeData || !resumeData.contact) {
      res.status(400).json({ error: 'Datos de CV incompletos para auditoría.' });
      return;
    }

    const audit = auditResume(resumeData);
    res.json({ success: true, audit });
  } catch (error: any) {
    console.error('Error en /api/cv/score:', error);
    res.status(500).json({ error: error.message || 'Error calculando el score' });
  }
});

// 4. Optimizar viñeta individual con fórmula Google XYZ / STAR
app.post('/api/cv/optimize-bullet', (req: Request, res: Response) => {
  try {
    const { bullet } = req.body;
    if (!bullet || typeof bullet !== 'string') {
      res.status(400).json({ error: 'Se requiere el parámetro bullet como texto.' });
      return;
    }

    const suggestion = rewriteBulletXYZ(bullet);
    res.json({ success: true, suggestion });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Comparar CV contra oferta de empleo de LinkedIn / vacante (Job Match)
app.post('/api/cv/job-match', (req: Request, res: Response) => {
  try {
    const { resume, jobDescription } = req.body;
    if (!resume || !jobDescription) {
      res.status(400).json({ error: 'Se requiere resume y jobDescription.' });
      return;
    }

    const match = analyzeJobMatch(resume, jobDescription);
    res.json({ success: true, match });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Generar y descargar PDF vectorial
app.post('/api/cv/export-pdf', async (req: Request, res: Response): Promise<void> => {
  try {
    const { resume, template = 'ats-harvard' } = req.body;
    if (!resume || !resume.contact) {
      res.status(400).json({ error: 'Datos de CV requeridos para exportar a PDF.' });
      return;
    }

    const validTemplate: TemplateType = template === 'modern-canva' ? 'modern-canva' : 'ats-harvard';
    const pdfBuffer = await generatePdfBuffer(resume, validTemplate);

    const safeName = (resume.contact.fullName || 'CV')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${safeName}_${validTemplate}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('Error generando PDF:', error);
    res.status(500).json({ error: error.message || 'Error al compilar el PDF' });
  }
});

// 7. Generar y descargar documento Word (.docx) editable
app.post('/api/cv/export-docx', async (req: Request, res: Response): Promise<void> => {
  try {
    const { resume } = req.body;
    if (!resume || !resume.contact) {
      res.status(400).json({ error: 'Datos de CV requeridos para exportar a Word.' });
      return;
    }

    const docxBuffer = await generateDocxBuffer(resume);
    const safeName = (resume.contact.fullName || 'CV')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${safeName}_editable.docx"`,
      'Content-Length': docxBuffer.length
    });

    res.send(docxBuffer);
  } catch (error: any) {
    console.error('Error generando Word DOCX:', error);
    res.status(500).json({ error: error.message || 'Error al compilar el documento Word' });
  }
});

app.listen(PORT, () => {
  console.log(`[CV-AUTO Backend] Servidor activo en http://localhost:${PORT}`);
});
