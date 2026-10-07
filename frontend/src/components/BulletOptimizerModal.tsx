import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, RefreshCw, AlertCircle, Award } from 'lucide-react';
import { OptimizationSuggestion } from '../types/resume';

interface BulletOptimizerModalProps {
  isOpen: boolean;
  originalBullet: string;
  expIdx: number;
  bulletIdx: number;
  onApply: (expIdx: number, bulletIdx: number, improved: string) => void;
  onClose: () => void;
}

export const BulletOptimizerModal: React.FC<BulletOptimizerModalProps> = ({
  isOpen,
  originalBullet,
  expIdx,
  bulletIdx,
  onApply,
  onClose
}) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && originalBullet) {
      fetchSuggestions();
    }
  }, [isOpen, originalBullet]);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/optimizer/suggest-bullets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bullet: originalBullet })
      });
      const data = await res.json();
      if (data.success && data.suggestions) {
        setSuggestions(data.suggestions);
      } else {
        setError('No se pudieron obtener sugerencias para este texto.');
      }
    } catch (err: any) {
      setError('Error de comunicación con el motor heurístico.');
    } finally {
      setLoading(false);
    }
  };

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
        maxWidth: '720px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              background: 'rgba(6, 182, 212, 0.2)',
              padding: '6px',
              borderRadius: '6px',
              color: '#38bdf8'
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                Optimizador de Logros (Google XYZ / STAR)
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Convierte tareas pasivas en logros de alto impacto cuantificables en 1 clic
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Texto Original */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px'
          }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '4px' }}>
              Tu Redacción Actual
            </div>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', fontStyle: 'italic', margin: 0 }}>
              "{originalBullet}"
            </p>
          </div>

          {loading ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <RefreshCw size={28} className="spin" color="#38bdf8" style={{ margin: '0 auto 12px auto' }} />
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f1f5f9' }}>
                Generando alternativas de alto impacto...
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Aplicando fórmulas Google XYZ y sustituyendo verbos pasivos por métricas de resultado.
              </div>
            </div>
          ) : error ? (
            <div style={{
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#fb7185',
              fontSize: '0.8rem'
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Opciones Recomendadas (Selecciona una para aplicar):
              </div>

              {suggestions.map((sug, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-blue" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                        {sug.variantLabel || `Opción ${idx + 1}`}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>
                        Fórmula: {sug.impactFormulaApplied}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onApply(expIdx, bulletIdx, sug.improvedBullet);
                        onClose();
                      }}
                      className="btn-primary"
                      style={{ padding: '5px 12px', fontSize: '0.75rem', gap: '4px' }}
                    >
                      <Check size={13} />
                      Aplicar a mi CV
                    </button>
                  </div>

                  <p style={{
                    fontSize: '0.84rem',
                    color: '#f8fafc',
                    fontWeight: 500,
                    lineHeight: 1.5,
                    margin: 0,
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '10px',
                    borderRadius: '6px',
                    borderLeft: '3px solid #3b82f6'
                  }}>
                    {sug.improvedBullet}
                  </p>

                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Award size={13} color="#10b981" />
                    <span><strong>Por qué funciona en ATS:</strong> {sug.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.6)'
        }}>
          <button
            onClick={fetchSuggestions}
            disabled={loading}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
          >
            <RefreshCw size={12} className={loading ? 'spin' : ''} />
            Regenerar variantes
          </button>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.78rem' }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
