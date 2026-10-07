import React, { useState, useEffect, useRef } from 'react';
import { ResumeData, AuditResult, TemplateType } from './types/resume';
import { Scorecard } from './components/Scorecard';
import { LiveCvPreview } from './components/LiveCvPreview';
import { ResumeEditor } from './components/ResumeEditor';
import { JobMatchModal } from './components/JobMatchModal';
import { AtsGuideModal } from './components/AtsGuideModal';
import { notifyParentApp } from './module/CvModuleContract';
import { 
  FileText, 
  UploadCloud, 
  Download, 
  Target, 
  RotateCcw,
  LayoutTemplate,
  Layers,
  ChevronDown,
  FileCode,
  CheckCircle2,
  X,
  BookOpen
} from 'lucide-react';

const INITIAL_RESUME: ResumeData = {
  contact: {
    fullName: 'Alejandro Morales',
    professionalTitle: 'Senior Full Stack Engineer & Cloud Architect',
    email: 'alejandro.morales@techmail.com',
    phone: '+57 310 987 6543',
    location: 'Bogotá, Colombia / Remoto',
    linkedin: 'https://linkedin.com/in/alejandro-morales-dev',
    github: 'https://github.com/alejandro-morales'
  },
  summary: 'Ingeniero de Software con más de 6 años de experiencia diseñando arquitecturas escalables y microservicios en la nube. Especialista en optimización de rendimiento de aplicaciones web de alto tráfico, reducción de costos de infraestructura y liderazgo técnico de equipos ágiles.',
  experience: [
    {
      id: 'exp-1',
      company: 'TechGlobal Innovations',
      position: 'Líder Técnico Full Stack',
      location: 'Remoto',
      startDate: '2022-04',
      endDate: 'Presente',
      isCurrent: true,
      bulletPoints: [
        'Lideré y arquitecté la migración a microservicios con Docker y Kubernetes, reduciendo los tiempos de despliegue en un 45%.',
        'Optimicé las consultas de base de datos PostgreSQL y caché con Redis, incrementando la velocidad de respuesta de la API en un 60% para 120k usuarios diarios.',
        'Automaticé pipelines de CI/CD en GitHub Actions, disminuyendo la tasa de fallos en producción a menos del 1%.'
      ]
    },
    {
      id: 'exp-2',
      company: 'Nexus Software Studio',
      position: 'Desarrollador Frontend Senior',
      location: 'Bogotá, Colombia',
      startDate: '2019-08',
      endDate: '2022-03',
      isCurrent: false,
      bulletPoints: [
        'Diseñé la arquitectura frontend modular con React y TypeScript, mejorando la puntuación de Google Core Web Vitals en un 35%.',
        'Implementé el nuevo sistema de diseño corporativo, acelerando en un 25% la velocidad de entrega de nuevas funcionalidades por el equipo de diseño.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Universidad Nacional de Colombia',
      degree: 'Ingeniería de Sistemas y Computación',
      endDate: '2019'
    }
  ],
  skillCategories: [
    {
      category: 'Tecnologías Clave',
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'GraphQL', 'CI/CD', 'Git']
    }
  ],
  skillsList: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'GraphQL', 'CI/CD', 'Git', 'Next.js', 'Redis']
};

export function App() {
  const [resume, setResume] = useState<ResumeData>(INITIAL_RESUME);
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [template, setTemplate] = useState<TemplateType>('ats-harvard');
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<'pdf' | 'docx' | null>(null);
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [isJobMatchOpen, setIsJobMatchOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isExportingStructured, setIsExportingStructured] = useState(false);
  const [parentSavedMessage, setParentSavedMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Recalcular auditoría en cambios
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoadingAudit(true);
      try {
        const res = await fetch('/api/cv/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resume)
        });
        const data = await res.json();
        if (data.success) {
          setAudit(data.audit);
        }
      } catch (err) {
        console.error('Error calculando score:', err);
      } finally {
        setLoadingAudit(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [resume]);

  // Manejar subida de archivo existente (PDF o DOCX)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    setUploadSuccessMessage(null);
    const formData = new FormData();
    formData.append('resumeFile', file);

    try {
      const res = await fetch('/api/cv/parse', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.data) {
        setResume(data.data);
        if (data.audit) setAudit(data.audit);
        setUploadSuccessMessage(`¡Archivo "${file.name}" importado y estructurado con éxito! Se cargó en la plataforma y se evaluó en el Scorecard.`);
      } else {
        alert(data.error || 'No se pudo procesar el archivo.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión al procesar el archivo.');
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Optimizar viñeta individual
  const handleOptimizeBullet = async (bullet: string): Promise<string> => {
    try {
      const res = await fetch('/api/cv/optimize-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bullet })
      });
      const data = await res.json();
      if (data.success && data.suggestion) {
        return data.suggestion.improvedBullet;
      }
    } catch (err) {
      console.error(err);
    }
    return bullet;
  };

  // Descargar PDF Vectorial
  const handleDownloadPdf = async () => {
    setDownloadingFormat('pdf');
    setIsDownloadDropdownOpen(false);
    try {
      const res = await fetch('/api/cv/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, template })
      });

      if (!res.ok) throw new Error('Error generando el PDF');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = (resume.contact.fullName || 'cv').toLowerCase().replace(/\s+/g, '_');
      a.download = `${safeName}_${template}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert('Error descargando el PDF. Asegúrate de que el backend esté ejecutándose.');
    } finally {
      setDownloadingFormat(null);
    }
  };

  // Descargar Word (.docx) Editable
  const handleDownloadDocx = async () => {
    setDownloadingFormat('docx');
    setIsDownloadDropdownOpen(false);
    try {
      const res = await fetch('/api/cv/export-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume })
      });

      if (!res.ok) throw new Error('Error generando el documento Word');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = (resume.contact.fullName || 'cv').toLowerCase().replace(/\s+/g, '_');
      a.download = `${safeName}_editable.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert('Error descargando el documento Word. Asegúrate de que el backend esté ejecutándose.');
    } finally {
      setDownloadingFormat(null);
    }
  };

  // Guardar y sincronizar con la plataforma madre (Contrato Modular)
  const handleSaveToParentPlatform = async () => {
    setIsExportingStructured(true);
    try {
      const res = await fetch('/api/cv/export-structured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume })
      });
      const data = await res.json();
      if (data.success && data.candidatePayload) {
        if (audit) {
          notifyParentApp({
            status: 'completed',
            resume,
            audit,
            candidatePayload: data.candidatePayload
          });
        }
        setParentSavedMessage('¡Hoja de vida validada y sincronizada con la plataforma exitosamente!');
        setTimeout(() => setParentSavedMessage(null), 5000);
      }
    } catch (err) {
      console.error('Error sincronizando datos con la plataforma:', err);
    } finally {
      setIsExportingStructured(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <header style={{
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '12px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(6, 182, 212, 0.4)'
          }}>
            <FileText size={20} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>CV-AUTO</span>
              <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>ATS 2026 Ready</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Auditoría Automática & Generador Vectorial
            </div>
          </div>
        </div>

        {/* Acciones Superiores */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Selector de Plantilla */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '3px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <button
              onClick={() => setTemplate('ats-harvard')}
              style={{
                background: template === 'ats-harvard' ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
                color: template === 'ats-harvard' ? '#60a5fa' : 'var(--text-muted)',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LayoutTemplate size={14} /> Modo ATS Harvard (1 Col)
            </button>
            <button
              onClick={() => setTemplate('modern-canva')}
              style={{
                background: template === 'modern-canva' ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
                color: template === 'modern-canva' ? '#60a5fa' : 'var(--text-muted)',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Layers size={14} /> Modo Moderno Canva (Visual)
            </button>
          </div>

          {/* Subir CV */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingFile}
            className="btn-secondary"
          >
            <UploadCloud size={16} />
            {uploadingFile ? 'Extrayendo datos...' : 'Subir CV (PDF/Word)'}
          </button>

          {/* Guía Educativa de Normas ATS 2026 */}
          <button
            onClick={() => setIsGuideOpen(true)}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8' }}
            title="Ver ejemplos prácticos de Antes vs Después para cada sección del CV"
          >
            <BookOpen size={16} color="#38bdf8" />
            <span>Guía ATS (Ejemplos)</span>
          </button>

          {/* Comparar con vacante */}
          <button onClick={() => setIsJobMatchOpen(true)} className="btn-secondary">
            <Target size={16} color="#06b6d4" />
            Job Match (LinkedIn)
          </button>

          {/* Menú Desplegable de Descarga Dual: PDF o Word (.docx) */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsDownloadDropdownOpen(!isDownloadDropdownOpen)}
              disabled={downloadingFormat !== null}
              className="btn-accent"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <Download size={16} />
              <span>
                {downloadingFormat === 'pdf' ? 'Compilando PDF...' :
                 downloadingFormat === 'docx' ? 'Generando Word...' :
                 'Descargar CV'}
              </span>
              <ChevronDown
                size={14}
                style={{
                  transform: isDownloadDropdownOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease'
                }}
              />
            </button>

            {isDownloadDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '260px',
                  background: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
                  zIndex: 200,
                  overflow: 'hidden',
                  padding: '6px'
                }}
              >
                <button
                  onClick={handleDownloadPdf}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    padding: '10px 12px',
                    textAlign: 'left',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.85rem'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <FileText size={18} color="#38bdf8" />
                  <div>
                    <div style={{ fontWeight: 600 }}>Descargar PDF Vectorial</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {template === 'ats-harvard' ? 'Plantilla Harvard ATS (1 Col)' : 'Plantilla Moderna Canva'}
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleDownloadDocx}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    padding: '10px 12px',
                    textAlign: 'left',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.85rem'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <FileCode size={18} color="#34d399" />
                  <div>
                    <div style={{ fontWeight: 600 }}>Descargar Word Editable (.docx)</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Formato estándar editable en Word
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Botón de Sincronización con Plataforma Madre */}
          <button
            onClick={handleSaveToParentPlatform}
            disabled={isExportingStructured}
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #059669, #10b981)',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}
            title="Exportar perfil estructurado y notificar a la plataforma madre"
          >
            <CheckCircle2 size={16} />
            <span>{isExportingStructured ? 'Sincronizando...' : 'Guardar en Plataforma'}</span>
          </button>
        </div>
      </header>

      {/* Banner de Notificación de Subida Exitosa */}
      {uploadSuccessMessage && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.12)',
          borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.85rem',
          color: '#34d399'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} />
            <span>{uploadSuccessMessage}</span>
          </div>
          <button
            onClick={() => setUploadSuccessMessage(null)}
            style={{ background: 'transparent', border: 'none', color: '#34d399', cursor: 'pointer', display: 'flex' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Banner de Sincronización Exitosa con Plataforma Madre */}
      {parentSavedMessage && (
        <div style={{
          background: 'rgba(5, 150, 105, 0.15)',
          borderBottom: '1px solid rgba(16, 185, 129, 0.4)',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.85rem',
          color: '#34d399'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} />
            <span>{parentSavedMessage}</span>
          </div>
          <button
            onClick={() => setParentSavedMessage(null)}
            style={{ background: 'transparent', border: 'none', color: '#34d399', cursor: 'pointer', display: 'flex' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Grid Content */}
      <main style={{
        flex: 1,
        padding: '20px 24px',
        display: 'grid',
        gridTemplateColumns: 'minmax(380px, 1fr) minmax(340px, 380px) minmax(420px, 1.1fr)',
        gap: '20px',
        alignItems: 'start'
      }}>
        {/* Columna Izquierda: Editor */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9' }}>Editor de Contenido</h3>
            <button
              onClick={() => setResume(INITIAL_RESUME)}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <RotateCcw size={12} /> Cargar Ejemplo
            </button>
          </div>
          <ResumeEditor
            resume={resume}
            onChange={setResume}
            onOptimizeBullet={handleOptimizeBullet}
          />
        </section>

        {/* Columna Central: Diagnóstico y Scorecard ATS */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'sticky', top: '80px' }}>
          <Scorecard audit={audit} loading={loadingAudit} />
        </section>

        {/* Columna Derecha: Previsualización en Vivo */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9' }}>
              Vista Previa en Vivo ({template === 'ats-harvard' ? 'ATS Harvard' : 'Moderna Canva'})
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#34d399' }}>● Renderizado Vectorial Activo</span>
          </div>
          <div style={{ maxHeight: '85vh', overflowY: 'auto', borderRadius: '8px' }}>
            <LiveCvPreview resume={resume} template={template} />
          </div>
        </section>
      </main>

      {/* Modal Job Match */}
      <JobMatchModal
        isOpen={isJobMatchOpen}
        onClose={() => setIsJobMatchOpen(false)}
        resume={resume}
      />

      {/* Modal Guía Educativa ATS 2026 */}
      <AtsGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}

export default App;
