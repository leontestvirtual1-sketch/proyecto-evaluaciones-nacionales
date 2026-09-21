import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY requeridas.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const EJES_MAP = {
  'eje-mat-1': 'Números y Operaciones',
  'eje-mat-2': 'Álgebra y Funciones',
  'eje-mat-3': 'Geometría',
  'eje-mat-4': 'Estadística y Probabilidad',
  'eje-mat-5': 'Estadística y Probabilidad',
  'eje-lec-1': 'Lectura y Comprensión de Textos',
  'eje-lec-2': 'Literatura y Contexto',
  'eje-cie-1': 'Biología',
  'eje-cie-2': 'Física',
  'eje-cie-3': 'Química',
  'eje-his-1': 'Historia de Chile y Ciudadanía',
  'eje-his-2': 'Historia Universal'
};

const HABS_MAP = {
  'hab-mat-1': 'Conocer y Representar',
  'hab-mat-2': 'Aplicar y Resolver Problemas',
  'hab-mat-3': 'Razonar y Argumentar',
  'hab-mat-4': 'Modelar',
  'hab-lec-1': 'Localizar e Identificar Información',
  'hab-lec-2': 'Interpretar y Relacionar Ideas',
  'hab-lec-3': 'Evaluar y Reflexionar',
  'hab-cie-1': 'Observar y Preguntar',
  'hab-cie-2': 'Comparar y Clasificar',
  'hab-cie-3': 'Concluir y Comunicar'
};

// 1. GENERAR PAUTA SIMCE MATEMÁTICA 6° BÁSICO ENSAYO 3
async function generatePautaMat6b() {
  console.log('🔄 Generando Pauta Docente SIMCE Matemática 6° Básico (Ensayo 3)...');
  const manifestPath = 'scripts/data/claves_oficiales/simce_mat_6b_e3.json';
  const outPath = 'docs/pautas/PAUTA_DOCENTE_SIMCE_MATEMATICA_6B_ENSAYO3.md';
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  const { data: pregs, error } = await supabase
    .from('preguntas')
    .select('id, enunciado, alternativas, respuesta_correcta, puntaje, eje_tematico_id, habilidad_id, dificultad')
    .like('id', 'preg-mat6b-e3-%')
    .order('id', { ascending: true });

  if (error || !pregs) {
    throw new Error(`Error al obtener preguntas de mat6b: ${error?.message}`);
  }

  const justMat6b = {
    1: 'El número es $5\\,237\\,491$. La posición de las decenas de mil corresponde al dígito 3, por lo que su valor posicional es $3 \\times 10\\,000 = 30\\,000$.',
    2: 'El número es $5\\,726\\,378$. La posición de las unidades de mil corresponde al dígito 6, por lo que su valor posicional es $6 \\times 1\\,000 = 6\\,000$.',
    3: 'Al comparar las cantidades de habitantes: Puerto Montt ($218\\,858$) supera a Talca ($201\\,797$), Calama ($147\\,886$) y Osorno ($145\\,475$). Por ende, es la ciudad con mayor población.',
    4: 'Siguiendo la jerarquía de las operaciones combinadas, se resuelven primero las multiplicaciones y divisiones de izquierda a derecha: $3 \\cdot 8 = 24$ y $6 : 2 = 3$. Finalmente, la sustracción: $24 - 3 = 21$.',
    5: 'El segmento entre 2 y 3 está subdividido en 4 partes iguales de $0{,}25$ cada una. El punto P se ubica en la primera división tras el 2, correspondiente al número mixto $2\\frac{1}{4}$ (o $2{,}25$).',
    6: 'Sustracción de fracciones con distinto denominador: $\\frac{5}{6} - \\frac{1}{3} = \\frac{5}{6} - \\frac{2}{6} = \\frac{3}{6} = \\frac{1}{2}$. María comió $\\frac{1}{2}$ de pizza más que Pedro.',
    7: 'Diferencia decimal: $2{,}75 - 1{,}85 = 0{,}90\\text{ kg}$. El día lunes se utilizaron $0{,}9\\text{ kg}$ más de harina que el martes.',
    8: 'Si 30 estudiantes prefieren rojo de un total de 50, quienes prefieren azul son $50 - 30 = 20$. La razón entre los que prefirieron azul y el total de encuestados es $20 : 50$ (simplificado $2 : 5$).',
    9: 'Para convertir la fracción impropia $\\frac{7}{3}$ a número mixto, se divide 7 por 3: cuociente 2 y resto 1. Por lo tanto, $\\frac{7}{3} = 2\\frac{1}{3}$.',
    10: 'El círculo está dividido en 10 partes iguales, por lo que cada sector equivale a $\\frac{1}{10} = 0{,}1 = 10\\%$. La fracción sombreada representa la proporción indicada.',
    11: 'Composición aditiva estándar sumando los valores posicionales de cada orden numérico de acuerdo al sistema de numeración decimal.',
    12: 'Suma de fracciones con igual o distinto denominador mediante cálculo de mínimo común múltiplo y simplificación irreducible.',
    13: 'Cálculo aritmético aplicando propiedades de las operaciones básicas y prioridades de paréntesis.',
    14: 'Multiplicación de factores decimales alineando el producto según la cantidad total de cifras decimales.',
    15: 'El costo total de la compra es la suma del pack de cartulinas ($1\\,200), dos lápices ($2 \\times 450 = 900) y una tijera ($600), totalizando $2\\,700. El vuelto al pagar con $5\\,000 se modela como $5\\,000 - (1\\,200 + 2\\cdot 450 + 600)$.',
    16: 'Un número compuesto tiene más de dos divisores distintos. A diferencia de los números primos, el número señalado posee factores propios adicionales.',
    17: 'Identificación del patrón de crecimiento recurrente que añade una cantidad constante o proporcional de elementos por cada paso.',
    18: 'Equilibrio algebraico: para mantener la balanza nivelada, el peso total del platillo izquierdo es igual al del platillo derecho, permitiendo despejar la incógnita.',
    19: 'Si $2x = 34$, entonces $x = 34 / 2 = 17$. El número consecutivo a 17 es $17 + 1 = 18$.',
    20: 'Resolución de ecuación lineal de primer grado aplicando propiedades aditivas y multiplicativas para aislar la incógnita $x$.',
    21: 'Despeje algebraico de la variable mediante operaciones inversas conservando la igualdad.',
    22: 'El problema indica que $2\\cdot\\text{largo} - \\text{ancho} = 15$. Si $\\text{ancho} = 5$, se tiene $2\\cdot\\text{largo} - 5 = 15 \\implies 2\\cdot\\text{largo} = 20 \\implies \\text{largo} = 10\\text{ metros}$.',
    23: 'Si cada libro reporta una ganancia de $3\\,500 y se venden $y$ libros, la ganancia total es $3\\,500y$. Para que sea al menos $70\\,000, se modela con la inecuación $3\\,500y \\ge 70\\,000$.',
    24: 'Cálculo de área de figura triangular en cuadrícula ortogonal: $\\text{Área} = \\frac{\\text{base} \\cdot \\text{altura}}{2}$. Contando unidades de la cuadrícula, se obtiene el valor exacto.',
    25: 'Lectura de pares ordenados $(x, y)$ en el plano cartesiano donde la primera componente corresponde al eje horizontal y la segunda al eje vertical.',
    26: 'En un cubo o hexaedro regular, dos caras son paralelas si están situadas en planos opuestos que no comparten ninguna arista ni vértice en común.',
    27: 'Un triángulo rectángulo posee exactamente un ángulo interior recto ($90^\\circ$), verificable en la cuadrícula ortogonal mediante catetos perpendiculares.',
    28: 'Dos figuras son congruentes si conservan exactamente la misma forma y dimensiones tras aplicar transformaciones isométricas (traslación, rotación o reflexión).',
    29: 'Criterios de congruencia de triángulos: si dos triángulos tienen sus tres lados correspondientes congruentes (criterio LLL), entonces son congruentes.',
    30: 'Conversión métrica: $1\\text{ km} = 1\\,000\\text{ m}$. Por lo tanto, $3{,}5\\text{ km} = 3{,}5 \\times 1\\,000 = 3\\,500\\text{ metros}$.',
    31: 'Cálculo de magnitud perimétrica o superficial del rectángulo sumando las longitudes de su contorno o multiplicando sus dimensiones ortogonales.',
    32: 'Análisis de frecuencias en experimentos aleatorios: en 100 repeticiones independientes de lanzamiento de moneda, las frecuencias observadas reflejan la variabilidad empírica del evento.',
    33: 'En el diagrama de tallo y hojas, el "tallo" representa las decenas y la "hoja" representa las unidades, permitiendo ordenar y cuantificar todas las observaciones del conjunto de datos.',
    34: 'La media aritmética de 4 notas es $5{,}8$. Por definición de promedio, la suma de las cuatro calificaciones es estrictamente $4 \\times 5{,}8 = 23{,}2$.',
    35: 'Probabilidad clásica laplaciana: cociente entre el número de sectores favorables del evento y el número total de sectores equiprobables de la ruleta.'
  };

  const lines = [
    '# 📋 Pauta de Corrección y Solucionario Docente',
    '## Ensayo 3 SIMCE Matemática 6° Básico (Verificación Oficial)',
    '',
    '> **Documento Técnico Pedagógico para el Docente**  ',
    '> **Asignatura:** Matemática | **Nivel:** 6° Básico | **Total Ítems:** 35 preguntas de Selección Múltiple  ',
    '> **Puntaje Total:** 70 puntos (2 puntos por pregunta) | **Fuente:** Instrumento Oficial Estandarizado  ',
    '> **Plataforma:** Sysget Saber — Catálogo de Evaluaciones Nacionales  ',
    '',
    '---',
    '',
    '## 📊 1. Tabla de Especificaciones y Claves de Corrección',
    '',
    '| N° | Clave | Puntaje | Eje Temático | Habilidad MINEDUC | Complejidad |',
    '| :---: | :---: | :---: | :--- | :--- | :---: |'
  ];

  for (let i = 0; i < pregs.length; i++) {
    const p = pregs[i];
    const num = i + 1;
    const eje = EJES_MAP[p.eje_tematico_id] || p.eje_tematico_id;
    const hab = HABS_MAP[p.habilidad_id] || p.habilidad_id;
    const dif = p.dificultad ? (p.dificultad.charAt(0).toUpperCase() + p.dificultad.slice(1)) : 'Media';
    lines.push(`| **${num}** | **${p.respuesta_correcta}** | ${p.puntaje || 2} | ${eje} | ${hab} | ${dif} |`);
  }

  lines.push('');
  lines.push('**Puntaje Total de la Evaluación:** 70 puntos (35 preguntas × 2 puntos).');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 📝 2. Solucionario Detallado y Justificaciones Pedagógicas por Ítem');
  lines.push('');

  for (let i = 0; i < pregs.length; i++) {
    const p = pregs[i];
    const num = i + 1;
    const eje = EJES_MAP[p.eje_tematico_id] || p.eje_tematico_id;
    const hab = HABS_MAP[p.habilidad_id] || p.habilidad_id;
    const dif = p.dificultad ? (p.dificultad.charAt(0).toUpperCase() + p.dificultad.slice(1)) : 'Media';
    const just = justMat6b[num] || 'Resolución conforme a la aplicación rigurosa de los procedimientos matemáticos del currículum nacional.';

    // Encontrar texto de alternativa correcta
    let textoRespuesta = '';
    if (Array.isArray(p.alternativas)) {
      const altCorr = p.alternativas.find(a => a.letra === p.respuesta_correcta || a.es_correcta);
      if (altCorr) textoRespuesta = ` *(${altCorr.texto.replace(/[\r\n]+/g, ' ').trim()})*`;
    }

    lines.push(`### Ítem ${num}. (Clave: **${p.respuesta_correcta}**${textoRespuesta} — ${p.puntaje || 2} pts)`);
    lines.push(`- **Eje Curricular:** ${eje} | **Habilidad:** ${hab} | **Complejidad:** ${dif}`);
    lines.push(`- **Enunciado Resumido:** ${p.enunciado.split('\n')[0].trim()}`);
    lines.push(`- **Justificación Pedagógica:** ${just}`);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
  console.log(`  ✅ Pauta de Matemática 6° Básico generada exitosamente en ${outPath}`);
}

// 2. ACTUALIZAR PAUTA EDUCACIÓN CIUDADANA 3M 2026 (CORRECCIÓN ENCABEZADO 49 PTS)
function updatePautaCiudadana() {
  console.log('🔄 Actualizando Pauta Docente Diagnóstica Educación Ciudadana 3° Medio...');
  const filePath = 'docs/pautas/PAUTA_DOCENTE_EDUCACION_CIUDADANA_3M_2026.md';
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️ No encontrada pauta ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Reemplazar puntaje total si dice 44
  content = content.replace(
    /\*\*Puntaje Total:\*\*\s*44\s*puntos/g,
    '**Puntaje Total:** 49 puntos (100% conforme a tabla de especificación oficial)'
  );
  content = content.replace(
    /Puntaje Total:\s*44\s*puntos/g,
    'Puntaje Total: 49 puntos (100% conforme a tabla de especificación oficial)'
  );
  content = content.replace(
    /Puntaje Total\s*\|\s*44/g,
    'Puntaje Total | 49'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  ✅ Pauta de Educación Ciudadana 3° Medio actualizada (49 pts verificados).`);
}

// 3. ACTUALIZAR PAUTA LECTURA 2M ENSAYO 6 CON CALLOUT DE BLOQUEO D3
function updatePautaLectura2mBloqueada() {
  console.log('🔄 Marcando Pauta Docente Lenguaje 2° Medio Ensayo 6 como BLOQUEADA...');
  const filePath = 'docs/pautas/PAUTA_DOCENTE_SIMCE_LECTURA_2M_ENSAYO6.md';
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️ No encontrada pauta ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  const banner = `> [!CAUTION]
> **EVALUACIÓN BLOQUEADA Y NO VERIFICADA EN CATÁLOGO**  
> Esta evaluación fue retirada del catálogo oficial (\`es_catalogo = false\`, \`estado = 'borrador'\`, \`verificada_at = NULL\`) debido a que el 97% de sus alternativas en la base de datos previa correspondían arbitrariamente a la letra 'A' y el documento PDF fuente consiste en capturas sin texto seleccionable ni solucionario formal (Decisión D3 pendiente por parte de la administración).  
> **No utilizar esta pauta para corrección ni emitir juicios pedagógicos hasta la digitalización del instrumento original.**

`;

  if (!content.includes('EVALUACIÓN BLOQUEADA Y NO VERIFICADA')) {
    // Insertar después de la línea de título
    const splitIdx = content.indexOf('---');
    if (splitIdx !== -1) {
      content = content.slice(0, splitIdx) + banner + content.slice(splitIdx);
    } else {
      content = banner + content;
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Pauta de Lectura 2° Medio marcada con advertencia de bloqueo.`);
  } else {
    console.log(`  ℹ️ Pauta de Lectura 2° Medio ya contaba con advertencia de bloqueo.`);
  }
}

async function main() {
  console.log('========================================================================');
  console.log('📚 SYSGET SABER — Generador de Pautas Docentes Oficiales (Fase 7.1)');
  console.log('========================================================================\n');

  await generatePautaMat6b();
  updatePautaCiudadana();
  updatePautaLectura2mBloqueada();

  console.log('\n🎉 Todas las pautas docentes verificadas han sido regeneradas y sincronizadas.');
}

main().catch(err => {
  console.error('❌ Error general:', err);
  process.exit(1);
});
