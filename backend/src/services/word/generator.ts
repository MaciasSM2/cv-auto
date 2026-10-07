import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { ResumeData } from '../../types/resume';

export async function generateDocxBuffer(resume: ResumeData): Promise<Buffer> {
  const { contact, summary, experience, education, skillsList } = resume;

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              bottom: 1000,
              left: 1000,
              right: 1000,
            },
          },
        },
        children: [
          // Header: Nombre Completo
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: (contact.fullName || 'NOMBRE COMPLETO').toUpperCase(),
                bold: true,
                size: 32, // 16pt
                font: 'Arial',
              }),
            ],
          }),

          // Título Profesional
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: contact.professionalTitle || 'Especialista Profesional',
                bold: true,
                size: 22, // 11pt
                color: '333333',
                font: 'Arial',
              }),
            ],
          }),

          // Contact info line
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: [contact.location, contact.phone, contact.email, contact.linkedin, contact.github]
                  .filter(Boolean)
                  .join('  |  '),
                size: 19, // 9.5pt
                color: '555555',
                font: 'Arial',
              }),
            ],
          }),

          // Perfil Profesional
          ...(summary
            ? [
                new Paragraph({
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: 200, after: 100 },
                  children: [
                    new TextRun({
                      text: 'PERFIL PROFESIONAL',
                      bold: true,
                      size: 22,
                      font: 'Arial',
                    }),
                  ],
                }),
                new Paragraph({
                  spacing: { after: 200 },
                  children: [
                    new TextRun({
                      text: summary,
                      size: 20,
                      font: 'Arial',
                    }),
                  ],
                }),
              ]
            : []),

          // Experiencia Laboral
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: 'EXPERIENCIA LABORAL',
                bold: true,
                size: 22,
                font: 'Arial',
              }),
            ],
          }),

          ...experience.flatMap((exp) => [
            new Paragraph({
              spacing: { before: 120, after: 40 },
              children: [
                new TextRun({
                  text: exp.company,
                  bold: true,
                  size: 21,
                  font: 'Arial',
                }),
                new TextRun({
                  text: `  |  ${exp.startDate} - ${exp.endDate}`,
                  size: 19,
                  color: '555555',
                  font: 'Arial',
                }),
              ],
            }),
            new Paragraph({
              spacing: { after: 80 },
              children: [
                new TextRun({
                  text: `${exp.position}${exp.location ? ' — ' + exp.location : ''}`,
                  italics: true,
                  size: 20,
                  color: '333333',
                  font: 'Arial',
                }),
              ],
            }),
            ...(exp.bulletPoints || []).map(
              (bullet) =>
                new Paragraph({
                  bullet: { level: 0 },
                  spacing: { after: 40 },
                  children: [
                    new TextRun({
                      text: bullet,
                      size: 20,
                      font: 'Arial',
                    }),
                  ],
                })
            ),
          ]),

          // Educación
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 100 },
            children: [
              new TextRun({
                text: 'EDUCACIÓN',
                bold: true,
                size: 22,
                font: 'Arial',
              }),
            ],
          }),

          ...education.flatMap((edu) => [
            new Paragraph({
              spacing: { before: 80, after: 20 },
              children: [
                new TextRun({
                  text: edu.institution,
                  bold: true,
                  size: 21,
                  font: 'Arial',
                }),
                new TextRun({
                  text: `  |  ${edu.endDate}`,
                  size: 19,
                  color: '555555',
                  font: 'Arial',
                }),
              ],
            }),
            new Paragraph({
              spacing: { after: 80 },
              children: [
                new TextRun({
                  text: `${edu.degree}${edu.fieldOfStudy ? ' — ' + edu.fieldOfStudy : ''}`,
                  italics: true,
                  size: 20,
                  font: 'Arial',
                }),
              ],
            }),
          ]),

          // Habilidades
          ...(skillsList && skillsList.length > 0
            ? [
                new Paragraph({
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: 240, after: 100 },
                  children: [
                    new TextRun({
                      text: 'HABILIDADES TÉCNICAS Y COMPETENCIAS',
                      bold: true,
                      size: 22,
                      font: 'Arial',
                    }),
                  ],
                }),
                new Paragraph({
                  spacing: { after: 140 },
                  children: [
                    new TextRun({
                      text: skillsList.join('  •  '),
                      size: 20,
                      font: 'Arial',
                    }),
                  ],
                }),
              ]
            : []),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}
