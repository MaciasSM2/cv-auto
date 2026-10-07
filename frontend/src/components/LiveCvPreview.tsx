import React from 'react';
import { ResumeData, TemplateType } from '../types/resume';

interface LiveCvPreviewProps {
  resume: ResumeData;
  template: TemplateType;
}

export const LiveCvPreview: React.FC<LiveCvPreviewProps> = ({ resume, template }) => {
  const { contact, summary, experience, education, skillsList } = resume;

  if (template === 'modern-canva') {
    return (
      <div style={{
        background: '#f8fafc',
        color: '#1e293b',
        borderRadius: '8px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
        minHeight: '750px',
        display: 'flex',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: 'hidden'
      }}>
        {/* Sidebar */}
        <div style={{
          width: '34%',
          background: '#0f172a',
          color: '#f8fafc',
          padding: '28px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Avatar / Foto de Perfil */}
          {contact.photoUrl ? (
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              border: '2.5px solid #38bdf8',
              overflow: 'hidden',
              margin: '0 auto 8px auto',
              boxShadow: '0 4px 16px rgba(56, 189, 248, 0.4)'
            }}>
              <img
                src={contact.photoUrl}
                alt={contact.fullName}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          ) : (
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: 800,
              margin: '0 auto 8px auto',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)'
            }}>
              {(contact.fullName || 'CV').slice(0, 2).toUpperCase()}
            </div>
          )}

          <div>
            <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#38bdf8', letterSpacing: '1px', borderBottom: '1px solid #334155', paddingBottom: '4px', marginBottom: '8px' }}>
              CONTACTO
            </h4>
            <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '6px', color: '#cbd5e1' }}>
              {contact.email && <div>✉️ {contact.email}</div>}
              {contact.phone && <div>📞 {contact.phone}</div>}
              {contact.location && <div>📍 {contact.location}</div>}
              {contact.linkedin && <div style={{ wordBreak: 'break-all' }}>🔗 {contact.linkedin}</div>}
              {contact.github && <div style={{ wordBreak: 'break-all' }}>💻 {contact.github}</div>}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#38bdf8', letterSpacing: '1px', borderBottom: '1px solid #334155', paddingBottom: '4px', marginBottom: '8px' }}>
              EDUCACIÓN
            </h4>
            {education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: '8px', fontSize: '0.78rem' }}>
                <div style={{ fontWeight: 700, color: '#f1f5f9' }}>{edu.institution}</div>
                <div style={{ color: '#94a3b8' }}>{edu.degree}</div>
                <div style={{ color: '#64748b', fontSize: '0.72rem' }}>{edu.endDate}</div>
              </div>
            ))}
          </div>

          {skillsList && skillsList.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#38bdf8', letterSpacing: '1px', borderBottom: '1px solid #334155', paddingBottom: '4px', marginBottom: '8px' }}>
                HABILIDADES
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {skillsList.map((skill, idx) => (
                  <span key={idx} style={{
                    background: '#1e293b',
                    color: '#e2e8f0',
                    fontSize: '0.72rem',
                    padding: '3px 7px',
                    borderRadius: '4px',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div style={{ width: '66%', background: '#fff', padding: '28px 24px' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
            {contact.fullName || 'NOMBRE COMPLETO'}
          </h1>
          <div style={{
            display: 'inline-block',
            background: '#eff6ff',
            color: '#2563eb',
            fontWeight: 700,
            fontSize: '0.85rem',
            padding: '3px 8px',
            borderRadius: '4px',
            marginTop: '6px',
            marginBottom: '14px'
          }}>
            {contact.professionalTitle || 'Especialista Profesional'}
          </div>

          {summary && (
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '4px', marginBottom: '6px' }}>
                PERFIL PROFESIONAL
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.45, textAlign: 'justify' }}>
                {summary}
              </p>
            </div>
          )}

          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '4px', marginBottom: '10px' }}>
              EXPERIENCIA LABORAL
            </h3>
            {experience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
                  <span>{exp.company}</span>
                  <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 500 }}>{exp.startDate} - {exp.endDate}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600, marginBottom: '4px' }}>
                  {exp.position}
                </div>
                <ul style={{ margin: '0 0 0 16px', padding: 0, fontSize: '0.8rem', color: '#334155' }}>
                  {(exp.bulletPoints || []).map((bullet, bIdx) => (
                    <li key={bIdx} style={{ marginBottom: '3px' }}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Plantilla ATS Harvard (1 Columna estándar)
  return (
    <div style={{
      background: '#ffffff',
      color: '#111827',
      padding: '36px 36px',
      borderRadius: '8px',
      boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
      minHeight: '750px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
      fontSize: '0.85rem',
      lineHeight: 1.4
    }}>
      {/* Header Centrado */}
      <div style={{ textAlign: 'center', borderBottom: '1.5px solid #111', paddingBottom: '10px', marginBottom: '14px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
          {contact.fullName || 'NOMBRE COMPLETO'}
        </h1>
        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginTop: '2px' }}>
          {contact.professionalTitle || 'Título Profesional'}
        </div>
        <div style={{ fontSize: '0.78rem', color: '#4b5563', marginTop: '4px' }}>
          {[contact.location, contact.phone, contact.email, contact.linkedin, contact.github]
            .filter(Boolean)
            .join(' • ')}
        </div>
      </div>

      {/* Perfil */}
      {summary && (
        <div style={{ marginBottom: '12px' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #9ca3af', paddingBottom: '2px', marginBottom: '6px', letterSpacing: '0.5px' }}>
            PERFIL PROFESIONAL
          </h3>
          <p style={{ fontSize: '0.82rem', margin: 0, textAlign: 'justify' }}>{summary}</p>
        </div>
      )}

      {/* Experiencia Laboral */}
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #9ca3af', paddingBottom: '2px', marginBottom: '8px', letterSpacing: '0.5px' }}>
          EXPERIENCIA LABORAL
        </h3>
        {experience.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.82rem' }}>
              <span>{exp.company}</span>
              <span>{exp.startDate} – {exp.endDate}</span>
            </div>
            <div style={{ fontStyle: 'italic', fontSize: '0.8rem', color: '#374151', marginBottom: '3px' }}>
              {exp.position} {exp.location ? `— ${exp.location}` : ''}
            </div>
            <ul style={{ margin: '2px 0 0 16px', padding: 0, fontSize: '0.8rem' }}>
              {(exp.bulletPoints || []).map((b, bIdx) => (
                <li key={bIdx} style={{ marginBottom: '2.5px', textAlign: 'justify' }}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Educación */}
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #9ca3af', paddingBottom: '2px', marginBottom: '6px', letterSpacing: '0.5px' }}>
          EDUCACIÓN
        </h3>
        {education.map((edu, idx) => (
          <div key={idx} style={{ marginBottom: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.82rem' }}>
              <span>{edu.institution}</span>
              <span>{edu.endDate}</span>
            </div>
            <div style={{ fontStyle: 'italic', fontSize: '0.8rem', color: '#374151' }}>
              {edu.degree}
            </div>
          </div>
        ))}
      </div>

      {/* Habilidades Técnicas */}
      {skillsList && skillsList.length > 0 && (
        <div>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #9ca3af', paddingBottom: '2px', marginBottom: '6px', letterSpacing: '0.5px' }}>
            HABILIDADES TÉCNICAS Y COMPETENCIAS
          </h3>
          <div style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
            <strong>Habilidades: </strong> {skillsList.join(' • ')}
          </div>
        </div>
      )}
    </div>
  );
};
