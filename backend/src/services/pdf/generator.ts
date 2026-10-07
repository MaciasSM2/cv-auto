import puppeteer from 'puppeteer';
import { ResumeData, TemplateType } from '../../types/resume';

function renderHarvardTemplate(resume: ResumeData): string {
  const { contact, summary, experience, education, skillsList } = resume;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${contact.fullName} - Resume</title>
  <style>
    @page {
      size: letter;
      margin: 18mm 18mm 18mm 18mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #111;
      line-height: 1.4;
      font-size: 10.5pt;
      margin: 0;
      padding: 0;
      background: #fff;
    }
    .header {
      text-align: center;
      margin-bottom: 14pt;
      border-bottom: 1.5pt solid #222;
      padding-bottom: 8pt;
    }
    .name {
      font-size: 20pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5pt;
      margin: 0 0 4pt 0;
    }
    .title {
      font-size: 11pt;
      font-weight: 600;
      color: #333;
      margin: 0 0 4pt 0;
    }
    .contact-line {
      font-size: 9.5pt;
      color: #444;
    }
    .contact-line span {
      margin: 0 4pt;
    }
    .section {
      margin-bottom: 12pt;
    }
    .section-title {
      font-size: 11pt;
      font-weight: 700;
      text-transform: uppercase;
      border-bottom: 0.75pt solid #888;
      padding-bottom: 2pt;
      margin-bottom: 6pt;
      letter-spacing: 0.5pt;
    }
    .item {
      margin-bottom: 8pt;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      font-weight: 600;
    }
    .item-sub {
      display: flex;
      justify-content: space-between;
      font-style: italic;
      color: #333;
      margin-bottom: 3pt;
    }
    ul {
      margin: 2pt 0 0 16pt;
      padding: 0;
    }
    li {
      margin-bottom: 2.5pt;
      text-align: justify;
    }
    .summary-text {
      text-align: justify;
      margin: 0;
    }
    .skills-block {
      line-height: 1.5;
    }
    .skill-tag {
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="name">${contact.fullName || 'NOMBRE COMPLETO'}</h1>
    <div class="title">${contact.professionalTitle || 'Título Profesional'}</div>
    <div class="contact-line">
      ${contact.location ? `<span>${contact.location}</span>•` : ''}
      ${contact.phone ? `<span>${contact.phone}</span>•` : ''}
      ${contact.email ? `<span>${contact.email}</span>` : ''}
      ${contact.linkedin ? `•<span>${contact.linkedin}</span>` : ''}
      ${contact.github ? `•<span>${contact.github}</span>` : ''}
    </div>
  </div>

  ${summary ? `
  <div class="section">
    <div class="section-title">PERFIL PROFESIONAL</div>
    <p class="summary-text">${summary}</p>
  </div>` : ''}

  <div class="section">
    <div class="section-title">EXPERIENCIA LABORAL</div>
    ${experience.map(exp => `
      <div class="item">
        <div class="item-header">
          <span>${exp.company}</span>
          <span>${exp.startDate} - ${exp.endDate}</span>
        </div>
        <div class="item-sub">
          <span>${exp.position}</span>
          <span>${exp.location || ''}</span>
        </div>
        <ul>
          ${(exp.bulletPoints || []).map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <div class="section-title">EDUCACIÓN</div>
    ${education.map(edu => `
      <div class="item">
        <div class="item-header">
          <span>${edu.institution}</span>
          <span>${edu.endDate}</span>
        </div>
        <div class="item-sub">
          <span>${edu.degree}</span>
          <span>${edu.fieldOfStudy || ''}</span>
        </div>
      </div>
    `).join('')}
  </div>

  ${skillsList && skillsList.length > 0 ? `
  <div class="section">
    <div class="section-title">HABILIDADES TÉCNICAS Y COMPETENCIAS</div>
    <div class="skills-block">
      <span class="skill-tag">${skillsList.join(' • ')}</span>
    </div>
  </div>` : ''}
</body>
</html>
  `;
}

function renderCanvaModernTemplate(resume: ResumeData): string {
  const { contact, summary, experience, education, skillsList } = resume;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${contact.fullName} - Modern CV</title>
  <style>
    @page {
      size: letter;
      margin: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #2b2d42;
      margin: 0;
      padding: 0;
      background: #f8fafc;
      font-size: 10pt;
      line-height: 1.45;
    }
    .container {
      display: flex;
      min-height: 100vh;
    }
    .sidebar {
      width: 32%;
      background: #1e293b;
      color: #f1f5f9;
      padding: 24pt 18pt;
      box-sizing: border-box;
    }
    .main {
      width: 68%;
      background: #ffffff;
      padding: 24pt 24pt;
      box-sizing: border-box;
    }
    .avatar-container {
      width: 76pt;
      height: 76pt;
      margin: 0 auto 14pt auto;
      border-radius: 50%;
      overflow: hidden;
      border: 2.5pt solid #38bdf8;
      box-shadow: 0 4pt 12pt rgba(0,0,0,0.3);
    }
    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .avatar-placeholder {
      width: 70pt;
      height: 70pt;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #06b6d4);
      margin: 0 auto 14pt auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24pt;
      font-weight: 700;
      color: #fff;
    }
    .side-title {
      font-size: 11pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8pt;
      color: #38bdf8;
      border-bottom: 1.5pt solid #334155;
      padding-bottom: 4pt;
      margin: 16pt 0 8pt 0;
    }
    .contact-item {
      margin-bottom: 6pt;
      font-size: 8.5pt;
      word-break: break-all;
    }
    .contact-label {
      color: #94a3b8;
      font-size: 7.5pt;
      text-transform: uppercase;
    }
    .skill-pill {
      display: inline-block;
      background: #334155;
      color: #e2e8f0;
      padding: 2pt 6pt;
      border-radius: 4pt;
      font-size: 8pt;
      margin: 2pt 2pt;
    }
    .name-main {
      font-size: 22pt;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.1;
      margin: 0 0 4pt 0;
    }
    .role-badge {
      display: inline-block;
      background: #eff6ff;
      color: #2563eb;
      font-weight: 700;
      font-size: 10pt;
      padding: 3pt 8pt;
      border-radius: 4pt;
      margin-bottom: 14pt;
    }
    .section-main-title {
      font-size: 12pt;
      font-weight: 700;
      color: #0f172a;
      display: flex;
      align-items: center;
      border-bottom: 2pt solid #e2e8f0;
      padding-bottom: 4pt;
      margin: 14pt 0 10pt 0;
      letter-spacing: 0.5pt;
    }
    .summary-text {
      color: #475569;
      font-size: 9.5pt;
      line-height: 1.5;
      margin: 0 0 10pt 0;
    }
    .exp-item {
      margin-bottom: 12pt;
    }
    .exp-top {
      display: flex;
      justify-content: space-between;
      font-weight: 700;
      color: #1e293b;
      font-size: 10pt;
    }
    .exp-role {
      color: #2563eb;
      font-weight: 600;
      font-size: 9pt;
      margin-bottom: 4pt;
    }
    .exp-date {
      color: #64748b;
      font-size: 8.5pt;
      font-weight: 500;
    }
    ul.bullets {
      margin: 0 0 0 14pt;
      padding: 0;
      color: #334155;
    }
    ul.bullets li {
      margin-bottom: 3pt;
      font-size: 9pt;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="sidebar">
      ${contact.photoUrl ? `
      <div class="avatar-container">
        <img src="${contact.photoUrl}" class="avatar-img" alt="Foto de perfil" />
      </div>` : `
      <div class="avatar-placeholder">
        ${(contact.fullName || 'CV').slice(0, 2).toUpperCase()}
      </div>`}

      <div class="side-title">CONTACTO</div>
      ${contact.email ? `<div class="contact-item"><div class="contact-label">Email</div>${contact.email}</div>` : ''}
      ${contact.phone ? `<div class="contact-item"><div class="contact-label">Teléfono</div>${contact.phone}</div>` : ''}
      ${contact.location ? `<div class="contact-item"><div class="contact-label">Ubicación</div>${contact.location}</div>` : ''}
      ${contact.linkedin ? `<div class="contact-item"><div class="contact-label">LinkedIn</div>${contact.linkedin}</div>` : ''}
      ${contact.github ? `<div class="contact-item"><div class="contact-label">GitHub</div>${contact.github}</div>` : ''}

      <div class="side-title">EDUCACIÓN</div>
      ${education.map(edu => `
        <div style="margin-bottom: 8pt;">
          <div style="font-weight: 700; font-size: 9pt;">${edu.institution}</div>
          <div style="color: #94a3b8; font-size: 8.5pt;">${edu.degree}</div>
          <div style="color: #64748b; font-size: 7.5pt;">${edu.endDate}</div>
        </div>
      `).join('')}

      ${skillsList && skillsList.length > 0 ? `
      <div class="side-title">HABILIDADES</div>
      <div>
        ${skillsList.map(s => `<span class="skill-pill">${s}</span>`).join('')}
      </div>` : ''}
    </div>

    <div class="main">
      <h1 class="name-main">${contact.fullName || 'NOMBRE COMPLETO'}</h1>
      <div class="role-badge">${contact.professionalTitle || 'Especialista Profesional'}</div>

      ${summary ? `
      <div class="section-main-title">PERFIL PROFESIONAL</div>
      <p class="summary-text">${summary}</p>` : ''}

      <div class="section-main-title">EXPERIENCIA LABORAL</div>
      ${experience.map(exp => `
        <div class="exp-item">
          <div class="exp-top">
            <span>${exp.company}</span>
            <span class="exp-date">${exp.startDate} - ${exp.endDate}</span>
          </div>
          <div class="exp-role">${exp.position}</div>
          <ul class="bullets">
            ${(exp.bulletPoints || []).map(b => `<li>${b}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>
  `;
}

import fs from 'fs';

function getSystemChromePath(): string | undefined {
  const possiblePaths = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium'
  ].filter(Boolean) as string[];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return undefined;
}

export async function generatePdfBuffer(resume: ResumeData, template: TemplateType = 'ats-harvard'): Promise<Buffer> {
  const html = template === 'modern-canva' 
    ? renderCanvaModernTemplate(resume)
    : renderHarvardTemplate(resume);

  const executablePath = getSystemChromePath();
  const launchOptions: any = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=medium'
    ]
  };

  if (executablePath) {
    launchOptions.executablePath = executablePath;
  }

  const browser = await puppeteer.launch(launchOptions);

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    const pdfUint8 = await page.pdf({
      format: 'Letter',
      printBackground: true,
      preferCSSPageSize: true
    });

    return Buffer.from(pdfUint8);
  } finally {
    await browser.close();
  }
}
