import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx > -1) {
        const key = trimmed.substring(0, idx).trim();
        let val = trimmed.substring(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    }
  }
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Falta URL o Key de Supabase en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false }
});

async function seedEvaluaciones2M() {
  console.log('🚀 Iniciando seeder de 2° Medio en Supabase Cloud...');

  // 1. Evaluaciones de catálogo sin asignar
  const evaluaciones = [
    {
      id: 'eval-simce-mat-2m-e3',
      titulo: 'Ensayo 3 SIMCE Matemática 2° Medio',
      descripcion: 'Evaluación formativa SIMCE de Matemática para 2° Medio. Cobertura completa de Números Reales, Álgebra y Funciones, Geometría, Trigonometría y Probabilidades.',
      tipo: 'simce',
      nivel: '2° Medio',
      asignatura_id: 'asig-1',
      duracion_minutos: 90,
      total_preguntas: 35,
      puntaje_maximo: 58,
      colegio_id: null,
      creado_por: null,
      es_catalogo: true,
      activo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'eval-simce-len-2m-e6',
      titulo: 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio',
      descripcion: 'Evaluación formativa SIMCE de Comprensión Lectora para 2° Medio. Cuatro lecturas comprensivas: Texto Narrativo («El fiscal»), Divulgación Médica («Miedo odontológico»), Ensayo Argumentativo («Productividad») y Poema Lírico («A mi hijo»).',
      tipo: 'simce',
      nivel: '2° Medio',
      asignatura_id: 'asig-2',
      duracion_minutos: 90,
      total_preguntas: 35,
      puntaje_maximo: 66,
      colegio_id: null,
      creado_por: null,
      es_catalogo: true,
      activo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  for (const evalItem of evaluaciones) {
    const { error } = await supabase
      .from('evaluaciones')
      .upsert(evalItem, { onConflict: 'id' });

    if (error) {
      console.error(`❌ Error insertando evaluación ${evalItem.id}:`, error.message);
    } else {
      console.log(`✅ Evaluación ${evalItem.titulo} insertada en public.evaluaciones (es_catalogo = true, sin docente asignado).`);
    }
  }

  // 2. Cargar preguntas
  const mat2m = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../scratch/mat2m_parsed.json'), 'utf8'));
  const len2m = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../scratch/lectura2m_parsed.json'), 'utf8'));

  const allPreguntas = [];

  for (const p of mat2m) {
    allPreguntas.push({
      id: `preg-mat2m-e3-${String(p.numero).padStart(2, '0')}`,
      evaluacion_id: 'eval-simce-mat-2m-e3',
      asignatura_id: 'asig-1',
      eje_id: p.eje_id,
      habilidad_id: p.habilidad_id,
      numero_pregunta: p.numero,
      enunciado: p.enunciado,
      alternativas: p.alternativas,
      clave_correcta: p.clave,
      puntaje: p.puntaje,
      tipo: 'seleccion_multiple',
      nivel_escolar: '2° Medio',
      complejidad: p.complejidad,
      imagen_url: p.imagen_url || null,
      explicacion: p.explicacion,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  for (const p of len2m) {
    allPreguntas.push({
      id: `preg-len2m-e6-${String(p.numero).padStart(2, '0')}`,
      evaluacion_id: 'eval-simce-len-2m-e6',
      asignatura_id: 'asig-2',
      eje_id: p.eje_id,
      habilidad_id: p.habilidad_id,
      numero_pregunta: p.numero,
      enunciado: p.enunciado,
      alternativas: p.alternativas,
      clave_correcta: p.clave,
      puntaje: p.puntaje,
      tipo: 'seleccion_multiple',
      nivel_escolar: '2° Medio',
      complejidad: p.complejidad,
      imagen_url: p.imagen_url || null,
      explicacion: p.explicacion,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  console.log(`📦 Insertando ${allPreguntas.length} preguntas en public.preguntas...`);
  
  // Insertar en lotes de 20
  for (let i = 0; i < allPreguntas.length; i += 20) {
    const batch = allPreguntas.slice(i, i + 20);
    const { error: pregError } = await supabase
      .from('preguntas')
      .upsert(batch, { onConflict: 'id' });

    if (pregError) {
      console.error(`❌ Error en lote preguntas ${i + 1}-${i + batch.length}:`, pregError.message);
    } else {
      console.log(`✅ Lote ${i + 1} a ${i + batch.length} insertado.`);
    }
  }

  console.log('\n🎉 ¡Evaluaciones y preguntas de 2° Medio persistidas exitosamente en Supabase!');
}

seedEvaluaciones2M();
