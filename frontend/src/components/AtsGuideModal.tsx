import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Sparkles, BookOpen, User, Briefcase, Code2 } from 'lucide-react';

interface AtsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AtsGuideModal: React.FC<AtsGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<'contact' | 'summary' | 'experience' | 'skills'>('experience');

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '820px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'rgba(59, 130, 246, 0.2)',
              padding: '8px',
              borderRadius: '8px',
              color: '#60a5fa'
            }}>
              <BookOpen size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                Guía Práctica de Normas ATS 2026 & LinkedIn
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Casos reales de transformación: Por qué los sistemas descartan CVs y cómo corregirlos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '12px 24px',
          background: 'rgba(15, 23, 42, 0.3)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          {[
            { id: 'experience', label: 'Experiencia & Google XYZ', icon: Briefcase },
            { id: 'summary', label: 'Perfil Profesional', icon: Sparkles },
            { id: 'contact', label: 'Contacto & Encabezado', icon: User },
            { id: 'skills', label: 'Habilidades & Keywords', icon: Code2 }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                style={{
                  background: isActive ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? '#60a5fa' : 'var(--text-muted)',
                  border: isActive ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
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

        {/* Content Body */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activeCategory === 'experience' && (
            <>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' }}>
                  La Regla de Oro: Fórmula Google XYZ
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Los reclutadores y los algoritmos ATS rechazan las listas de "deberes diarios". En su lugar, premian logros redactados con la estructura: 
                  <strong style={{ color: '#38bdf8' }}> [Logré X]</strong>, medido por <strong style={{ color: '#34d399' }}>[Métrica Y]</strong>, haciendo <strong style={{ color: '#a78bfa' }}>[Acción o Herramienta Z]</strong>.
                </p>
              </div>

              {/* Comparación Caso 1: Tech / Backend */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{
                  background: 'rgba(244, 63, 94, 0.06)',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fb7185', fontWeight: 700, fontSize: '0.82rem', marginBottom: '8px' }}>
                    <AlertTriangle size={15} /> ❌ Antes (Rechazado por ATS)
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#fecdd3', fontStyle: 'italic', marginBottom: '8px' }}>
                    "Responsable de mantener el backend del sistema y arreglar los errores reportados en la base de datos."
                  </p>
                  <div style={{ fontSize: '0.72rem', color: '#fda4af' }}>
                    ⚠️ <strong>Falla:</strong> Frase pasiva ("Responsable de"), sin métricas, sin impacto tangible en la empresa.
                  </div>
                </div>

                <div style={{
                  background: 'rgba(16, 185, 129, 0.06)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 700, fontSize: '0.82rem', marginBottom: '8px' }}>
                    <CheckCircle2 size={15} /> ✅ Después (Optimizado ATS Google XYZ)
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#a7f3d0', fontWeight: 500, marginBottom: '8px' }}>
                    "Optimicé consultas SQL y caché con Redis en el backend, reduciendo la latencia de respuesta en un 40% para más de 80,000 usuarios activos."
                  </p>
                  <div style={{ fontSize: '0.72rem', color: '#6ee7b7' }}>
                    ✨ <strong>Por qué funciona:</strong> Inicia con verbo fuerte ("Optimicé"), cuantifica el resultado ("40%"), y menciona la escala ("80,000 usuarios").
                  </div>
                </div>
              </div>

              {/* Comparación Caso 2: Operaciones / Remoto */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{
                  background: 'rgba(244, 63, 94, 0.06)',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fb7185', fontWeight: 700, fontSize: '0.82rem', marginBottom: '8px' }}>
                    <AlertTriangle size={15} /> ❌ Antes (Genérico)
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#fecdd3', fontStyle: 'italic', marginBottom: '8px' }}>
                    "Ayudé en la atención al cliente y a organizar los tickets del equipo remoto."
                  </p>
                  <div style={{ fontSize: '0.72rem', color: '#fda4af' }}>
                    ⚠️ <strong>Falla:</strong> "Ayudé a" minimiza tu rol; no muestra herramientas ni satisfacción del cliente.
                  </div>
                </div>

                <div style={{
                  background: 'rgba(16, 185, 129, 0.06)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 700, fontSize: '0.82rem', marginBottom: '8px' }}>
                    <CheckCircle2 size={15} /> ✅ Después (Impacto Profesional)
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#a7f3d0', fontWeight: 500, marginBottom: '8px' }}>
                    "Estandaricé los flujos de resolución de tickets en Jira y Zendesk, alcanzando un 96% de satisfacción del cliente (CSAT) y reduciendo el tiempo de primera respuesta en un 30%."
                  </p>
                  <div style={{ fontSize: '0.72rem', color: '#6ee7b7' }}>
                    ✨ <strong>Por qué funciona:</strong> Muestra herramientas de trabajo remoto estándar e indicadores formales (CSAT, tiempo de respuesta).
                  </div>
                </div>
              </div>
            </>
          )}

          {activeCategory === 'summary' && (
            <>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' }}>
                  El Gancho Profesional (3 a 4 líneas)
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  El resumen ejecutivo es lo primero que escanea un reclutador en los primeros 6 segundos. Debe condensar tu título, años de experiencia, tecnologías principales y tu mayor impacto.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{
                  background: 'rgba(244, 63, 94, 0.06)',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fb7185', fontWeight: 700, fontSize: '0.82rem', marginBottom: '8px' }}>
                    <AlertTriangle size={15} /> ❌ Antes (Clichés vacíos)
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#fecdd3', fontStyle: 'italic', marginBottom: '8px' }}>
                    "Persona responsable, honesta y trabajadora con deseos de superación. Capaz de trabajar bajo presión y en equipo. Busco empresa donde me den la oportunidad de crecer profesionalmente."
                  </p>
                  <div style={{ fontSize: '0.72rem', color: '#fda4af' }}>
                    ⚠️ <strong>Falla:</strong> 0% de palabras clave técnicas; frases repetidas que los reclutadores ignoran por completo.
                  </div>
                </div>

                <div style={{
                  background: 'rgba(16, 185, 129, 0.06)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 700, fontSize: '0.82rem', marginBottom: '8px' }}>
                    <CheckCircle2 size={15} /> ✅ Después (Perfil Ejecutivo ATS)
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#a7f3d0', fontWeight: 500, marginBottom: '8px' }}>
                    "Desarrollador Full Stack con más de 4 años de experiencia construyendo aplicaciones web con React, Node.js y PostgreSQL. Especializado en arquitectura de microservicios y despliegues en la nube (AWS), logrando optimizar en un 35% el rendimiento transaccional para empresas SaaS."
                  </p>
                  <div style={{ fontSize: '0.72rem', color: '#6ee7b7' }}>
                    ✨ <strong>Por qué funciona:</strong> Define el rol exacto, años de experiencia, stack técnico clave y propuesta de valor comercial.
                  </div>
                </div>
              </div>
            </>
          )}

          {activeCategory === 'contact' && (
            <>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' }}>
                  Encabezado Limpio y Privacidad ATS
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Los estándares modernos prohíben incluir dirección exacta de casa, estado civil, documento de identidad o fotos en plantillas técnicas (normas anti-discriminación en USA/Europa).
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{
                  background: 'rgba(244, 63, 94, 0.06)',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fb7185', fontWeight: 700, fontSize: '0.82rem', marginBottom: '8px' }}>
                    <AlertTriangle size={15} /> ❌ Antes (Riesgoso y desordenado)
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#fecdd3', fontStyle: 'italic', marginBottom: '8px' }}>
                    "Carlos Gómez, Casado, 32 años, C.C. 10.345.678. Carrera 15 # 45-20 Apto 301, Barrio Teusaquillo, Bogotá. Correo: carlitos_el_mejor@hotmail.com"
                  </p>
                  <div style={{ fontSize: '0.72rem', color: '#fda4af' }}>
                    ⚠️ <strong>Falla:</strong> Expone datos personales confidenciales innecesarios y usa correo informal sin enlaces profesionales.
                  </div>
                </div>

                <div style={{
                  background: 'rgba(16, 185, 129, 0.06)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 700, fontSize: '0.82rem', marginBottom: '8px' }}>
                    <CheckCircle2 size={15} /> ✅ Después (Estándar Global)
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#a7f3d0', fontWeight: 500, marginBottom: '8px' }}>
                    <strong>Carlos Gómez</strong> | Senior Cloud DevOps Engineer<br />
                    Bogotá, Colombia • (+57) 310 987 6543 • carlos.gomez@profesional.com • linkedin.com/in/carlosgomez • github.com/carlosgomez
                  </p>
                  <div style={{ fontSize: '0.72rem', color: '#6ee7b7' }}>
                    ✨ <strong>Por qué funciona:</strong> Ciudad y País permiten filtros de proximidad ATS; correo profesional y enlaces directos facilitan la verificación de credenciales.
                  </div>
                </div>
              </div>
            </>
          )}

          {activeCategory === 'skills' && (
            <>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' }}>
                  Indexación Semántica y Palabras Clave
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Los reclutadores buscan candidatos en bases de datos ATS mediante operadores booleanos: <code>"React" AND ("Node.js" OR "TypeScript") AND ("Docker" OR "AWS")</code>. Las habilidades deben ser términos reconocibles de la industria.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{
                  background: 'rgba(244, 63, 94, 0.06)',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fb7185', fontWeight: 700, fontSize: '0.82rem', marginBottom: '8px' }}>
                    <AlertTriangle size={15} /> ❌ Antes (Mezclado y sin foco)
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#fecdd3', fontStyle: 'italic', marginBottom: '8px' }}>
                    "Habilidades: Computadores, Internet, Puntualidad, Trabajo en equipo, Ganas de aprender, React, Office, Comunicación."
                  </p>
                  <div style={{ fontSize: '0.72rem', color: '#fda4af' }}>
                    ⚠️ <strong>Falla:</strong> Las habilidades blandas genéricas sin contexto no posicionan en los filtros de búsqueda técnica.
                  </div>
                </div>

                <div style={{
                  background: 'rgba(16, 185, 129, 0.06)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 700, fontSize: '0.82rem', marginBottom: '8px' }}>
                    <CheckCircle2 size={15} /> ✅ Después (Taxonomía Técnica Estructurada)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#a7f3d0', fontWeight: 500, lineHeight: 1.6 }}>
                    • <strong>Frontend & Backend:</strong> React 18, TypeScript, Node.js, Express, PostgreSQL<br />
                    • <strong>Cloud & DevOps:</strong> Docker, AWS (S3, EC2), CI/CD, Git / GitHub Actions<br />
                    • <strong>Colaboración Remota:</strong> Jira, Slack, Metodologías Ágiles (Scrum)
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#6ee7b7', marginTop: '6px' }}>
                    ✨ <strong>Por qué funciona:</strong> Cada término es indexado por el motor ATS aumentando al 95% la visibilidad del perfil.
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'flex-end',
          background: 'rgba(15, 23, 42, 0.6)'
        }}>
          <button onClick={onClose} className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.84rem' }}>
            Entendido, volver a mi CV
          </button>
        </div>
      </div>
    </div>
  );
};
