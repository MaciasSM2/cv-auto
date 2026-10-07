export interface VerbCategory {
  category: 'leadership' | 'tech_dev' | 'efficiency' | 'growth_sales' | 'problem_solving';
  label: string;
  verbsEs: string[];
  verbsEn: string[];
}

export const ACTION_VERBS_TAXONOMY: VerbCategory[] = [
  {
    category: 'leadership',
    label: 'Liderazgo y Gestión de Equipos',
    verbsEs: [
      'lideré', 'orquesté', 'coordiné', 'dirigí', 'fomenté', 'conduje',
      'reorganicé', 'supervisé', 'estructuré', 'gestioné', 'guié', 'articulé'
    ],
    verbsEn: [
      'spearheaded', 'orchestrated', 'coordinated', 'directed', 'championed',
      'managed', 'supervised', 'structured', 'guided', 'led', 'empowered'
    ]
  },
  {
    category: 'tech_dev',
    label: 'Desarrollo, Arquitectura e Innovación Técnica',
    verbsEs: [
      'diseñé', 'implementé', 'arquitecturé', 'desarrollé', 'construí',
      'desplegué', 'migré', 'estandaricé', 'refactoricé', 'programé',
      'integré', 'configuré', 'prototipé', 'diseñé y probé'
    ],
    verbsEn: [
      'architected', 'engineered', 'developed', 'built', 'deployed',
      'migrated', 'refactored', 'integrated', 'configured', 'prototyped', 'authored'
    ]
  },
  {
    category: 'efficiency',
    label: 'Eficiencia, Automatización y Optimización',
    verbsEs: [
      'optimicé', 'automaticé', 'reduje', 'agilicé', 'simplifiqué',
      'consolidé', 'aceleré', 'estandaricé', 'modernicé', 'minimizé', 'reestructuré'
    ],
    verbsEn: [
      'optimized', 'automated', 'streamlined', 'reduced', 'accelerated',
      'consolidated', 'simplified', 'boosted', 'modernized', 'revamped'
    ]
  },
  {
    category: 'growth_sales',
    label: 'Crecimiento, Ventas y Métricas de Negocio',
    verbsEs: [
      'incrementé', 'escalé', 'capté', 'maximizé', 'generé',
      'multipliqué', 'expandí', 'negocié', 'cerré', 'potencié', 'amplié'
    ],
    verbsEn: [
      'scaled', 'boosted', 'generated', 'expanded', 'drove',
      'amplified', 'negotiated', 'acquired', 'delivered', 'maximized'
    ]
  },
  {
    category: 'problem_solving',
    label: 'Resolución de Problemas y Diagnóstico',
    verbsEs: [
      'resolví', 'solucioné', 'transformé', 'diagnostiqué', 'depuré',
      'identifiqué', 'mitigué', 'estabilicé', 'restablecí', 'recuperé'
    ],
    verbsEn: [
      'resolved', 'diagnosed', 'debugged', 'mitigated', 'stabilized',
      'rectified', 'overhauled', 'troubleshot', 'restored'
    ]
  }
];

export const REMOTE_COLLABORATION_SKILLS = [
  'Git / GitHub', 'GitLab', 'Slack', 'Jira', 'Confluence', 'Asana', 'Notion',
  'Trello', 'Docker', 'CI/CD Pipelines', 'Metodologías Ágiles (Scrum / Kanban)',
  'Comunicación Asíncrona', 'Documentación Técnica', 'Code Reviews'
];
