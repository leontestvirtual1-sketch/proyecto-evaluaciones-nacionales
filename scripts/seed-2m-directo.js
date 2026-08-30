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

const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

async function runMigration(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  // Supabase JS no ejecuta SQL raw directamente; usar rpc o el cliente admin
  // Usar la API REST de Supabase para ejecutar SQL via pg_net o via REST
  const { data, error } = await supabase.rpc('exec_sql', { query: sql });
  if (error) {
    console.error(`❌ Error en ${path.basename(filePath)}:`, error.message, error.details || '');
    return false;
  }
  console.log(`✅ ${path.basename(filePath)} aplicada exitosamente.`);
  return true;
}

// Verificar si existe la función exec_sql (si no, usamos inserción directa)
async function checkExecSql() {
  const { error } = await supabase.rpc('exec_sql', { query: 'SELECT 1' });
  return !error;
}

async function main() {
  console.log('🔍 Verificando conexión a Supabase...');
  const { data, error } = await supabase.from('evaluaciones').select('id').limit(1);
  if (error) {
    console.error('❌ Error de conexión:', error.message);
    return;
  }
  console.log('✅ Conexión OK.');

  const hasExecSql = await checkExecSql();
  
  if (hasExecSql) {
    console.log('Aplicando migraciones via exec_sql...');
    await runMigration(path.resolve(__dirname, '../supabase/migrations/034_ensayo_3_simce_matematica_2m.sql'));
    await runMigration(path.resolve(__dirname, '../supabase/migrations/035_ensayo_6_simce_lectura_2m.sql'));
  } else {
    console.log('⚠️  exec_sql no disponible — usando inserción directa...');
    
    // Obtener admin user id
    const { data: users, error: uErr } = await supabase.auth.admin.listUsers();
    let adminId = null;
    if (!uErr && users?.users?.length > 0) {
      const admin = users.users.find(u => u.email === 'leontestvirtual1@gmail.com') || users.users[0];
      adminId = admin?.id;
    }
    console.log(`Admin ID: ${adminId}`);

    // 1. Insertar evaluaciones
    const evaluaciones = [
      {
        id: 'eval-simce-mat-2m-e3',
        titulo: 'Ensayo 3 SIMCE Matemática 2° Medio',
        descripcion: 'Evaluación oficial SIMCE de Matemática para 2° Medio. Mide Números y Operaciones, Álgebra y Funciones, Geometría, Medición y Probabilidad y Estadística.',
        asignatura_id: 'asig-1',
        nivel: '2° Medio',
        tiempo_limite: 90,
        estado: 'activa',
        es_catalogo: true,
        precio_clp: 0,
        descripcion_catalogo: 'Evaluación integral estándar SIMCE de Matemática 2° Medio con 35 ítems de selección múltiple, alineación curricular MINEDUC y distribución psicométrica equilibrada.',
        profesor_id: null,
        total_preguntas: 35,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'eval-simce-len-2m-e6',
        titulo: 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio',
        descripcion: 'Evaluación formativa SIMCE de Comprensión Lectora para 2° Medio. Cuatro lecturas: Narrativo («El fiscal»), Divulgación Médica, Ensayo Argumentativo y Poema Lírico.',
        asignatura_id: 'asig-2',
        nivel: '2° Medio',
        tiempo_limite: 90,
        estado: 'activa',
        es_catalogo: true,
        precio_clp: 0,
        descripcion_catalogo: 'Evaluación integral estándar SIMCE de Lengua y Literatura 2° Medio con 35 ítems de selección múltiple sobre lecturas literarias, no literarias y argumentativas.',
        profesor_id: null,
        total_preguntas: 35,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const ev of evaluaciones) {
      const { error: evErr } = await supabase.from('evaluaciones').upsert(ev, { onConflict: 'id' });
      if (evErr) {
        // Intentar sin campos opcionales
        const { titulo, descripcion, asignatura_id, nivel, tiempo_limite, estado, es_catalogo, profesor_id, total_preguntas, created_at, updated_at } = ev;
        const { error: evErr2 } = await supabase.from('evaluaciones').upsert(
          { id: ev.id, titulo, descripcion, asignatura_id, nivel, tiempo_limite, estado, es_catalogo, profesor_id, total_preguntas, created_at, updated_at },
          { onConflict: 'id' }
        );
        if (evErr2) {
          console.error(`❌ Error insertando ${ev.id}:`, evErr2.message);
        } else {
          console.log(`✅ Evaluación ${ev.titulo} insertada (modo simplificado).`);
        }
      } else {
        console.log(`✅ Evaluación ${ev.titulo} insertada.`);
      }
    }

    // 2. Insertar preguntas
    const mat2m = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../scratch/mat2m_parsed.json'), 'utf8'));
    const len2m = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../scratch/lectura2m_parsed.json'), 'utf8'));

    const allPreguntas = [];

    for (const p of mat2m) {
      allPreguntas.push({
        id: `preg-mat2m-e3-${String(p.numero).padStart(2, '0')}`,
        propietario_id: adminId,
        asignatura_id: 'asig-1',
        eje_tematico_id: p.eje_id,
        habilidad_id: p.habilidad_id,
        tipo: 'seleccion_multiple',
        nivel: '2° Medio',
        dificultad: p.complejidad,
        imagen_url: p.imagen_url || null,
        enunciado: p.enunciado,
        alternativas: p.alternativas,
        respuesta_correcta: p.clave,
        puntaje: p.puntaje,
        fuente: 'Ensayo 3 SIMCE Matemática 2° Medio',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    for (const p of len2m) {
      allPreguntas.push({
        id: `preg-len2m-e6-${String(p.numero).padStart(2, '0')}`,
        propietario_id: adminId,
        asignatura_id: 'asig-2',
        eje_tematico_id: p.eje_id,
        habilidad_id: p.habilidad_id,
        tipo: 'seleccion_multiple',
        nivel: '2° Medio',
        dificultad: p.complejidad,
        imagen_url: null,
        enunciado: p.enunciado,
        alternativas: p.alternativas,
        respuesta_correcta: p.clave,
        puntaje: p.puntaje,
        fuente: 'Ensayo 6 SIMCE Lengua y Literatura 2° Medio',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    console.log(`\n📦 Insertando ${allPreguntas.length} preguntas (lotes de 15)...`);
    let success = 0;
    let fail = 0;

    for (let i = 0; i < allPreguntas.length; i += 15) {
      const batch = allPreguntas.slice(i, i + 15);
      const { error: pregErr } = await supabase.from('preguntas').upsert(batch, { onConflict: 'id' });
      if (pregErr) {
        console.error(`❌ Error lote ${i + 1}-${i + batch.length}:`, pregErr.message);
        fail += batch.length;
      } else {
        console.log(`✅ Lote ${i + 1}-${i + batch.length} insertado.`);
        success += batch.length;
      }
    }

    console.log(`\n========================================`);
    console.log(`📊 Resumen:`);
    console.log(`   - Preguntas exitosas: ${success}`);
    console.log(`   - Preguntas fallidas: ${fail}`);
    console.log(`   - Total: ${allPreguntas.length}`);
    console.log(`========================================`);
    console.log('\n🎉 ¡Evaluaciones de 2° Medio persistidas en Supabase!');
  }
}

main();
