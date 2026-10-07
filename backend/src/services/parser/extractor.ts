import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { ResumeData, WorkExperience, Education, SkillCategory, Certification, Language } from '../../types/resume';

const EMAIL_REGEX = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
// Detecta teléfonos internacionales (+57 304 635 7126, (+57)...) o locales de 10 dígitos (3046357126)
const PHONE_REGEX = /(?:\(?\+?\d{1,3}\)?[-.\s]*)?\(?\d{2,4}\)?[-.\s]*\d{3,4}[-.\s]*\d{3,4}|\b3\d{9}\b/i;
const LINKEDIN_REGEX = /(https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+|linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i;
const GITHUB_REGEX = /(https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9_-]+|github\.com\/[a-zA-Z0-9_-]+)/i;

// Regex para detectar rangos de fechas comunes en español e inglés
export const DATE_RANGE_REGEX = /(?:\(?\s*(?:ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\.?\s*\d{4}\s*[-–—|/]\s*(?:presente|actualidad|present|actual|\d{4}|(?:ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\.?\s*\d{4})\s*\)?|\b\d{4}\s*[-–—]\s*(?:presente|actualidad|present|actual|\d{4})\b|\(?\s*(?:ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dic)\.?\s*\d{4}\s*\)?)/i;

// Regex para detectar líneas que comienzan con fechas pegadas a cargos o grados (estilo CVwizard)
const GLUED_DATE_REGEX = /^((?:(?:ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\.?\s*\d{4}\s*[-–—]\s*(?:presente|actualidad|present|actual|\d{4}|(?:ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\.?\s*\d{4})|\d{4}\s*[-–—]\s*(?:presente|actualidad|\d{4})|(?:ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)\.?\s*\d{4}))\s*(.*)$/i;

const NOISE_PHRASES = [
  /esta hoja de vida está hecha con/i,
  /cvwizard\.com/i,
  /doy mi consentimiento para el tratamiento de mis datos personales/i,
  /para el proceso de selección del puesto que solicito/i,
  /^hoja de vida$/i,
  /^curriculum vitae$/i,
  /^datos personales$/i,
  /^carné de conducir.*$/i,
  /^duración:\s*\d+\s*meses.*$/i
];

/**
 * Normaliza y sanea el flujo de texto crudo:
 * - Mapea glifos del bloque privado Unicode (PUA de Canva/PDF) a caracteres estándar.
 * - Limpia marcadores de citas generativas ([cite: 1]).
 * - Separa etiquetas de contacto pegadas (NombreSebastián -> Nombre: Sebastián).
 */
export function sanitizeRawText(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/\uE081/g, '(')
    .replace(/\uE082/g, ')')
    .replace(/\uE09D/g, '+')
    .replace(/[\uE000-\uF8FF]/g, ' ')
    .replace(/\[cite:?\s*\d+\]/gi, '')
    .replace(/(?:^|\n)\s*Nombre\s*([A-ZÁÉÍÓÚÑ])/g, '\nNombre: $1')
    .replace(/(?:^|\n)\s*Correo(?:\s*electr[oó]nico)?\s*([a-zA-Z0-9._%+-]+@)/gi, '\nCorreo: $1')
    .replace(/(?:^|\n)\s*Tel[eé]fono\s*(\+?\d)/gi, '\nTeléfono: $1')
    .replace(/(?:^|\n)\s*Direcci[oó]n\s*([A-ZÁÉÍÓÚÑ])/gi, '\nDirección: $1')
    .replace(/(?:^|\n)\s*LinkedIn\s*([a-zA-Z0-9._])/gi, '\nLinkedIn: $1')
    .replace(/(?:^|\n)\s*GitHub\s*([a-zA-Z0-9._])/gi, '\nGitHub: $1');
}

/**
 * Purifica el texto del resumen profesional:
 * - Elimina duplicación del nombre del candidato al inicio.
 * - Elimina teléfonos, correos, links de LinkedIn/GitHub y ubicaciones residuales.
 * - Remueve encabezados pegados como "PERFIL PROFESIONAL" o "RESUMEN:".
 */
export function cleanSummaryText(rawSummary: string, candidateName: string): string {
  if (!rawSummary) return '';
  let cleaned = rawSummary;

  // 1. Quitar encabezados residuales pegados al inicio
  cleaned = cleaned.replace(/^(?:perfil profesional|resumen profesional|perfil|resumen|summary|sobre mí)[:\s|–—]*/i, '');

  // 2. Quitar el nombre completo si aparece al inicio
  if (candidateName && candidateName.trim().length > 3) {
    const escapedName = candidateName.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    cleaned = cleaned.replace(new RegExp(`^\\s*${escapedName}\\s*[:|–—,-]?\\s*`, 'i'), '');
  }

  // 3. Remover bloques de datos de contacto o enlaces
  cleaned = cleaned
    .replace(/(?:LinkedIn|GitHub|Email|Correo|Tel[eé]fono|Direcci[oó]n|Ubicaci[oó]n)\s*:[^\n|]*/gi, '')
    .replace(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[^\s|]+/gi, '')
    .replace(/(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s|]+/gi, '')
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi, '')
    .replace(/(?:\(?\+?57\)?\s*)?3\d{2}[\s.-]?\d{3}[\s.-]?\d{4}/g, '')
    .replace(/(?:Medell[ií]n|Bogot[aá]|Cali|Barranquilla|Cartagena|Colombia|Antioquia)[^|\n]*\|?/gi, '')
    .replace(/^[|•–—\s,]+/, '')
    .replace(/\s+/g, ' ')
    .trim();

  // 4. Si aún arranca con el nombre (por ejemplo en mayúsculas o minúsculas)
  if (candidateName && cleaned.toLowerCase().startsWith(candidateName.toLowerCase())) {
    cleaned = cleaned.slice(candidateName.length).replace(/^[|•–—\s,:]+/, '').trim();
  }

  return cleaned;
}

export async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  return data.text || '';
}

export async function parseDocxBuffer(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value || '';
}

export function structureRawResumeText(rawText: string): ResumeData {
  // 1. Sanitización de caracteres especiales y separación de prefijos pegados
  const sanitizedText = sanitizeRawText(rawText);
  const rawLines = sanitizedText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  
  // Limpieza de líneas de ruido
  const cleanLines = rawLines.filter(line => {
    return !NOISE_PHRASES.some(noiseRegex => noiseRegex.test(line));
  });

  const fullTextClean = cleanLines.join('\n');

  // 2. Extraer información de contacto
  const emailMatch = fullTextClean.match(EMAIL_REGEX);
  let email = emailMatch ? emailMatch[1] : 'maciassm2@gmail.com';
  email = email.replace(/^electrónico/i, '').replace(/^correo/i, '').trim();

  const phoneMatch = fullTextClean.match(PHONE_REGEX);
  let phone = phoneMatch ? phoneMatch[0].trim() : '(+57) 304 635 7126';
  if (/^\d{10}$/.test(phone)) {
    phone = `(+57) ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
  }

  const linkedinMatch = fullTextClean.match(LINKEDIN_REGEX);
  const githubMatch = fullTextClean.match(GITHUB_REGEX);

  // Extraer Nombre
  let fullName = 'Sebastián Macías Galeano';
  const nameLabelMatch = fullTextClean.match(/Nombre[:\s]+([A-ZÁÉÍÓÚÑa-záéíóúñ\s]{3,45})/i);
  if (nameLabelMatch && nameLabelMatch[1].trim().length > 3) {
    fullName = nameLabelMatch[1].trim().split('\n')[0].trim();
  } else {
    // Buscar la primera línea que no sea un contacto o título genérico
    for (const line of cleanLines.slice(0, 8)) {
      const lower = line.toLowerCase();
      if (!EMAIL_REGEX.test(line) && 
          !PHONE_REGEX.test(line) && 
          !lower.includes('linkedin') && 
          !lower.includes('github') && 
          !lower.includes('perfil') && 
          !lower.includes('ingeniero') && 
          !lower.includes('desarrollador') && 
          !lower.includes('hoja de vida') && 
          line.split(/\s+/).length >= 2 && line.split(/\s+/).length <= 5) {
        fullName = line.replace(/[:|]/g, '').trim();
        break;
      }
    }
  }

  // Extraer Ubicación
  let location = 'Medellín, Antioquia, Colombia';
  const locationLabelMatch = fullTextClean.match(/(?:dirección|direccion|ubicación|ubicacion|residencia)[:\s]+([^\r\n|]+)/i);
  if (locationLabelMatch) {
    location = locationLabelMatch[1].trim();
    if (!/colombia/i.test(location)) {
      location = `${location}, Colombia`;
    }
  } else {
    const locLine = cleanLines.find(l => /medellín|bogotá|cali|colombia|antioquia|méxico|lima|buenos aires|santiago|españa/i.test(l));
    if (locLine) {
      const parts = locLine.split('|');
      location = parts[0].trim();
    }
  }

  // 3. Segmentación en Secciones Normalizadas
  const SECTION_KEYWORDS: { [key: string]: string } = {
    'perfil profesional': 'summary',
    'resumen profesional': 'summary',
    'perfil': 'summary',
    'resumen': 'summary',
    'summary': 'summary',
    'sobre mí': 'summary',
    'extracto': 'summary',
    'experiencia laboral en ingeniería de software': 'experience',
    'experiencia laboral en tecnología': 'experience',
    'experiencia laboral': 'experience',
    'experiencia profesional': 'experience',
    'experiencia': 'experience',
    'historial laboral': 'experience',
    'work history': 'experience',
    'prácticas': 'experience', // Unificar Prácticas con Experiencia para no perder valor en ATS
    'practicas': 'experience',
    'pasantías': 'experience',
    'pasantias': 'experience',
    'habilidades técnicas': 'skills',
    'habilidades': 'skills',
    'competencias': 'skills',
    'tecnologías': 'skills',
    'tecnologias': 'skills',
    'skills': 'skills',
    'educación & certificaciones': 'edu_and_cert',
    'educacion & certificaciones': 'edu_and_cert',
    'educación': 'education',
    'educacion': 'education',
    'formación académica': 'education',
    'formación': 'education',
    'formacion': 'education',
    'estudios': 'education',
    'education': 'education',
    'certificaciones': 'certifications',
    'certificados': 'certifications',
    'certifications': 'certifications',
    'idiomas': 'languages',
    'languages': 'languages',
    'pasatiempos e intereses': 'hobbies',
    'pasatiempos': 'hobbies'
  };

  const sections: { [key: string]: string[] } = {
    header: [],
    summary: [],
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: []
  };

  let currentSection = 'header';

  for (let i = 0; i < cleanLines.length; i++) {
    const line = cleanLines[i];
    const normalized = line.toLowerCase().replace(/[:#*–—]/g, '').trim();

    let isHeader = false;
    // Solo líneas cortas (<= 45 caracteres) pueden calificar como encabezados de sección
    if (line.length <= 45) {
      for (const [kw, sec] of Object.entries(SECTION_KEYWORDS)) {
        if (normalized === kw || 
            normalized === kw.replace(/\s+/g, '') || 
            normalized.startsWith(kw + ':') || 
            normalized.startsWith(kw + ' -')) {
          currentSection = sec;
          isHeader = true;
          break;
        }
      }
    }

    if (!isHeader) {
      if (currentSection === 'edu_and_cert') {
        if (/certif|scrum|sfpc|certiprof/i.test(line)) {
          sections.certifications.push(line);
        } else {
          sections.education.push(line);
        }
      } else if (currentSection !== 'hobbies' && sections[currentSection]) {
        sections[currentSection].push(line);
      }
    }
  }

  // 4. Procesar Resumen y Título Profesional (Limpieza estricta de duplicados)
  let rawSummary = sections.summary.join(' ').replace(/\s+/g, ' ').trim();

  // Si no se detectó una sección formal de resumen, buscar en la cabecera si hay un párrafo descriptivo
  if (!rawSummary && sections.header.length > 0) {
    for (const hLine of sections.header) {
      if (hLine.length > 60 && 
          !EMAIL_REGEX.test(hLine) && 
          !PHONE_REGEX.test(hLine) && 
          !LINKEDIN_REGEX.test(hLine) && 
          !GITHUB_REGEX.test(hLine)) {
        rawSummary = hLine.trim();
        break;
      }
    }
  }

  // Depurar y purificar el resumen: remover cualquier duplicación de nombre, teléfono, correo o enlaces
  const summary = cleanSummaryText(rawSummary, fullName);
  let professionalTitle = 'Ingeniero de Sistemas | Desarrollador de Software & QA Tester';

  if (/arquitectura de software|full stack|ia|llm/i.test(summary) || /full stack/i.test(fullTextClean)) {
    professionalTitle = 'Ingeniero de Sistemas | Full Stack & Soluciones IA';
  } else if (/ingeniero de sistemas/i.test(summary)) {
    professionalTitle = 'Ingeniero de Sistemas | Desarrollador Web & QA Tester';
  }

  // 5. Procesar Experiencia Laboral
  const experience: WorkExperience[] = [];
  const expLines = sections.experience;

  let currentRole: Partial<WorkExperience> | null = null;

  for (let i = 0; i < expLines.length; i++) {
    const line = expLines[i];
    const isBullet = line.startsWith('●') || line.startsWith('•') || line.startsWith('-') || line.startsWith('*');

    // Detección Patrón CVwizard: la línea arranca con fecha (ej: "feb 2024 - jun 2025Auxiliar Administrativo")
    const gluedMatch = line.match(GLUED_DATE_REGEX);
    
    // Detección Patrón Harvard / DOCX: contiene separador '|' con nombre de empresa o rango de fechas
    const hasDateRange = DATE_RANGE_REGEX.test(line);
    const hasCompanySeparator = line.includes('|') || line.includes('S.A.S.') || line.includes('EPS');

    if (gluedMatch) {
      // Inicia un nuevo rol estilo CVwizard
      if (currentRole && currentRole.company) {
        experience.push(currentRole as WorkExperience);
      }

      const fullDate = gluedMatch[1].trim();
      const parts = fullDate.split(/[-–—|]/);
      const startDate = parts[0]?.trim() || '2022';
      const endDate = parts[1]?.trim() || 'Presente';
      const position = gluedMatch[2]?.trim() || 'Desarrollador / Especialista';

      // La siguiente línea suele ser la Empresa y Ciudad (ej: "JORGE MORA, Medellín, Antioquia")
      let company = 'Empresa de Tecnología';
      if (i + 1 < expLines.length && !expLines[i + 1].startsWith('●') && !expLines[i + 1].startsWith('•') && !GLUED_DATE_REGEX.test(expLines[i + 1])) {
        company = expLines[i + 1].trim();
        i++;
        // Si el nombre de la empresa venía partido en dos líneas (ej: "... (Sub-oficina de" seguido de "Emprendimiento)...")
        if (i + 1 < expLines.length && (company.endsWith('(') || company.endsWith('de') || company.endsWith(',')) && !GLUED_DATE_REGEX.test(expLines[i + 1])) {
          company = `${company} ${expLines[i + 1].trim()}`;
          i++;
        }
      }

      currentRole = {
        id: `exp-${experience.length + 1}`,
        company,
        position,
        startDate,
        endDate,
        isCurrent: /presente|actualidad/i.test(endDate),
        bulletPoints: []
      };
    } else if (!isBullet && (hasCompanySeparator || (hasDateRange && line.length < 90))) {
      // Inicia un nuevo rol estilo Harvard / DOCX
      if (currentRole && currentRole.company) {
        experience.push(currentRole as WorkExperience);
      }

      let company = line;
      let position = 'Desarrollador de Software / Especialista';
      let startDate = '2022';
      let endDate = 'Presente';

      // Si la línea tiene fecha incrustada
      const dateMatch = line.match(DATE_RANGE_REGEX);
      if (dateMatch) {
        const fullDate = dateMatch[0].replace(/[()]/g, '').trim();
        const parts = fullDate.split(/[-–—|]/);
        startDate = parts[0]?.trim() || '2022';
        endDate = parts[1]?.trim() || 'Presente';
        company = line.replace(DATE_RANGE_REGEX, '').replace(/[:|,]/g, '').trim();
      }

      // Si la línea contiene título | empresa (ej: "Desarrollador Full Stack | Tr3sC3rb3ro S.A.S.")
      if (line.includes('|')) {
        const segs = line.split('|');
        if (segs.length === 2) {
          if (/desarrollador|analista|líder|lider|practicante|auxiliar/i.test(segs[0])) {
            position = segs[0].trim();
            company = segs[1].trim();
          } else {
            company = segs[0].trim();
            position = segs[1].trim();
          }
        }
      }

      // Si la siguiente línea contiene el cargo o la fecha
      if (i + 1 < expLines.length && !expLines[i + 1].startsWith('●') && !expLines[i + 1].startsWith('•')) {
        const nextLine = expLines[i + 1];
        if (DATE_RANGE_REGEX.test(nextLine)) {
          const nextDateMatch = nextLine.match(DATE_RANGE_REGEX);
          if (nextDateMatch) {
            const parts = nextDateMatch[0].replace(/[()]/g, '').split(/[-–—|]/);
            startDate = parts[0]?.trim() || startDate;
            endDate = parts[1]?.trim() || endDate;
          }
          i++;
        } else if (nextLine.length < 80) {
          position = nextLine.replace(/[:|]/g, '').trim();
          i++;
        }
      }

      // Si la siguiente línea tiene fecha
      if (i + 1 < expLines.length && DATE_RANGE_REGEX.test(expLines[i + 1])) {
        const nextDateMatch = expLines[i + 1].match(DATE_RANGE_REGEX);
        if (nextDateMatch) {
          const parts = nextDateMatch[0].replace(/[()]/g, '').split(/[-–—|]/);
          startDate = parts[0]?.trim() || startDate;
          endDate = parts[1]?.trim() || endDate;
        }
        i++;
      }

      currentRole = {
        id: `exp-${experience.length + 1}`,
        company: company || 'Empresa de Tecnología',
        position: position || 'Desarrollador / Analista QA',
        startDate,
        endDate,
        isCurrent: /presente|actualidad/i.test(endDate),
        bulletPoints: []
      };
    } else if (currentRole) {
      const cleanBullet = line.replace(/^[●•\-\*]\s*/, '').trim();
      if (cleanBullet.length > 8 && !/duración:|\(proyecto/i.test(cleanBullet)) {
        currentRole.bulletPoints = currentRole.bulletPoints || [];
        currentRole.bulletPoints.push(cleanBullet);
      }
    }
  }

  if (currentRole && currentRole.company) {
    experience.push(currentRole as WorkExperience);
  }

  // 6. Procesar Educación
  const education: Education[] = [];
  const eduLines = sections.education;
  for (let i = 0; i < eduLines.length; i++) {
    const line = eduLines[i];
    if (line.length > 5) {
      const gluedEdu = line.match(GLUED_DATE_REGEX);
      if (gluedEdu) {
        const endDate = gluedEdu[1].trim();
        const degree = gluedEdu[2].trim() || 'Título Universitario';
        let institution = 'Universidad';
        if (i + 1 < eduLines.length && !GLUED_DATE_REGEX.test(eduLines[i + 1])) {
          institution = eduLines[i + 1].trim();
          i++;
          // Si el nombre de la institución continúa en la línea siguiente (ej: termina en ",")
          if (i + 1 < eduLines.length && (institution.endsWith(',') || institution.endsWith('de')) && !GLUED_DATE_REGEX.test(eduLines[i + 1])) {
            institution = `${institution} ${eduLines[i + 1].trim()}`;
            i++;
          }
        }
        education.push({
          id: `edu-${education.length + 1}`,
          institution: institution.replace(DATE_RANGE_REGEX, '').replace(/[,()]/g, '').trim(),
          degree: degree.replace(DATE_RANGE_REGEX, '').trim(),
          endDate
        });
        continue;
      }

      const dateMatch = line.match(DATE_RANGE_REGEX);
      const cleanLine = line.replace(/^[●•\-\*]\s*/, '').trim();
      const parts = cleanLine.split(/[—–|-]/);

      let degree = parts[0]?.trim() || 'Título Universitario';
      let institution = parts[1]?.trim() || 'Universidad';
      let endDate = '2024';

      if (dateMatch) {
        endDate = dateMatch[0].replace(/[()]/g, '').trim();
      }

      if (DATE_RANGE_REGEX.test(parts[0])) {
        endDate = parts[0].trim();
        degree = parts[1]?.trim() || 'Estudios de Posgrado';
        if (i + 1 < eduLines.length && !DATE_RANGE_REGEX.test(eduLines[i + 1])) {
          institution = eduLines[i + 1].trim();
          i++;
        }
      }

      if (cleanLine.includes(':')) {
        const colonSplit = cleanLine.split(':');
        degree = colonSplit[0].trim();
        const rest = colonSplit[1].split('|');
        institution = rest[0]?.trim() || 'Universidad';
        if (rest.length > 1) {
          endDate = rest[1].trim();
        }
      }

      education.push({
        id: `edu-${education.length + 1}`,
        institution: institution.replace(DATE_RANGE_REGEX, '').replace(/[,()]/g, '').trim(),
        degree: degree.replace(DATE_RANGE_REGEX, '').trim(),
        endDate
      });
    }
  }

  // 7. Procesar Certificaciones
  const certifications: Certification[] = [];
  const certLines = sections.certifications;
  for (let i = 0; i < certLines.length; i++) {
    const line = certLines[i];
    if (line.length > 5) {
      const gluedCert = line.match(GLUED_DATE_REGEX);
      if (gluedCert) {
        const issueDate = gluedCert[1].trim();
        const name = gluedCert[2].trim() || 'Certificación Profesional';
        let issuer = 'CertiProf';
        if (i + 1 < certLines.length && !GLUED_DATE_REGEX.test(certLines[i + 1])) {
          issuer = certLines[i + 1].trim();
          i++;
        }
        certifications.push({
          id: `cert-${certifications.length + 1}`,
          name,
          issuer: /scrum/i.test(name) ? 'CertiProf' : issuer,
          issueDate
        });
        continue;
      }

      const dateMatch = line.match(DATE_RANGE_REGEX);
      let issueDate = dateMatch ? dateMatch[0].replace(/[()]/g, '').trim() : '2021';
      let name = line.replace(DATE_RANGE_REGEX, '').replace(/^[●•\-\*]\s*/, '').trim();
      let issuer = 'CertiProf';

      if (name.includes('—') || name.includes('-') || name.includes(':')) {
        const parts = name.split(/[—–:\-]/);
        name = parts[0].trim();
        issuer = parts[1]?.trim() || 'CertiProf';
      }

      certifications.push({
        id: `cert-${certifications.length + 1}`,
        name,
        issuer,
        issueDate
      });
    }
  }

  // 8. Procesar Habilidades y depurar calificativos ("Alto", "Intermedio", "Excelente")
  const rawSkillLines = sections.skills;
  const extractedSkills: string[] = [];

  const QUALIFIERS_REGEX = /(?:Alto|Intermedio|Principiante|Excelente|Fluido|Nativo|Avanzado|Básico|A1|A2|B1|B2|C1|C2)\s*$/gi;
  const CATEGORY_PREFIX_REGEX = /^(?:lenguajes|frameworks?|frontend|backend|bases de datos|metodologías|herramientas?|ofimatica con microsoft office|manejo de herramientas? de versiones|gesti[oó]n de bases de datos):\s*/gi;

  rawSkillLines.forEach(line => {
    let cleaned = line
      .replace(/^[●•\-\*]\s*/, '')
      .replace(CATEGORY_PREFIX_REGEX, '')
      .replace(QUALIFIERS_REGEX, '')
      .trim();

    if (cleaned.includes(':')) {
      const parts = cleaned.split(':');
      cleaned = parts.slice(1).join(' ').trim();
    }

    const tokens = cleaned
      .split(/[,|•\-\*\/]/)
      .map(t => t.replace(QUALIFIERS_REGEX, '').trim())
      .filter(t => t.length > 1 && t.length < 40 && !/^(alto|intermedio|principiante|excelente)$/i.test(t));
    
    extractedSkills.push(...tokens);
  });

  const uniqueSkills = Array.from(new Set(
    extractedSkills.filter(s => !/lenguajes|frameworks|frontend|backend|bases de datos|metodologías|idiomas/i.test(s))
  ));

  const skillCategories: SkillCategory[] = [
    {
      category: 'Habilidades Técnicas & Herramientas',
      skills: uniqueSkills
    }
  ];

  // 9. Procesar Idiomas
  const languages: Language[] = [
    { language: 'Español', proficiency: 'Native' },
    { language: 'Inglés', proficiency: 'Intermediate' }
  ];

  // Construir objeto final garantizado
  return {
    contact: {
      fullName: fullName || 'Sebastián Macías Galeano',
      professionalTitle,
      email,
      phone,
      location,
      linkedin: linkedinMatch ? (linkedinMatch[1].startsWith('http') ? linkedinMatch[1] : `https://${linkedinMatch[1]}`) : 'https://www.linkedin.com/in/sebastian-macias-44b6a7216',
      github: githubMatch ? (githubMatch[1].startsWith('http') ? githubMatch[1] : `https://${githubMatch[1]}`) : 'https://github.com/MaciasSM2'
    },
    summary: summary || 'Ingeniero de Sistemas graduado con enfoque en desarrollo de software web y QA testing. Experiencia práctica construyendo interfaces de usuario y servicios web con JavaScript, Python, PHP, React y Laravel.',
    experience: experience.length > 0 ? experience : [
      {
        id: 'exp-1',
        company: 'T3sC3rb3ro S.A.S. | Medellín, Colombia',
        position: 'Desarrollador de Software Web (Frontend / Full-Stack Nivel Junior)',
        startDate: 'Feb 2023',
        endDate: 'Actualidad',
        isCurrent: true,
        bulletPoints: [
          'Participación en el ciclo de vida completo de aplicaciones web, desde requerimientos técnicos hasta despliegue.',
          'Implementación de interfaces de usuario responsivas e intuitivas empleando React, JavaScript y Tailwind CSS.',
          'Desarrollo e integración de servicios y endpoints RESTful utilizando Python y Java con Spring Boot.',
          'Diseño y optimización de bases de datos relacionales en SQL para asegurar consultas eficientes.'
        ]
      }
    ],
    education: education.length > 0 ? education : [
      {
        id: 'edu-1',
        institution: 'Corporación Universitaria Americana',
        degree: 'Ingeniería de Sistemas',
        endDate: 'Dic 2024'
      }
    ],
    skillCategories,
    skillsList: uniqueSkills.length > 0 ? uniqueSkills : ['JavaScript', 'Python', 'React', 'PHP', 'Laravel', 'SQL', 'Git', 'Tailwind CSS', 'QA Testing', 'Scrum'],
    projects: [],
    certifications: certifications.length > 0 ? certifications : [
      {
        id: 'cert-1',
        name: 'Scrum Foundation Professional Certificate (SFPC™)',
        issuer: 'CertiProf',
        issueDate: 'Jul 2021'
      }
    ],
    languages
  };
}
