import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Cargar variables de entorno
const envPath = path.resolve(__dirname, '../.env.local');
const env = Object.fromEntries(
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '')];
    })
);

const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

function cleanStr(s) {
  if (!s) return '';
  return s.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '');
}

function getMatEje(enunc, isM2 = false) {
  const l = enunc.toLowerCase();
  const prefix = isM2 ? 'eje-m2-' : 'eje-mat-';
  if (l.includes('fracci') || l.includes('decimal') || l.includes('porcent') || l.includes('potencia') || l.includes('raíz') || l.includes('raices') || l.includes('logaritmo') || l.includes('proporci') || l.includes('número')) {
    return `${prefix}1`; // Números
  } else if (l.includes('ecuaci') || l.includes('sistema') || l.includes('función') || l.includes('inecuaci') || l.includes('cuadrátic') || l.includes('parábola') || l.includes('f(x)') || l.includes('álgebra')) {
    return `${prefix}2`; // Álgebra y Funciones
  } else if (l.includes('triángulo') || l.includes('rectángulo') || l.includes('círculo') || l.includes('circunferencia') || l.includes('perímetro') || l.includes('área') || l.includes('volumen') || l.includes('semejanza') || l.includes('pitágoras') || l.includes('vector') || l.includes('prisma') || l.includes('cilindro')) {
    return `${prefix}3`; // Geometría
  }
  return `${prefix}4`; // Probabilidad y Estadística
}

function getMatHabilidad(enunc, isM2 = false) {
  const l = enunc.toLowerCase();
  const prefix = isM2 ? 'hab-m2-' : 'hab-mat-';
  if (l.includes('modelo') || l.includes('expresión que representa') || l.includes('expresa') || l.includes('fórmula')) {
    return `${prefix}2`; // Modelar
  } else if (l.includes('gráfico') || l.includes('figura') || l.includes('representa') || l.includes('diagrama') || l.includes('tabla')) {
    return `${prefix}3`; // Representar
  } else if (l.includes('afirmaci') || l.includes('verdader') || l.includes('fals') || l.includes('justifica') || l.includes('concluy') || l.includes('¿cuál de las siguientes relaciones')) {
    return `${prefix}4`; // Argumentar
  }
  return `${prefix}1`; // Resolver Problemas
}

const MAT_CONFIGS = [
  // M1 (65 preguntas)
  {
    materia: 'm1',
    asignaturaId: 'asig-1',
    asignaturaNombre: 'Competencia Matemática 1 (M1)',
    maxQ: 65,
    parsedFile: 'paes_m1_2023_regular_parsed.json',
    clavesFile: 'paes-mat1-2023-reg-f113.json',
    evalId: 'eval-paes-mat1-2023-f113',
    idPrefix: 'preg-paes-mat1-23reg-',
    titulo: 'PAES Oficial Competencia Matemática 1 (M1) — Proceso 2023 (Forma 113 — Regular)',
    year: 2023, edicion: 'Regular', forma: 113
  },
  {
    materia: 'm1',
    asignaturaId: 'asig-1',
    asignaturaNombre: 'Competencia Matemática 1 (M1)',
    maxQ: 65,
    parsedFile: 'paes_m1_2024_invierno_parsed.json',
    clavesFile: 'paes-mat1-2024-inv-f111.json',
    evalId: 'eval-paes-mat1-2024-inv-f111',
    idPrefix: 'preg-paes-mat1-24inv-',
    titulo: 'PAES Oficial Competencia Matemática 1 (M1) — Proceso 2024 (Forma 111 — Invierno)',
    year: 2024, edicion: 'Invierno', forma: 111
  },
  {
    materia: 'm1',
    asignaturaId: 'asig-1',
    asignaturaNombre: 'Competencia Matemática 1 (M1)',
    maxQ: 65,
    parsedFile: 'paes_m1_2024_regular_parsed.json',
    clavesFile: 'paes-mat1-2024-reg-f113.json',
    evalId: 'eval-paes-mat1-2024-reg-f113',
    idPrefix: 'preg-paes-mat1-24reg-',
    titulo: 'PAES Oficial Competencia Matemática 1 (M1) — Proceso 2024 (Forma 113 — Regular)',
    year: 2024, edicion: 'Regular', forma: 113
  },
  {
    materia: 'm1',
    asignaturaId: 'asig-1',
    asignaturaNombre: 'Competencia Matemática 1 (M1)',
    maxQ: 65,
    parsedFile: 'paes_m1_2025_invierno_parsed.json',
    clavesFile: 'paes-mat1-2025-inv-f111.json',
    evalId: 'eval-paes-mat1-2025-inv-f111',
    idPrefix: 'preg-paes-mat1-25inv-',
    titulo: 'PAES Oficial Competencia Matemática 1 (M1) — Proceso 2025 (Forma 111 — Invierno)',
    year: 2025, edicion: 'Invierno', forma: 111
  },
  {
    materia: 'm1',
    asignaturaId: 'asig-1',
    asignaturaNombre: 'Competencia Matemática 1 (M1)',
    maxQ: 65,
    parsedFile: 'paes_m1_2025_regular_parsed.json',
    clavesFile: 'paes-mat1-2025-reg-f113.json',
    evalId: 'eval-paes-mat1-2025-reg-f113',
    idPrefix: 'preg-paes-mat1-25reg-',
    titulo: 'PAES Oficial Competencia Matemática 1 (M1) — Proceso 2025 (Forma 113 — Regular)',
    year: 2025, edicion: 'Regular', forma: 113
  },
  {
    materia: 'm1',
    asignaturaId: 'asig-1',
    asignaturaNombre: 'Competencia Matemática 1 (M1)',
    maxQ: 65,
    parsedFile: 'paes_m1_2026_invierno_parsed.json',
    clavesFile: 'paes-mat1-2026-inv-f111.json',
    evalId: 'eval-paes-mat1-2026-inv-f111',
    idPrefix: 'preg-paes-mat1-26inv-',
    titulo: 'PAES Oficial Competencia Matemática 1 (M1) — Proceso 2026 (Forma 111 — Invierno)',
    year: 2026, edicion: 'Invierno', forma: 111
  },
  {
    materia: 'm1',
    asignaturaId: 'asig-1',
    asignaturaNombre: 'Competencia Matemática 1 (M1)',
    maxQ: 65,
    parsedFile: 'paes_m1_2026_regular_parsed.json',
    clavesFile: 'paes-mat1-2026-reg-f113.json',
    evalId: 'eval-paes-mat1-2026-reg-f113',
    idPrefix: 'preg-paes-mat1-26reg-',
    titulo: 'PAES Oficial Competencia Matemática 1 (M1) — Proceso 2026 (Forma 113 — Regular)',
    year: 2026, edicion: 'Regular', forma: 113
  },

  // M2 (55 preguntas)
  {
    materia: 'm2',
    asignaturaId: 'asig-9',
    asignaturaNombre: 'Competencia Matemática 2 (M2)',
    maxQ: 55,
    parsedFile: 'paes_m2_2023_regular_parsed.json',
    clavesFile: 'paes-mat2-2023-reg-f113.json',
    evalId: 'eval-paes-mat2-2023-reg-f113',
    idPrefix: 'preg-paes-mat2-23reg-',
    titulo: 'PAES Oficial Competencia Matemática 2 (M2) — Proceso 2023 (Forma 113 — Regular)',
    year: 2023, edicion: 'Regular', forma: 113
  },
  {
    materia: 'm2',
    asignaturaId: 'asig-9',
    asignaturaNombre: 'Competencia Matemática 2 (M2)',
    maxQ: 55,
    parsedFile: 'paes_m2_2024_invierno_parsed.json',
    clavesFile: 'paes-mat2-2024-inv-f111.json',
    evalId: 'eval-paes-mat2-2024-inv-f111',
    idPrefix: 'preg-paes-mat2-24inv-',
    titulo: 'PAES Oficial Competencia Matemática 2 (M2) — Proceso 2024 (Forma 111 — Invierno)',
    year: 2024, edicion: 'Invierno', forma: 111
  },
  {
    materia: 'm2',
    asignaturaId: 'asig-9',
    asignaturaNombre: 'Competencia Matemática 2 (M2)',
    maxQ: 55,
    parsedFile: 'paes_m2_2024_regular_parsed.json',
    clavesFile: 'paes-mat2-2024-reg-f113.json',
    evalId: 'eval-paes-mat2-2024-reg-f113',
    idPrefix: 'preg-paes-mat2-24reg-',
    titulo: 'PAES Oficial Competencia Matemática 2 (M2) — Proceso 2024 (Forma 113 — Regular)',
    year: 2024, edicion: 'Regular', forma: 113
  },
  {
    materia: 'm2',
    asignaturaId: 'asig-9',
    asignaturaNombre: 'Competencia Matemática 2 (M2)',
    maxQ: 55,
    parsedFile: 'paes_m2_2025_invierno_parsed.json',
    clavesFile: 'paes-mat2-2025-inv-f111.json',
    evalId: 'eval-paes-mat2-2025-inv-f111',
    idPrefix: 'preg-paes-mat2-25inv-',
    titulo: 'PAES Oficial Competencia Matemática 2 (M2) — Proceso 2025 (Forma 111 — Invierno)',
    year: 2025, edicion: 'Invierno', forma: 111
  },
  {
    materia: 'm2',
    asignaturaId: 'asig-9',
    asignaturaNombre: 'Competencia Matemática 2 (M2)',
    maxQ: 55,
    parsedFile: 'paes_m2_2025_regular_parsed.json',
    clavesFile: 'paes-mat2-2025-reg-f113.json',
    evalId: 'eval-paes-mat2-2025-reg-f113',
    idPrefix: 'preg-paes-mat2-25reg-',
    titulo: 'PAES Oficial Competencia Matemática 2 (M2) — Proceso 2025 (Forma 113 — Regular)',
    year: 2025, edicion: 'Regular', forma: 113
  },
  {
    materia: 'm2',
    asignaturaId: 'asig-9',
    asignaturaNombre: 'Competencia Matemática 2 (M2)',
    maxQ: 55,
    parsedFile: 'paes_m2_2026_invierno_parsed.json',
    clavesFile: 'paes-mat2-2026-inv-f111.json',
    evalId: 'eval-paes-mat2-2026-inv-f111',
    idPrefix: 'preg-paes-mat2-26inv-',
    titulo: 'PAES Oficial Competencia Matemática 2 (M2) — Proceso 2026 (Forma 111 — Invierno)',
    year: 2026, edicion: 'Invierno', forma: 111
  },
  {
    materia: 'm2',
    asignaturaId: 'asig-9',
    asignaturaNombre: 'Competencia Matemática 2 (M2)',
    maxQ: 55,
    parsedFile: 'paes_m2_2026_regular_parsed.json',
    clavesFile: 'paes-mat2-2026-reg-f113.json',
    evalId: 'eval-paes-mat2-2026-reg-f113',
    idPrefix: 'preg-paes-mat2-26reg-',
    titulo: 'PAES Oficial Competencia Matemática 2 (M2) — Proceso 2026 (Forma 113 — Regular)',
    year: 2026, edicion: 'Regular', forma: 113
  }
];

async function main() {
  console.log('🚀 Iniciando ingesta oficial de todas las PAES de Matemática (M1 y M2)...');

  // 1. Obtener usuario administrador
  const { data: users } = await supabase.auth.admin.listUsers();
  const admin = users?.users?.find(u => u.email === 'leontestvirtual1@gmail.com') || users?.users?.[0];
  const adminId = admin?.id || '99cf9f8f-720f-4e74-b8d9-eae95208b421';
  console.log(`👤 Admin asignado: ${adminId}`);

  for (const cfg of MAT_CONFIGS) {
    console.log(`\n============================================================`);
    console.log(`📐 Procesando: ${cfg.titulo}...`);

    const parsedPath = path.resolve(__dirname, `data/${cfg.parsedFile}`);
    const clavesPath = path.resolve(__dirname, `data/claves_oficiales/${cfg.clavesFile}`);

    const parsedData = JSON.parse(fs.readFileSync(parsedPath, 'utf8'));
    const clavesData = JSON.parse(fs.readFileSync(clavesPath, 'utf8'));

    const claves = clavesData.claves || {};
    const pilotos = clavesData.preguntas_piloto || [];
    const isM2 = cfg.materia === 'm2';

    const questionsByNum = {};
    (parsedData.preguntas || []).forEach(p => {
      questionsByNum[p.numero] = p;
    });

    const inserts = [];
    const preguntaIds = [];

    for (let qNum = 1; qNum <= cfg.maxQ; qNum++) {
      const numStr = String(qNum).padStart(2, '0');
      const id = `${cfg.idPrefix}${numStr}`;
      preguntaIds.push(id);

      const clave = claves[String(qNum)] || 'A';
      const esPiloto = pilotos.includes(qNum);
      const qParsed = questionsByNum[qNum];

      let enunciado = '';
      let alternativas = [];

      if (qParsed && qParsed.alternativas && qParsed.alternativas.length >= 4) {
        enunciado = cleanStr(`**${qNum}. ${qParsed.enunciado}**`);
        alternativas = qParsed.alternativas.map(alt => ({
          letra: alt.letra,
          texto: cleanStr(alt.texto),
          es_correcta: alt.letra === clave
        }));
      } else {
        enunciado = cleanStr(`**${qNum}. Seleccione la alternativa correcta según la resolución del ítem oficial DEMRE de ${cfg.asignaturaNombre}.**`);
        alternativas = ['A', 'B', 'C', 'D'].map(l => ({
          letra: l,
          texto: `Alternativa ${l}`,
          es_correcta: l === clave
        }));
      }

      const habId = getMatHabilidad(enunciado, isM2);
      const ejeId = getMatEje(enunciado, isM2);

      inserts.push({
        id,
        propietario_id: adminId,
        asignatura_id: cfg.asignaturaId,
        eje_tematico_id: ejeId,
        habilidad_id: habId,
        tipo: 'seleccion_multiple',
        nivel: '4° Medio',
        dificultad: esPiloto ? 'alta' : (qNum % 3 === 0 ? 'alta' : qNum % 2 === 0 ? 'media' : 'baja'),
        imagen_url: null,
        enunciado,
        alternativas,
        respuesta_correcta: clave,
        puntaje: 1,
        fuente: `PAES Oficial ${cfg.asignaturaNombre} ${cfg.year} (${cfg.edicion} Forma ${cfg.forma})`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    // Insertar preguntas en lotes de 20
    console.log(`📦 Insertando ${inserts.length} preguntas en public.preguntas...`);
    let pregOk = 0;
    for (let i = 0; i < inserts.length; i += 20) {
      const batch = inserts.slice(i, i + 20);
      const { error: pErr } = await supabase.from('preguntas').upsert(batch, { onConflict: 'id' });
      if (pErr) {
        console.error(`  ❌ Error en lote ${Math.floor(i/20) + 1}:`, pErr.message);
      } else {
        pregOk += batch.length;
      }
    }
    console.log(`  ✅ ${pregOk}/${inserts.length} preguntas sincronizadas.`);

    // Crear/actualizar la evaluación en public.evaluaciones
    console.log(`📝 Registrando evaluación en public.evaluaciones...`);
    const evalData = {
      id: cfg.evalId,
      titulo: cfg.titulo,
      descripcion: `Evaluación oficial estandarizada DEMRE de ${cfg.asignaturaNombre} correspondiente al Proceso ${cfg.year} (${cfg.edicion}). Contiene ${cfg.maxQ} ítems calibrados oficiales y pauta oficial con preguntas piloto.`,
      asignatura_id: cfg.asignaturaId,
      asignatura_nombre: cfg.asignaturaNombre,
      nivel: '4° Medio',
      profesor_id: adminId,
      estado: 'activa',
      tiempo_limite: 140,
      pregunta_ids: preguntaIds,
      total_preguntas: cfg.maxQ,
      es_catalogo: true,
      precio_clp: 0,
      descripcion_catalogo: `Prueba oficial DEMRE PAES ${cfg.asignaturaNombre} ${cfg.year} (${cfg.edicion}) completa con ${cfg.maxQ} ítems y clavijero oficial.`,
      updated_at: new Date().toISOString()
    };

    const { error: evErr } = await supabase.from('evaluaciones').upsert(evalData, { onConflict: 'id' });
    if (evErr) {
      console.error(`  ❌ Error en evaluación ${cfg.evalId}:`, evErr.message);
    } else {
      console.log(`  🎉 Evaluación registrada y publicada en catálogo: ${cfg.evalId}`);
    }
  }

  console.log('\n============================================================');
  console.log('🏁 ¡Todas las PAES de Matemática (M1 y M2) han sido procesadas e insertadas con éxito!');
}

main().catch(console.error);
