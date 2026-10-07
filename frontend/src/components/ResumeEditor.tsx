import React, { useState } from 'react';
import { ResumeData, WorkExperience } from '../types/resume';
import { User, Briefcase, GraduationCap, Code2, Plus, Trash2, Sparkles, RefreshCw, Camera, Upload, Lightbulb } from 'lucide-react';
import { BulletOptimizerModal } from './BulletOptimizerModal';

const SUGGESTED_REMOTE_SKILLS = [
  'Git / GitHub', 'Docker', 'Slack', 'Jira', 'Metodologías Ágiles (Scrum)',
  'AWS', 'PostgreSQL', 'TypeScript', 'CI/CD Pipelines', 'Notion', 'Asana',
  'Comunicación Asíncrona', 'REST APIs', 'Node.js', 'React'
];

interface ResumeEditorProps {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
  onOptimizeBullet?: (bullet: string) => Promise<string>;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ resume, onChange }) => {
  const [activeTab, setActiveTab] = useState<'contact' | 'experience' | 'education' | 'skills'>('experience');

  // Estados de Asistentes Heurísticos
  const [bulletModal, setBulletModal] = useState<{ expIdx: number; bulletIdx: number; bulletText: string } | null>(null);
  const [summaryTone, setSummaryTone] = useState<'tech' | 'executive' | 'creative' | 'general'>('tech');
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const handleContactChange = (field: keyof typeof resume.contact, value: string) => {
    onChange({
      ...resume,
      contact: {
        ...resume.contact,
        [field]: value
      }
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleContactChange('photoUrl', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    handleContactChange('photoUrl', '');
  };

  const handleSummaryChange = (summary: string) => {
    onChange({ ...resume, summary });
  };

  const handleGenerateSummary = async () => {
    setGeneratingSummary(true);
    try {
      const res = await fetch('/api/optimizer/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, tone: summaryTone })
      });
      const data = await res.json();
      if (data.success && data.summary) {
        handleSummaryChange(data.summary);
      }
    } catch (err) {
      console.error('Error generando resumen:', err);
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleExperienceChange = (index: number, updatedExp: WorkExperience) => {
    const updated = [...resume.experience];
    updated[index] = updatedExp;
    onChange({ ...resume, experience: updated });
  };

  const addExperienceRole = () => {
    const newRole: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: 'Nueva Empresa',
      position: 'Cargo / Rol',
      startDate: '2023',
      endDate: 'Presente',
      isCurrent: true,
      bulletPoints: ['Lideré iniciativas de alto impacto incrementando la productividad en un 20%.']
    };
    onChange({ ...resume, experience: [newRole, ...resume.experience] });
  };

  const removeExperienceRole = (index: number) => {
    const updated = resume.experience.filter((_, i) => i !== index);
    onChange({ ...resume, experience: updated });
  };

  const handleBulletChange = (expIdx: number, bulletIdx: number, text: string) => {
    const updatedExp = { ...resume.experience[expIdx] };
    const updatedBullets = [...updatedExp.bulletPoints];
    updatedBullets[bulletIdx] = text;
    updatedExp.bulletPoints = updatedBullets;
    handleExperienceChange(expIdx, updatedExp);
  };

  const addBullet = (expIdx: number) => {
    const updatedExp = { ...resume.experience[expIdx] };
    updatedExp.bulletPoints = [...updatedExp.bulletPoints, 'Nueva responsabilidad con métrica de resultado...'];
    handleExperienceChange(expIdx, updatedExp);
  };

  const removeBullet = (expIdx: number, bulletIdx: number) => {
    const updatedExp = { ...resume.experience[expIdx] };
    updatedExp.bulletPoints = updatedExp.bulletPoints.filter((_, i) => i !== bulletIdx);
    handleExperienceChange(expIdx, updatedExp);
  };

  // Habilidades
  const [newSkillText, setNewSkillText] = useState('');
  const addSkill = () => {
    if (newSkillText.trim()) {
      const updatedList = Array.from(new Set([...resume.skillsList, newSkillText.trim()]));
      onChange({ ...resume, skillsList: updatedList });
      setNewSkillText('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedList = resume.skillsList.filter(s => s !== skillToRemove);
    onChange({ ...resume, skillsList: updatedList });
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Selector de Pestañas */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        {[
          { id: 'experience', label: 'Experiencia', icon: Briefcase },
          { id: 'contact', label: 'Contacto & Perfil', icon: User },
          { id: 'skills', label: 'Habilidades', icon: Code2 },
          { id: 'education', label: 'Educación', icon: GraduationCap },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: isActive ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                color: isActive ? '#60a5fa' : 'var(--text-muted)',
                border: isActive ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 12px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Contenido Pestaña Contacto & Perfil */}
      {activeTab === 'contact' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Subida de Foto para Plantilla Canva */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px dashed var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {resume.contact.photoUrl ? (
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  border: '2px solid #38bdf8',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  <img
                    src={resume.contact.photoUrl}
                    alt="Foto de perfil"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ) : (
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px dashed #60a5fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#60a5fa',
                  flexShrink: 0
                }}>
                  <Camera size={22} />
                </div>
              )}
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9' }}>
                  Foto de Perfil (Plantilla Moderna / Canva)
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {resume.contact.photoUrl
                    ? 'Foto cargada correctamente. Se mostrará en el modelo Canva.'
                    : 'JPG, PNG o WebP. Se excluirá automáticamente en modo ATS para cumplir normas.'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <label className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.75rem', cursor: 'pointer' }}>
                <Upload size={13} />
                {resume.contact.photoUrl ? 'Cambiar' : 'Subir Foto'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={handlePhotoUpload}
                />
              </label>
              {resume.contact.photoUrl && (
                <button
                  onClick={removePhoto}
                  className="btn-secondary"
                  style={{ padding: '5px 8px', fontSize: '0.75rem', color: '#fb7185' }}
                  title="Eliminar foto"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Nombre Completo</label>
              <input
                className="glass-input"
                value={resume.contact.fullName}
                onChange={e => handleContactChange('fullName', e.target.value)}
                placeholder="Ej. Ana Morales"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Título Profesional</label>
              <input
                className="glass-input"
                value={resume.contact.professionalTitle}
                onChange={e => handleContactChange('professionalTitle', e.target.value)}
                placeholder="Ej. Senior Cloud & DevOps Engineer"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Correo Electrónico</label>
              <input
                className="glass-input"
                value={resume.contact.email}
                onChange={e => handleContactChange('email', e.target.value)}
                placeholder="tu.correo@profesional.com"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Teléfono</label>
              <input
                className="glass-input"
                value={resume.contact.phone}
                onChange={e => handleContactChange('phone', e.target.value)}
                placeholder="+57 300 123 4567"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Ubicación (Ciudad, País)</label>
              <input
                className="glass-input"
                value={resume.contact.location}
                onChange={e => handleContactChange('location', e.target.value)}
                placeholder="Bogotá, Colombia / Remoto"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>LinkedIn URL</label>
              <input
                className="glass-input"
                value={resume.contact.linkedin || ''}
                onChange={e => handleContactChange('linkedin', e.target.value)}
                placeholder="linkedin.com/in/tu-perfil"
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Perfil Profesional / Resumen</label>
              <span style={{ fontSize: '0.72rem', color: resume.summary.length > 50 && resume.summary.length < 400 ? '#34d399' : '#f59e0b' }}>
                {resume.summary.length} caracteres (Ideal: 150-350)
              </span>
            </div>
            <textarea
              className="glass-input"
              rows={4}
              value={resume.summary}
              onChange={e => handleSummaryChange(e.target.value)}
              placeholder="Especialista con más de 5 años optimizando procesos..."
              style={{ resize: 'vertical' }}
            />
            {/* Asistente Heurístico de Perfil Profesional */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
              <select
                value={summaryTone}
                onChange={e => setSummaryTone(e.target.value as any)}
                className="glass-input"
                style={{ width: 'auto', padding: '5px 10px', fontSize: '0.78rem' }}
              >
                <option value="tech" style={{ background: '#0f172a' }}>💻 Perfil Tech / Remoto</option>
                <option value="executive" style={{ background: '#0f172a' }}>👔 Perfil Ejecutivo</option>
                <option value="creative" style={{ background: '#0f172a' }}>🎨 Perfil Creativo</option>
                <option value="general" style={{ background: '#0f172a' }}>🌐 Perfil General</option>
              </select>

              <button
                onClick={handleGenerateSummary}
                disabled={generatingSummary}
                className="btn-magic"
                style={{ padding: '6px 14px', fontSize: '0.78rem' }}
              >
                {generatingSummary ? <RefreshCw size={13} className="spin" /> : <Sparkles size={13} />}
                {generatingSummary ? 'Generando...' : '✨ Generar con Asistente ATS'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido Pestaña Experiencia */}
      {activeTab === 'experience' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Roles ({resume.experience.length})
            </span>
            <button onClick={addExperienceRole} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
              <Plus size={14} /> Añadir Cargo
            </button>
          </div>

          {resume.experience.map((exp, expIdx) => (
            <div key={exp.id || expIdx} style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', alignItems: 'center' }}>
                <input
                  className="glass-input"
                  value={exp.company}
                  onChange={e => handleExperienceChange(expIdx, { ...exp, company: e.target.value })}
                  placeholder="Empresa"
                />
                <input
                  className="glass-input"
                  value={exp.position}
                  onChange={e => handleExperienceChange(expIdx, { ...exp, position: e.target.value })}
                  placeholder="Cargo"
                />
                <button
                  onClick={() => removeExperienceRole(expIdx)}
                  style={{ background: 'transparent', border: 'none', color: '#fb7185', cursor: 'pointer', padding: '6px' }}
                  title="Eliminar rol"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input
                  className="glass-input"
                  value={exp.startDate}
                  onChange={e => handleExperienceChange(expIdx, { ...exp, startDate: e.target.value })}
                  placeholder="Fecha Inicio (ej. 2021-03)"
                />
                <input
                  className="glass-input"
                  value={exp.endDate}
                  onChange={e => handleExperienceChange(expIdx, { ...exp, endDate: e.target.value })}
                  placeholder="Fecha Fin (ej. Presente)"
                />
              </div>

              {/* Viñetas con optimizador IA */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
                    Logros (Fórmula Google XYZ)
                  </label>
                  <button onClick={() => addBullet(expIdx)} style={{ background: 'transparent', border: 'none', color: '#38bdf8', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}>
                    + Añadir viñeta
                  </button>
                </div>

                {exp.bulletPoints.map((bullet, bIdx) => (
                  <div key={bIdx} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                    <textarea
                      className="glass-input"
                      rows={2}
                      value={bullet}
                      onChange={e => handleBulletChange(expIdx, bIdx, e.target.value)}
                      style={{ fontSize: '0.82rem', resize: 'vertical' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <button
                        onClick={() => setBulletModal({ expIdx, bulletIdx: bIdx, bulletText: bullet })}
                        className="btn-magic"
                        title="Optimizar con fórmulas Google XYZ (Ver 3 opciones de impacto)"
                        style={{ gap: '4px', padding: '5px 8px', fontSize: '0.75rem' }}
                      >
                        <Sparkles size={12} />
                        XYZ
                      </button>
                      <button
                        onClick={() => removeBullet(expIdx, bIdx)}
                        style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contenido Pestaña Habilidades */}
      {activeTab === 'skills' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Agregar Habilidad / Tecnología Clave (ATS Keyword)
            </label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <input
                className="glass-input"
                value={newSkillText}
                onChange={e => setNewSkillText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSkill()}
                placeholder="ej. Docker, Python, AWS, Scrum, Next.js..."
              />
              <button onClick={addSkill} className="btn-primary" style={{ padding: '6px 14px' }}>
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {resume.skillsList.map((skill, idx) => (
              <span
                key={idx}
                style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  color: '#93c5fd',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.8rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  style={{ background: 'transparent', border: 'none', color: '#fb7185', cursor: 'pointer', padding: 0, display: 'flex' }}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          {/* Sugerencias Rápidas de Habilidades Remotas & Tech */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            marginTop: '6px'
          }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lightbulb size={13} color="#f59e0b" /> Habilidades Clave para Trabajo Remoto & Tech (1 Clic para añadir):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {SUGGESTED_REMOTE_SKILLS.filter(s => !resume.skillsList.includes(s)).map((skill, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => {
                    const updatedList = Array.from(new Set([...resume.skillsList, skill]));
                    onChange({ ...resume, skillsList: updatedList });
                  }}
                  style={{
                    background: 'rgba(59, 130, 246, 0.08)',
                    border: '1px dashed rgba(59, 130, 246, 0.4)',
                    color: '#cbd5e1',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    fontSize: '0.74rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s'
                  }}
                  title={`Añadir "${skill}" a tu lista`}
                >
                  <Plus size={11} color="#38bdf8" />
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contenido Pestaña Educación */}
      {activeTab === 'education' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {resume.education.map((edu, idx) => (
            <div key={idx} style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <input
                className="glass-input"
                value={edu.institution}
                onChange={e => {
                  const updated = [...resume.education];
                  updated[idx].institution = e.target.value;
                  onChange({ ...resume, education: updated });
                }}
                placeholder="Institución o Universidad"
              />
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>
                <input
                  className="glass-input"
                  value={edu.degree}
                  onChange={e => {
                    const updated = [...resume.education];
                    updated[idx].degree = e.target.value;
                    onChange({ ...resume, education: updated });
                  }}
                  placeholder="Título obtenido"
                />
                <input
                  className="glass-input"
                  value={edu.endDate}
                  onChange={e => {
                    const updated = [...resume.education];
                    updated[idx].endDate = e.target.value;
                    onChange({ ...resume, education: updated });
                  }}
                  placeholder="Año de egreso"
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal de Optimización de Viñetas en 1 Clic */}
      {bulletModal && (
        <BulletOptimizerModal
          isOpen={true}
          originalBullet={bulletModal.bulletText}
          expIdx={bulletModal.expIdx}
          bulletIdx={bulletModal.bulletIdx}
          onApply={(expIdx, bulletIdx, improved) => {
            handleBulletChange(expIdx, bulletIdx, improved);
          }}
          onClose={() => setBulletModal(null)}
        />
      )}
    </div>
  );
};
