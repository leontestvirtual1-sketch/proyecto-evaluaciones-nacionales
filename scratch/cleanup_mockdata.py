# -*- coding: utf-8 -*-
import re

with open(r'c:\Proyectos\Proyecto Evaluaciones Nacionales\src\data\mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove prueba-102 from pruebasMock
prueba_102_pattern = r",\s*\{\s*id:\s*'prueba-102'.*?estado:\s*'finalizada'\s*\}"
content = re.sub(prueba_102_pattern, "", content, flags=re.DOTALL)

# 2. Update reporteLenguajeMock
new_reporte = """export const reporteLenguajeMock: ReporteTabuladoCurso = {
  pruebaId: 'prueba-len2m-101',
  pruebaTitulo: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026',
  cursoNombre: '2° Medio A',
  totalAlumnosRendidos: 10,
  totalAlumnosMatriculados: 10,
  promedioPorcentajeLogro: 73.5,
  promedioEscalaNacional: 278,
  desgloseEjes: [
    { ejeId: 'eje-len-2m-1', codigo: 'LEN-LIT-2M', nombre: 'Lectura de Textos Literarios (Narrativa y Epistolar)', preguntasTotal: 3, respuestasCorrectas: 8, porcentajeLogro: 80, estado: 'optimo' },
    { ejeId: 'eje-len-2m-2', codigo: 'LEN-NOLIT-2M', nombre: 'Lectura de Textos No Literarios (Expositivos y Científicos)', preguntasTotal: 18, respuestasCorrectas: 15, porcentajeLogro: 84, estado: 'optimo' },
    { ejeId: 'eje-len-2m-3', codigo: 'LEN-ARG-2M', nombre: 'Lectura Crítica de Textos Argumentativos y Medios Masivos', preguntasTotal: 7, respuestasCorrectas: 5, porcentajeLogro: 71, estado: 'alerta' },
    { ejeId: 'eje-len-2m-4', codigo: 'LEN-ESC-2M', nombre: 'Escritura y Fundamentación Textual (Desarrollo y Rúbricas)', preguntasTotal: 2, respuestasCorrectas: 1, porcentajeLogro: 58, estado: 'alerta' }
  ],
  desgloseHabilidades: [
    { habilidadId: 'hab-len-1', codigo: 'LEN-LOC', nombre: 'Localizar Información', preguntasTotal: 6, respuestasCorrectas: 9, porcentajeLogro: 90 },
    { habilidadId: 'hab-len-2', codigo: 'LEN-INT', nombre: 'Interpretar y Relacionar', preguntasTotal: 14, respuestasCorrectas: 11, porcentajeLogro: 78 },
    { habilidadId: 'hab-len-3', codigo: 'LEN-REF', nombre: 'Reflexionar e Inferir', preguntasTotal: 10, respuestasCorrectas: 6, porcentajeLogro: 62 }
  ],
  preguntasMasFalladas: [
    {
      pregunta: preguntasLenguaje2MMock[10],
      porcentajeError: 40,
      alternativaMasVotada: 'D (Sustituirá por completo a la justicia institucional - Extrapolación no fundamentada)',
      totalRespuestas: 10
    },
    {
      pregunta: preguntasLenguaje2MMock[28],
      porcentajeError: 30,
      alternativaMasVotada: 'Respuesta parcial (Solo cita 1 ejemplo del texto sin contrastar la postura)',
      totalRespuestas: 10
    }
  ],
  planAccionReforzamiento: [
    {
      id: 'plan-len-2m-1',
      titulo: 'Taller de Argumentación y Postura Crítica en Medios Masivos y Redes',
      eje: 'Lectura Crítica de Textos Argumentativos (LEN-ARG-2M)',
      habilidad: 'Reflexionar e Inferir (LEN-REF)',
      nivelAlerta: 'media',
      diagnostico: 'El 40% de los estudiantes confunde la crítica a la falta de prudencia en redes con una defensa absoluta o rechazo total de los medios digitales.',
      sugerenciaPedagogica: 'Trabajar matrices de doble entrada para evaluar argumentos a favor y en contra en columnas de opinión.',
      ejerciciosRecomendados: [
        'Guía de análisis crítico: Identificación de tesis, argumentos y contraargumentos.',
        'Debate guiado: Beneficios vs riesgos del escarnio público en internet.',
        'Ficha de lectura comparativa: Texto de opinión vs noticia informativa.'
      ]
    }
  ],
  rendiciones: []
};"""

reporte_pattern = r"export const reporteLenguajeMock: ReporteTabuladoCurso = \{.*?\n\};"
content = re.sub(reporte_pattern, new_reporte, content, flags=re.DOTALL)

with open(r'c:\Proyectos\Proyecto Evaluaciones Nacionales\src\data\mockData.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("mockData.ts updated and cleaned up successfully!")
