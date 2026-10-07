import React from 'react';
import { AuditResult } from '../types/resume';
import { ShieldCheck, AlertTriangle, CheckCircle2, TrendingUp, Sparkles, Award } from 'lucide-react';

interface ScorecardProps {
  audit: AuditResult | null;
  loading?: boolean;
}

export const Scorecard: React.FC<ScorecardProps> = ({ audit, loading }) => {
  if (loading) {
    return (
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
          <Sparkles className="glow-effect" size={32} color="#06b6d4" />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Auditando según Normas ATS 2026...</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
          Analizando parseabilidad, fórmulas Google XYZ y palabras clave.
        </p>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
        <ShieldCheck size={36} color="#64748b" style={{ margin: '0 auto 10px auto' }} />
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Scorecard ATS</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '4px' }}>
          Sube tu CV o edita la información para generar la auditoría en tiempo real.
        </p>
      </div>
    );
  }

  const { overallScore, rating, dimensions, keyFindings, metricsCount, weakVerbsFound } = audit;

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#10b981'; // Emerald
    if (score >= 70) return '#3b82f6'; // Blue
    if (score >= 50) return '#f59e0b'; // Amber
    return '#f43f5e'; // Rose
  };

  const scoreColor = getScoreColor(overallScore);

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header con Score Circular */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)', fontWeight: 700 }}>
            AUDITORÍA ATS & RECRUITER 2026
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color={scoreColor} />
            Diagnóstico de CV
          </h2>
        </div>

        {/* Círculo de puntuación */}
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          border: `4px solid ${scoreColor}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(15, 23, 42, 0.8)',
          boxShadow: `0 0 20px ${scoreColor}40`
        }}>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{overallScore}</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 100</span>
        </div>
      </div>

      {/* Badge de estado general */}
      <div>
        <span className={`badge ${
          overallScore >= 85 ? 'badge-emerald' :
          overallScore >= 70 ? 'badge-blue' :
          overallScore >= 50 ? 'badge-amber' : 'badge-rose'
        }`} style={{ fontSize: '0.82rem', padding: '4px 12px' }}>
          {rating}
        </span>
      </div>

      {/* Desglose de 5 dimensiones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
          Rendimiento por Dimensión
        </h4>

        {[
          { label: 'Parseabilidad ATS (Single-column)', dim: dimensions.atsParseability },
          { label: 'Impacto Cuantificable (Google XYZ)', dim: dimensions.measurableImpact },
          { label: 'Palabras Clave & Skills', dim: dimensions.keywordRelevance },
          { label: 'Verbos de Acción & Tono', dim: dimensions.actionVerbsAndTone },
          { label: 'Perfil & Estructura', dim: dimensions.completenessAndStructure }
        ].map((item, idx) => (
          <div key={idx} style={{ fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{item.label}</span>
              <span style={{ fontWeight: 700, color: getScoreColor(item.dim.score) }}>{item.dim.score}%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${item.dim.score}%`,
                background: getScoreColor(item.dim.score),
                borderRadius: '3px',
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Resumen rápido de métricas detectadas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        background: 'rgba(255,255,255,0.03)',
        padding: '10px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={16} color="#38bdf8" />
          <div style={{ fontSize: '0.75rem' }}>
            <div style={{ color: 'var(--text-muted)' }}>Métricas detectadas</div>
            <div style={{ fontWeight: 700, color: '#fff' }}>{metricsCount} viñetas</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={16} color={weakVerbsFound.length > 0 ? '#f59e0b' : '#10b981'} />
          <div style={{ fontSize: '0.75rem' }}>
            <div style={{ color: 'var(--text-muted)' }}>Frases pasivas débiles</div>
            <div style={{ fontWeight: 700, color: '#fff' }}>{weakVerbsFound.length} encontradas</div>
          </div>
        </div>
      </div>

      {/* Puntos Críticos a Corregir */}
      {keyFindings.criticalFixes.length > 0 && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.08)',
          border: '1px solid rgba(244, 63, 94, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fb7185', fontWeight: 700, fontSize: '0.82rem', marginBottom: '6px' }}>
            <AlertTriangle size={15} />
            Errores Críticos ATS
          </div>
          <ul style={{ margin: '0 0 0 16px', fontSize: '0.78rem', color: '#fecdd3' }}>
            {keyFindings.criticalFixes.map((fix, i) => (
              <li key={i} style={{ marginBottom: '3px' }}>{fix}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recomendaciones de Mejora */}
      {keyFindings.recommendedImprovements.length > 0 && (
        <div style={{
          background: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60a5fa', fontWeight: 700, fontSize: '0.82rem', marginBottom: '6px' }}>
            <Sparkles size={15} />
            Optimizaciones Recomendadas
          </div>
          <ul style={{ margin: '0 0 0 16px', fontSize: '0.78rem', color: '#bfdbfe' }}>
            {keyFindings.recommendedImprovements.map((rec, i) => (
              <li key={i} style={{ marginBottom: '3px' }}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Fortalezas */}
      {keyFindings.strengths.length > 0 && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 700, fontSize: '0.82rem', marginBottom: '6px' }}>
            <CheckCircle2 size={15} />
            Fortalezas Validadas
          </div>
          <ul style={{ margin: '0 0 0 16px', fontSize: '0.78rem', color: '#a7f3d0' }}>
            {keyFindings.strengths.map((str, i) => (
              <li key={i} style={{ marginBottom: '3px' }}>{str}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
