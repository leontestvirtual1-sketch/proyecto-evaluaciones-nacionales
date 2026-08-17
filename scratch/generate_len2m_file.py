# -*- coding: utf-8 -*-
import json

with open(r'c:\Proyectos\Proyecto Evaluaciones Nacionales\scratch\scratch_insert_len2m.py', 'r', encoding='utf-8') as f:
    code = f.read()

loc = {}
exec(code, loc, loc)
questions_data = loc['questions_data']

ts_questions = []
for q in questions_data:
    alts_formatted = []
    for alt in q['alternativas']:
        alt_str = f"      {{ letra: '{alt['letra']}', texto: {json.dumps(alt['texto'], ensure_ascii=False)}, es_correcta: {'true' if alt['es_correcta'] else 'false'} }}"
        alts_formatted.append(alt_str)
    alts_block = "[\n" + ",\n".join(alts_formatted) + "\n    ]" if alts_formatted else "[]"
    
    img_line = f"    imagenUrl: '{q['imagenUrl']}',\n" if 'imagenUrl' in q else ""
    resp = json.dumps(q['respuestaCorrecta'], ensure_ascii=False) if q['respuestaCorrecta'] is not None else 'null'
    enunc = json.dumps(q['enunciado'], ensure_ascii=False)
    
    ts_q = f"""  {{
    id: '{q['id']}',
    asignaturaId: '{q['asignaturaId']}',
    ejeTematicoId: '{q['ejeTematicoId']}',
    habilidadId: '{q['habilidadId']}',
    tipo: '{q['tipo']}',
    nivel: '{q['nivel']}',
    dificultad: '{q['dificultad']}',
{img_line}    enunciado: {enunc},
    alternativas: {alts_block},
    respuestaCorrecta: {resp},
    puntaje: {q['puntaje']},
    fuente: '{q['fuente']}'
  }}"""
    ts_questions.append(ts_q)

questions_export = "export const preguntasLenguaje2MMock: Pregunta[] = [\n" + ",\n\n".join(ts_questions) + "\n];\n"

header = """import { Pregunta, EjeTematico, Prueba, AlumnoBasico, Curso, ReporteTabuladoCurso } from '../types';
import { currentUserProfesorPremilitar } from './mockData';

export const ejesTematicosLenguaje2MMock: EjeTematico[] = [
  { id: 'eje-len-2m-1', codigo: 'LEN-LIT-2M', nombre: 'Lectura de Textos Literarios (Narrativa y Epistolar)', asignaturaId: 'asig-2' },
  { id: 'eje-len-2m-2', codigo: 'LEN-NOLIT-2M', nombre: 'Lectura de Textos No Literarios (Expositivos y Científicos)', asignaturaId: 'asig-2' },
  { id: 'eje-len-2m-3', codigo: 'LEN-ARG-2M', nombre: 'Lectura Crítica de Textos Argumentativos y Medios Masivos', asignaturaId: 'asig-2' },
  { id: 'eje-len-2m-4', codigo: 'LEN-ESC-2M', nombre: 'Escritura y Fundamentación Textual (Desarrollo y Rúbricas)', asignaturaId: 'asig-2' }
];

export const cursoLenguaje2MMock: Curso = {
  id: 'curso-2m',
  nombre: '2° Medio A',
  nivel: '2° medio',
  profesorId: '98e7e5c9-e55d-4b47-bd5d-c6aabd463d18',
  establecimiento: 'Escuela Premilitar Héroes de la Concepción',
  anio: 2026,
  codigoInvitacion: 'LEN2M2026'
};

export const alumnosLenguaje2MMock: AlumnoBasico[] = [
  { id: 'alu-201', rut: '20.101.001-1', nombre: 'Agustín', apellido: 'Alarcón Silva', cursoId: 'curso-2m', cursoNombre: '2° Medio A', numeroDeLista: 1 },
  { id: 'alu-202', rut: '20.102.002-2', nombre: 'Bárbara', apellido: 'Bustos Carrasco', cursoId: 'curso-2m', cursoNombre: '2° Medio A', numeroDeLista: 2 },
  { id: 'alu-203', rut: '20.103.003-3', nombre: 'Cristóbal', apellido: 'Cisternas Palma', cursoId: 'curso-2m', cursoNombre: '2° Medio A', numeroDeLista: 3 },
  { id: 'alu-204', rut: '20.104.004-4', nombre: 'Dominique', apellido: 'Duarte Morales', cursoId: 'curso-2m', cursoNombre: '2° Medio A', numeroDeLista: 4 },
  { id: 'alu-205', rut: '20.105.005-5', nombre: 'Esteban', apellido: 'Encalada Vega', cursoId: 'curso-2m', cursoNombre: '2° Medio A', numeroDeLista: 5 },
  { id: 'alu-206', rut: '20.106.006-6', nombre: 'Francisca', apellido: 'Flores Garrido', cursoId: 'curso-2m', cursoNombre: '2° Medio A', numeroDeLista: 6 },
  { id: 'alu-207', rut: '20.107.007-7', nombre: 'Gonzalo', apellido: 'Gutiérrez Pinto', cursoId: 'curso-2m', cursoNombre: '2° Medio A', numeroDeLista: 7 },
  { id: 'alu-208', rut: '20.108.008-8', nombre: 'Helena', apellido: 'Henríquez Toro', cursoId: 'curso-2m', cursoNombre: '2° Medio A', numeroDeLista: 8 },
  { id: 'alu-209', rut: '20.109.009-9', nombre: 'Ignacio', apellido: 'Iturra Zamorano', cursoId: 'curso-2m', cursoNombre: '2° Medio A', numeroDeLista: 9 },
  { id: 'alu-210', rut: '20.110.010-K', nombre: 'Josefa', apellido: 'Jara Sepúlveda', cursoId: 'curso-2m', cursoNombre: '2° Medio A', numeroDeLista: 10 }
];

export const pruebaLenguaje2MMock: Prueba = {
  id: 'prueba-len2m-101',
  titulo: 'Ensayo SIMCE Lengua y Literatura 2° Medio — Agosto 2026',
  descripcion: 'Evaluación formativa oficial SIMCE (Agosto 2026): Textos expositivos, artículos de opinión, reportajes, divulgación científica botánica y literatura epistolar.',
  asignaturaId: 'asig-2',
  asignaturaNombre: 'Lenguaje y Comunicación',
  nivel: '2° medio',
  profesorId: '98e7e5c9-e55d-4b47-bd5d-c6aabd463d18',
  cursoId: 'curso-2m',
  cursoNombre: '2° Medio A',
  codigoPublico: 'SIMCE-2M-LEN-AGO',
  duracionMinutos: 90,
  creadoEn: '2026-08-16',
  preguntasIds: [
    'preg-len2m-01', 'preg-len2m-02', 'preg-len2m-03', 'preg-len2m-04', 'preg-len2m-05',
    'preg-len2m-06', 'preg-len2m-07', 'preg-len2m-08', 'preg-len2m-09', 'preg-len2m-10',
    'preg-len2m-11', 'preg-len2m-12', 'preg-len2m-13', 'preg-len2m-14', 'preg-len2m-15',
    'preg-len2m-16', 'preg-len2m-17', 'preg-len2m-18', 'preg-len2m-19', 'preg-len2m-20',
    'preg-len2m-21', 'preg-len2m-22', 'preg-len2m-23', 'preg-len2m-24', 'preg-len2m-25',
    'preg-len2m-26', 'preg-len2m-27', 'preg-len2m-28', 'preg-len2m-29', 'preg-len2m-30'
  ],
  totalPreguntas: 30,
  estado: 'activa'
};

"""

full_file = header + "\n" + questions_export

with open(r'c:\Proyectos\Proyecto Evaluaciones Nacionales\src\data\len2mQuestionsMock.ts', 'w', encoding='utf-8') as f:
    f.write(full_file)

print("Generated src/data/len2mQuestionsMock.ts successfully!")
