import React, { useState } from 'react';
import { ResumeData } from '../types/resume';
import { Target, X, Check, AlertCircle, Sparkles } from 'lucide-react';

interface JobMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
}

interface MatchResponse {
  matchPercentage: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}

export const JobMatchModal: React.FC<JobMatchModalProps> = ({ isOpen, onClose, resume }) => {
  const [jobText, setJobText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResponse | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!jobText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/cv/job-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription: jobText })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.match);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px',
        background: '#0f172a',
        border: '1px solid rgba(255,255,255,0.15)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={22} color="#06b6d4" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Comparador contra Oferta de LinkedIn (Job Match)</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '14px' }}>
          Pega el texto de la vacante de empleo para contrastar tus habilidades y palabras clave contra los requisitos del reclutador.
        </p>

        <textarea
          className="glass-input"
          rows={5}
          value={jobText}
          onChange={e => setJobText(e.target.value)}
          placeholder="Pega aquí la descripción completa del puesto (Requisitos, responsabilidades, tecnologías)..."
          style={{ marginBottom: '14px', resize: 'vertical' }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '20px' }}>
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={handleAnalyze} disabled={loading || !jobText.trim()} className="btn-primary">
            {loading ? 'Calculando Coincidencia...' : 'Analizar Compatibilidad ATS'}
          </button>
        </div>

        {/* Resultados */}
        {result && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Nivel de Ajuste a la Vacante:</span>
              <span style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: result.matchPercentage >= 70 ? '#34d399' : result.matchPercentage >= 40 ? '#fbbf24' : '#fb7185'
              }}>
                {result.matchPercentage}% Coincidencia
              </span>
            </div>

            {/* Palabras clave detectadas */}
            <div>
              <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Check size={14} /> Palabras clave encontradas en tu CV ({result.matchedKeywords.length}):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {result.matchedKeywords.map((k, i) => (
                  <span key={i} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px' }}>
                    {k}
                  </span>
                ))}
              </div>
            </div>

            {/* Palabras clave faltantes */}
            {result.missingKeywords.length > 0 && (
              <div>
                <div style={{ fontSize: '0.78rem', color: '#fb7185', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <AlertCircle size={14} /> Requisitos de la vacante ausentes en tu CV ({result.missingKeywords.length}):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {result.missingKeywords.map((k, i) => (
                    <span key={i} style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px' }}>
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recomendaciones */}
            <div>
              <div style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={14} /> Sugerencias de Optimización:
              </div>
              <ul style={{ margin: '0 0 0 16px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                {result.recommendations.map((rec, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
